import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTodoInput } from './create-todo.input';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;
}
