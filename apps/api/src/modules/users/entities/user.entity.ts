import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../enums/role';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  isActive: boolean;

  @Field(() => Role)
  role: Role;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
