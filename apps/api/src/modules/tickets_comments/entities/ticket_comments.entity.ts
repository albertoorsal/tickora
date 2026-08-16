import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class TicketComments {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  ticketId: string;

  @Field(() => Ticket)
  ticket: Ticket;

  @Field()
  authorId: string;

  @Field(() => User)
  author: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
