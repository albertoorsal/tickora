import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { TicketsCommentsResolver } from './tickets_comments.resolver';
import { TicketsCommentsService } from './tickets_comments.service';
import { UsersService } from '../users/users.service';

describe('TicketsCommentsResolver', () => {
  let resolver: TicketsCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsCommentsResolver,
        Reflector,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: TicketsCommentsService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<TicketsCommentsResolver>(TicketsCommentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
