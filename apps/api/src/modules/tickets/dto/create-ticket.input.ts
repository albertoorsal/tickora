import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketStatus } from '../enums/ticket.status';
import { TicketPriority } from '../enums/ticket.priority';

@InputType()
export class CreateTicketInput {
  @Field()
  @IsString()
  ticketNumber: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => TicketStatus)
  @IsEnum(TicketStatus, {
    message: 'Status must be a valid enum value ()',
  })
  status: TicketStatus;

  @Field(() => TicketPriority)
  @IsEnum(TicketPriority, {
    message: 'Priority must be a valid enum value ()',
  })
  priority: TicketPriority;

  @Field()
  @IsUUID()
  customerId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  agentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  assignedByUserId?: string;
}
