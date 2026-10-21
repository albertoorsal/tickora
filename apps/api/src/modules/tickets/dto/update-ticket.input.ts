import { InputType, Field, PartialType, ID, OmitType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTicketInput } from 'src/modules/tickets/dto/create-ticket.input';

@InputType()
export class UpdateTicketInput extends PartialType(
  OmitType(CreateTicketInput, ['customerId'] as const),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
