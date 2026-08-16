import { Args, Resolver, Mutation, ID, Query } from '@nestjs/graphql';
import { CreateTicketHistoryInput } from 'src/modules/ticket_history/dto/create-ticket-history.input';
import { TicketHistory } from 'src/modules/ticket_history/entities/ticket_history.entity';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';

@Resolver(() => TicketHistory)
export class TicketHistoryResolver {
  constructor(private readonly ticketHistorySevice: TicketHistoryService) {}

  @Mutation(() => TicketHistory)
  createTicketHistory(
    @Args('createTicketHistoryInput')
    createTicketHistoryInput: CreateTicketHistoryInput,
  ) {
    return this.ticketHistorySevice.create(createTicketHistoryInput);
  }

  @Query(() => [TicketHistory], { name: 'ticketHistory' })
  ticketHistory(@Args('ticketId', { type: () => ID }) ticketId: string) {
    return this.ticketHistorySevice.findByTicketId(ticketId);
  }
}
