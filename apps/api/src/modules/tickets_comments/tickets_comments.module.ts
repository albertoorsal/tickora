import { Module } from '@nestjs/common';
import { TicketsCommentsService } from './tickets_comments.service';
import { TicketsCommentsResolver } from './tickets_comments.resolver';
import { UsersModule } from 'src/modules/users/users.module';
import { TicketHistoryModule } from 'src/modules/ticket_history/ticket_history.module';
import { TicketsModule } from 'src/modules/tickets/tickets.module';

@Module({
  imports: [UsersModule, TicketHistoryModule, TicketsModule],
  providers: [TicketsCommentsService, TicketsCommentsResolver],
})
export class TicketsCommentsModule {}
