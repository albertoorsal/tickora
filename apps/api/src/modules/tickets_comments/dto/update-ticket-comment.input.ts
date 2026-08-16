import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTicketCommentInput } from 'src/modules/tickets_comments/dto/create-ticket-comment.input';

@InputType()
export class UpdateTicketCommentInput extends PartialType(
  CreateTicketCommentInput,
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
