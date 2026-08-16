import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TicketStatus } from '../enums/ticket.status';
import { TicketPriority } from '../enums/ticket.priority';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Ticket {
  @Field(() => ID)
  id: string;

  @Field()
  ticketNumber: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => TicketStatus)
  status: TicketStatus;

  @Field(() => TicketPriority)
  priority: TicketPriority;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  customerId: string;

  @Field(() => User)
  customer: User;

  @Field({ nullable: true })
  agentId?: string;

  @Field(() => User, { nullable: true })
  agent?: User;

  @Field(() => User, { nullable: true })
  assignedByUserId?: User;

  @Field()
  assignedAt?: Date;
}
