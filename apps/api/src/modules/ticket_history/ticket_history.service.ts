import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketHistoryInput } from 'src/modules/ticket_history/dto/create-ticket-history.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { assertCanView } from 'src/modules/tickets/utils/ticket-access';

type PrismaTransactionClient = Prisma.TransactionClient;

@Injectable()
export class TicketHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTicketHistoryInput: CreateTicketHistoryInput,
    tx?: PrismaTransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return await client.ticketHistory.create({
      data: { ...createTicketHistoryInput },
    });
  }

  async findByTicketId(ticketId: string, currentUser: JwtPayload) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { customerId: true, agentId: true },
    });
    if (!ticket) {
      throw new NotFoundException(`No ticket found with id ${ticketId}`);
    }
    assertCanView(ticket, currentUser);

    const ticketHistory = await this.prisma.ticketHistory.findMany({
      where: { ticketId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (ticketHistory.length === 0) {
      throw new NotFoundException(
        `Does not exists history for this ticket yet ${ticketId}`,
      );
    }

    return ticketHistory;
  }
}
