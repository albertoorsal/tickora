import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';

describe('TicketsResolver', () => {
  let resolver: TicketsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsResolver,
        Reflector,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: TicketsService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<TicketsResolver>(TicketsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
