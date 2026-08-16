import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../users/enums/role';
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  password: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field(() => Role)
  @IsEnum(Role, {
    message: 'role must be a valida enum (CUSTOMER, AMDIN, AGENT)',
  })
  @IsString()
  role: Role;
}
