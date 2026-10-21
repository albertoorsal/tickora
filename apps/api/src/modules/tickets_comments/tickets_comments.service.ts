import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CreateTicketHistoryInput } from 'src/modules/ticket_history/dto/create-ticket-history.input';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';
import { TICKET_ADDED_COMMENT } from 'src/modules/tickets/constants/actions';
import { TicketsService } from 'src/modules/tickets/tickets.service';
import { CreateTicketCommentInput } from 'src/modules/tickets_comments/dto/create-ticket-comment.input';
import { UpdateTicketCommentInput } from 'src/modules/tickets_comments/dto/update-ticket-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/modules/users/enums/role';

@Injectable()
export class TicketsCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ticketHistoryService: TicketHistoryService,
    private readonly ticketService: TicketsService,
  ) {}

  async add(
    createTicketCommentInput: CreateTicketCommentInput,
    currentUser: JwtPayload,
  ) {
    const currentUserId = currentUser.sub;

    // Find ticket (must exist before we create a comment against it)
    const ticketFound = await this.ticketService.findOne(
      createTicketCommentInput.ticketId,
      currentUser,
    );

    return this.prisma.$transaction(async (tx) => {
      //1. Create comment
      const ticketCommmentSaved = await tx.ticketComment.create({
        data: {
          ...createTicketCommentInput,
          authorId: currentUserId,
        },
      });

      // Ticket history
      // Add history creation
      const createTicketHistoryInput: CreateTicketHistoryInput = {
        ticketId: ticketCommmentSaved.ticketId,
        userIdHistory: currentUserId,
        action: TICKET_ADDED_COMMENT,
        fromValue: ticketFound.status,
        toValue: ticketFound.status,
      };
      await this.ticketHistoryService.create(createTicketHistoryInput, tx);

      return ticketCommmentSaved;
    });
  }

  async findByTicketId(ticketId: string, currentUser: JwtPayload) {
    await this.ticketService.findOne(ticketId, currentUser);

    const commentsTicket = await this.prisma.ticketComment.findMany({
      where: { ticketId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (commentsTicket.length === 0) {
      throw new NotFoundException(
        `Does not exists comments for this ticket yet ${ticketId}`,
      );
    }
    //commentsTicket.map((t) => console.log(t));
    return commentsTicket;
  }

  async findOne(id: string) {
    const ticketComment = await this.prisma.ticketComment.findUnique({
      where: { id },
    });
    if (!ticketComment) {
      throw new NotFoundException(`Comment Ticket was not found ${id}`);
    }
    return ticketComment;
  }

  async remove(id: string, currentUser: JwtPayload) {
    const comment = await this.findOne(id);
    this.assertCanModify(comment, currentUser);
    return this.prisma.ticketComment.delete({ where: { id } });
  }

  async update(
    id: string,
    updateTicketComment: UpdateTicketCommentInput,
    currentUser: JwtPayload,
  ) {
    const comment = await this.findOne(id);
    this.assertCanModify(comment, currentUser);
    const { id: _id, ...data } = updateTicketComment;
    return this.prisma.ticketComment.update({ where: { id }, data });
  }

  // Only the author or an ADMIN can edit/delete a comment
  private assertCanModify(
    comment: { authorId: string },
    currentUser: JwtPayload,
  ) {
    if (
      comment.authorId !== currentUser.sub &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new ForbiddenException('You can only modify your own comments');
    }
  }
}
