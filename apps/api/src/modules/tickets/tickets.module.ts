import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TicketsService } from './tickets.service';
import { TicketsResolver } from './tickets.resolver';
import { TicketHistoryModule } from 'src/modules/ticket_history/ticket_history.module';

@Module({
  imports: [UsersModule, TicketHistoryModule],
  providers: [TicketsService, TicketsResolver],
  exports: [TicketsService],
})
export class TicketsModule {}
