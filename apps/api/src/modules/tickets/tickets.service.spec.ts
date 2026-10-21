import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';
import { Role } from 'src/modules/users/enums/role';
import { TicketPriority, TicketStatus } from 'src/generated/prisma';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { TicketFilterInput } from './dto/ticket-filter.input';

const customer: JwtPayload = {
  sub: 'customer-1',
  email: 'c@tickora.test',
  role: Role.CUSTOMER,
};
const agent: JwtPayload = {
  sub: 'agent-1',
  email: 'a@tickora.test',
  role: Role.AGENT,
};
const admin: JwtPayload = {
  sub: 'admin-1',
  email: 'admin@tickora.test',
  role: Role.ADMIN,
};

const filter = (overrides: Partial<TicketFilterInput> = {}) =>
  Object.assign(new TicketFilterInput(), overrides);

describe('TicketsService', () => {
  let service: TicketsService;
  let prisma: {
    ticket: Record<string, jest.Mock>;
    $transaction: jest.Mock;
  };
  let tx: { ticket: Record<string, jest.Mock> };

  beforeEach(async () => {
    tx = { ticket: { create: jest.fn(), update: jest.fn() } };
    prisma = {
      ticket: {
        findMany: jest.fn().mockReturnValue('findMany'),
        count: jest.fn().mockReturnValue('count'),
        findUnique: jest.fn(),
      },
      // Array form -> [items, total]; callback form -> run with tx
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: prisma },
        { provide: TicketHistoryService, useValue: { create: jest.fn() } },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  describe('findAll', () => {
    it('scopes customers to their own tickets', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(filter(), customer);

      expect(prisma.ticket.findMany).toHaveBeenCalledWith({
        where: { AND: [{ customerId: 'customer-1' }, {}] },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('scopes agents to assigned or unassigned tickets', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(filter(), agent);

      expect(prisma.ticket.count).toHaveBeenCalledWith({
        where: {
          AND: [{ OR: [{ agentId: 'agent-1' }, { agentId: null }] }, {}],
        },
      });
    });

    it('applies filters and search for admins without scope', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(
        filter({
          status: [TicketStatus.NEW],
          priority: [TicketPriority.HIGH],
          search: ' printer ',
        }),
        admin,
      );

      expect(prisma.ticket.count).toHaveBeenCalledWith({
        where: {
          AND: [
            {},
            {
              status: { in: [TicketStatus.NEW] },
              priority: { in: [TicketPriority.HIGH] },
              OR: [
                { title: { contains: 'printer', mode: 'insensitive' } },
                { description: { contains: 'printer', mode: 'insensitive' } },
                {
                  ticketNumber: { contains: 'printer', mode: 'insensitive' },
                },
              ],
            },
          ],
        },
      });
    });

    it('returns pagination totals and hasMore', async () => {
      const items = [{ id: 't1' }, { id: 't2' }];
      prisma.$transaction.mockResolvedValue([items, 5]);

      const result = await service.findAll(filter({ skip: 2, take: 2 }), admin);

      expect(prisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 2, take: 2 }),
      );
      expect(result).toEqual({ items, total: 5, hasMore: true });
    });

    it('reports hasMore false on the last page', async () => {
      prisma.$transaction.mockResolvedValue([[{ id: 't5' }], 5]);

      const result = await service.findAll(filter({ skip: 4, take: 2 }), admin);

      expect(result.hasMore).toBe(false);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException for a missing ticket', async () => {
      prisma.ticket.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing', admin)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("forbids a customer reading another customer's ticket", async () => {
      prisma.ticket.findUnique.mockResolvedValue({
        id: 't1',
        customerId: 'customer-2',
        agentId: null,
      });

      await expect(service.findOne('t1', customer)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('returns the ticket for its customer', async () => {
      const ticket = { id: 't1', customerId: 'customer-1', agentId: null };
      prisma.ticket.findUnique.mockResolvedValue(ticket);

      await expect(service.findOne('t1', customer)).resolves.toBe(ticket);
    });
  });

  describe('create', () => {
    const input = {
      ticketNumber: 'T-1',
      title: 'Printer broken',
      description: 'It does not print',
      priority: TicketPriority.LOW,
    };

    beforeEach(() => {
      prisma.$transaction.mockImplementation((cb: (t: typeof tx) => unknown) =>
        cb(tx),
      );
      tx.ticket.create.mockImplementation(
        ({ data }: { data: Record<string, unknown> }) => ({
          id: 't1',
          status: TicketStatus.NEW,
          ...data,
        }),
      );
    });

    it('forces customerId to the current customer', async () => {
      await service.create({ ...input, customerId: 'someone-else' }, customer);

      expect(tx.ticket.create).toHaveBeenCalledWith({
        data: { ...input, customerId: 'customer-1' },
      });
    });

    it('lets an agent create a ticket on behalf of a customer', async () => {
      await service.create({ ...input, customerId: 'customer-9' }, agent);

      expect(tx.ticket.create).toHaveBeenCalledWith({
        data: { ...input, customerId: 'customer-9' },
      });
    });

    it('requires customerId when an agent creates a ticket', async () => {
      await expect(service.create(input, agent)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
