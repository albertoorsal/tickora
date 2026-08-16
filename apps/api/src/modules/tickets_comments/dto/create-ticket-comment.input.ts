import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTicketCommentInput {
  @Field()
  @IsString()
  content: string;

  @Field()
  @IsUUID()
  ticketId: string;

  // @Field()
  // @IsUUID()
  // authorId: string;
}
