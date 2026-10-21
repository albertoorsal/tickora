import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { TicketsCommentsService } from './tickets_comments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';
import { TicketsService } from 'src/modules/tickets/tickets.service';
import { Role } from 'src/modules/users/enums/role';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

const author: JwtPayload = {
  sub: 'author-1',
  email: 'author@tickora.test',
  role: Role.CUSTOMER,
};
const otherUser: JwtPayload = {
  sub: 'other-1',
  email: 'other@tickora.test',
  role: Role.AGENT,
};
const admin: JwtPayload = {
  sub: 'admin-1',
  email: 'admin@tickora.test',
  role: Role.ADMIN,
};

describe('TicketsCommentsService', () => {
  let service: TicketsCommentsService;
  let prisma: { ticketComment: Record<string, jest.Mock> };

  beforeEach(async () => {
    prisma = {
      ticketComment: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: 'c1', authorId: 'author-1' }),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsCommentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: TicketHistoryService, useValue: { create: jest.fn() } },
        { provide: TicketsService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<TicketsCommentsService>(TicketsCommentsService);
  });

  it('forbids non-authors from updating a comment', async () => {
    await expect(
      service.update('c1', { id: 'c1', content: 'edited' }, otherUser),
    ).rejects.toThrow(ForbiddenException);
    expect(prisma.ticketComment.update).not.toHaveBeenCalled();
  });

  it('forbids non-authors from removing a comment', async () => {
    await expect(service.remove('c1', otherUser)).rejects.toThrow(
      ForbiddenException,
    );
    expect(prisma.ticketComment.delete).not.toHaveBeenCalled();
  });

  it('lets the author update their comment', async () => {
    await service.update('c1', { id: 'c1', content: 'edited' }, author);
    expect(prisma.ticketComment.update).toHaveBeenCalled();
  });

  it('lets an admin remove any comment', async () => {
    await service.remove('c1', admin);
    expect(prisma.ticketComment.delete).toHaveBeenCalledWith({
      where: { id: 'c1' },
    });
  });
});
