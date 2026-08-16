import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTicketInput } from 'src/modules/tickets/dto/create-ticket.input';
import { UpdateTicketInput } from 'src/modules/tickets/dto/update-ticket.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../users/enums/role';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';
import { CreateTicketHistoryInput } from 'src/modules/ticket_history/dto/create-ticket-history.input';
import {
  TICKET_ASSIGNED,
  TICKET_CREATED,
  TICKET_UPDATED,
} from '../tickets/constants/actions';
import { TicketStatus } from 'src/generated/prisma';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ticketHistoryService: TicketHistoryService,
  ) {}

  async create(createTicketInput: CreateTicketInput) {
    return this.prisma.$transaction(async (tx) => {
      //1. Create ticket
      const ticketSaved = await tx.ticket.create({
        data: {
          ...createTicketInput,
        },
      });

      // Add history creation
      const createTicketHistoryInput: CreateTicketHistoryInput = {
        ticketId: ticketSaved.id,
        userIdHistory: ticketSaved.customerId,
        action: TICKET_CREATED,
        fromValue: ticketSaved.status,
      };
      await this.ticketHistoryService.create(createTicketHistoryInput, tx);

      return ticketSaved;
    });
  }

  findAll() {
    return this.prisma.ticket.findMany();
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`No ticket found with id ${id}`);
    }

    return ticket;
  }

  async update(
    id: string,
    updateTicketInput: UpdateTicketInput,
    currentUser: JwtPayload,
  ) {
    const ticketFound = await this.findOne(id);
    const { id: _id, ...data } = updateTicketInput;

    return this.prisma.$transaction(async (tx) => {
      const ticketUpdated = await tx.ticket.update({ where: { id }, data });

      const createTicketHistoryInput: CreateTicketHistoryInput = {
        ticketId: ticketUpdated.id,
        userIdHistory: currentUser.sub,
        action: TICKET_UPDATED,
        fromValue: ticketFound.status,
        toValue: ticketUpdated.status,
      };
      await this.ticketHistoryService.create(createTicketHistoryInput, tx);

      return ticketUpdated;
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ticket.delete({ where: { id } });
  }

  async assignTicket(id: string, agentId: string, currentUser: JwtPayload) {
    const currentUserId = currentUser.sub;
    const ticketFound = await this.findOne(id);

    const assignedAgent = await this.prisma.user.findUnique({
      where: { id: agentId },
    });

    if (!assignedAgent) {
      throw new NotFoundException(`No user found with id ${agentId}`);
    }

    if (assignedAgent.role === Role.CUSTOMER) {
      throw new BadRequestException(
        `Ticket cannot be assigend for a Customer. ONLY for AGENTS or ADMINS`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const ticketUpdate = await tx.ticket.update({
        where: {
          id: id,
        },
        data: {
          agentId: agentId,
          assignedAt: new Date(),
          assignedByUserId: currentUserId,
          status: TicketStatus.OPEN,
        },
      });

      // Add history creation
      const createTicketHistoryInput: CreateTicketHistoryInput = {
        ticketId: ticketUpdate.id,
        userIdHistory: currentUserId,
        action: `Admin ${TICKET_ASSIGNED} to ${ticketUpdate.agentId}`,
        fromValue: ticketFound.status,
        toValue: TicketStatus.OPEN,
      };
      await this.ticketHistoryService.create(createTicketHistoryInput, tx);

      return ticketUpdate;
    });
  }

  async changeTicketStatus(
    id: string,
    newStatus: TicketStatus,
    currentUser: JwtPayload,
  ) {
    const ticketFound = await this.findOne(id);
    const currentUserId = currentUser.sub;
    return this.prisma.$transaction(async (tx) => {
      // Change status
      const ticketUpdate = await tx.ticket.update({
        where: {
          id: id,
        },
        data: {
          status: newStatus,
        },
      });

      // Add history creation
      const createTicketHistoryInput: CreateTicketHistoryInput = {
        ticketId: ticketUpdate.id,
        userIdHistory: currentUserId,
        action: `Status changed ${ticketFound.status} -> ${newStatus}`,
        fromValue: ticketFound.status,
        toValue: newStatus,
      };
      await this.ticketHistoryService.create(createTicketHistoryInput, tx);

      return ticketUpdate;
    });
  }
}
