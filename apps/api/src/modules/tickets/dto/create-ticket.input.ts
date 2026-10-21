import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
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

  @Field(() => TicketPriority)
  @IsEnum(TicketPriority, {
    message: 'Priority must be a valid enum value ()',
  })
  priority: TicketPriority;

  // Ignored for CUSTOMER (taken from the session); required for AGENT/ADMIN
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string;
}
