import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignTicketAgent {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsUUID()
  agentId: string;
}
