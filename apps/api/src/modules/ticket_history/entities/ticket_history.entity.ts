import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class TicketHistory {
  @Field(() => ID)
  id: string;

  @Field()
  ticketId: string;

  @Field(() => Ticket)
  ticket: Ticket;

  @Field()
  userIdHistory: string;

  @Field(() => User)
  user: User;

  @Field()
  action: string;

  @Field(() => String, { nullable: true })
  fromValue?: string;

  @Field(() => String, { nullable: true })
  toValue?: string | null;

  @Field()
  createdAt: Date;
}
