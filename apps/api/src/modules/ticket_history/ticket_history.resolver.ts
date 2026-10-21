import { UseGuards } from '@nestjs/common';
import { Args, Resolver, ID, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { TicketHistory } from 'src/modules/ticket_history/entities/ticket_history.entity';
import { TicketHistoryService } from 'src/modules/ticket_history/ticket_history.service';

// History rows are only written by the services (inside their transactions)
@Resolver(() => TicketHistory)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketHistoryResolver {
  constructor(private readonly ticketHistorySevice: TicketHistoryService) {}

  @Query(() => [TicketHistory], { name: 'ticketHistory' })
  ticketHistory(
    @CurrentUser() user: JwtPayload,
    @Args('ticketId', { type: () => ID }) ticketId: string,
  ) {
    return this.ticketHistorySevice.findByTicketId(ticketId, user);
  }
}
