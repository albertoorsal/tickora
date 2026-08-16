import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTicketInput } from 'src/modules/tickets/dto/create-ticket.input';

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
