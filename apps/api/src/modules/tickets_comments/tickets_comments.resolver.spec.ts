import { Test, TestingModule } from '@nestjs/testing';
import { TicketsCommentsResolver } from './tickets_comments.resolver';

describe('TicketsCommentsResolver', () => {
  let resolver: TicketsCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsCommentsResolver],
    }).compile();

    resolver = module.get<TicketsCommentsResolver>(TicketsCommentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
