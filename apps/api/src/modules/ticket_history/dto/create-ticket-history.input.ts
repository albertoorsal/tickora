import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTicketHistoryInput {
  @Field()
  @IsString()
  @IsUUID()
  ticketId: string;

  @Field()
  @IsString()
  @IsUUID()
  userIdHistory: string;

  @Field()
  @IsString()
  action: string;

  @Field()
  @IsString()
  @IsOptional()
  fromValue?: string;

  @Field()
  @IsString()
  @IsOptional()
  toValue?: string;
}
