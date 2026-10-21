import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TicketHistoryService } from './ticket_history.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/modules/users/enums/role';

describe('TicketHistoryService', () => {
  let service: TicketHistoryService;
  let prisma: {
    ticket: { findUnique: jest.Mock };
    ticketHistory: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      ticket: { findUnique: jest.fn() },
      ticketHistory: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketHistoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TicketHistoryService>(TicketHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws NotFoundException when the ticket does not exist', async () => {
    prisma.ticket.findUnique.mockResolvedValue(null);

    await expect(
      service.findByTicketId('missing', {
        sub: 'admin-1',
        email: 'admin@tickora.test',
        role: Role.ADMIN,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it("forbids a customer reading another customer's history", async () => {
    prisma.ticket.findUnique.mockResolvedValue({
      customerId: 'customer-2',
      agentId: null,
    });

    await expect(
      service.findByTicketId('t1', {
        sub: 'customer-1',
        email: 'c@tickora.test',
        role: Role.CUSTOMER,
      }),
    ).rejects.toThrow('You do not have access to this ticket');
    expect(prisma.ticketHistory.findMany).not.toHaveBeenCalled();
  });
});
