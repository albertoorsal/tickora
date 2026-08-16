import { Test, TestingModule } from '@nestjs/testing';
import { TicketsCommentsService } from './tickets_comments.service';

describe('TicketsCommentsService', () => {
  let service: TicketsCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsCommentsService],
    }).compile();

    service = module.get<TicketsCommentsService>(TicketsCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
