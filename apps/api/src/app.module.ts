import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { TodoModule } from './modules/todo/todo.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { TicketsCommentsModule } from './modules/tickets_comments/tickets_comments.module';
import { TicketHistoryModule } from './modules/ticket_history/ticket_history.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    PrismaModule,
    CommonModule,
    TodoModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    TicketsCommentsModule,
    TicketHistoryModule,
  ],
})
export class AppModule {}
