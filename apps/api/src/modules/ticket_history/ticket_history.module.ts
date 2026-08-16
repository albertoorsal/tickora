import { Module } from '@nestjs/common';
import { TicketHistoryService } from './ticket_history.service';
import { TicketHistoryResolver } from './ticket_history.resolver';

@Module({
  providers: [TicketHistoryService, TicketHistoryResolver],
  exports: [TicketHistoryService]
})
export class TicketHistoryModule {}
