import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthEntity {
  @Field()
  success: boolean;

  @Field(() => User)
  user: User;
}
