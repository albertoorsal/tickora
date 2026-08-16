import { Test, TestingModule } from '@nestjs/testing';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';

describe('TicketsResolver', () => {
  let resolver: TicketsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsResolver,
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
