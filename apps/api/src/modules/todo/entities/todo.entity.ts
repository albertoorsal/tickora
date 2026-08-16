import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field()
  completed: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
