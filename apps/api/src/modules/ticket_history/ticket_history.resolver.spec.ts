import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { TicketHistoryResolver } from './ticket_history.resolver';
import { TicketHistoryService } from './ticket_history.service';

describe('TicketHistoryResolver', () => {
  let resolver: TicketHistoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketHistoryResolver,
        Reflector,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: TicketHistoryService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<TicketHistoryResolver>(TicketHistoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
