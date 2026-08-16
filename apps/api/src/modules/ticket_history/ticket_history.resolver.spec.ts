import { Test, TestingModule } from '@nestjs/testing';
import { TicketHistoryResolver } from './ticket_history.resolver';

describe('TicketHistoryResolver', () => {
  let resolver: TicketHistoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketHistoryResolver],
    }).compile();

    resolver = module.get<TicketHistoryResolver>(TicketHistoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
