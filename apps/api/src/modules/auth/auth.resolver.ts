import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { LoginInput } from './dto/login.dto';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';
import {
  JwtAuthGuard,
  ACCESS_TOKEN_COOKIE,
} from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

const COOKIE_MAX_AGE_MS = 60 * 60 * 1000;

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => AuthEntity)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context('res') res: Response,
  ): Promise<AuthEntity> {
    const { user, accessToken } = await this.authService.login(
      loginInput.email,
      loginInput.password,
    );

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    return { success: true, user };
  }

  @Mutation(() => Boolean)
  logout(@Context('res') res: Response): boolean {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    return true;
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  verify(): boolean {
    return true;
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user.sub);
  }
}
