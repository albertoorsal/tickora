import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketHistoryInput } from 'src/modules/ticket_history/dto/create-ticket-history.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

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

  async findByTicketId(ticketId: string) {
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
