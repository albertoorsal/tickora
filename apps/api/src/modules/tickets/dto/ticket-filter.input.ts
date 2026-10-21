import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TicketStatus } from '../enums/ticket.status';
import { TicketPriority } from '../enums/ticket.priority';
import { SortDirection, TicketOrderField } from '../enums/ticket.order';

@InputType()
export class TicketFilterInput {
  @Field(() => [TicketStatus], { nullable: true })
  @IsOptional()
  @IsEnum(TicketStatus, { each: true })
  status?: TicketStatus[];

  @Field(() => [TicketPriority], { nullable: true })
  @IsOptional()
  @IsEnum(TicketPriority, { each: true })
  priority?: TicketPriority[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  agentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  // Matches title, description or ticketNumber (case insensitive)
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  createdFrom?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  createdTo?: Date;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, { defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 20;

  @Field(() => TicketOrderField, { defaultValue: TicketOrderField.CREATED_AT })
  @IsOptional()
  @IsEnum(TicketOrderField)
  orderBy?: TicketOrderField = TicketOrderField.CREATED_AT;

  @Field(() => SortDirection, { defaultValue: SortDirection.DESC })
  @IsOptional()
  @IsEnum(SortDirection)
  orderDirection?: SortDirection = SortDirection.DESC;
}
