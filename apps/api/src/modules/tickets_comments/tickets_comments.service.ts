import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CreateTicketHistoryInput } from 'src/modules/ticket_history/dto/create-ticket-history.input';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';
import { TICKET_ADDED_COMMENT } from 'src/modules/tickets/constants/actions';
import { TicketsService } from 'src/modules/tickets/tickets.service';
import { CreateTicketCommentInput } from 'src/modules/tickets_comments/dto/create-ticket-comment.input';
import { UpdateTicketCommentInput } from 'src/modules/tickets_comments/dto/update-ticket-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findByTicketId(ticketId: string) {
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ticketComment.delete({ where: { id } });
  }

  async update(id: string, updateTicketComment: UpdateTicketCommentInput) {
    await this.findOne(id);
    const { id: _id, ...data } = updateTicketComment;
    return this.prisma.ticketComment.update({ where: { id }, data });
  }
}
