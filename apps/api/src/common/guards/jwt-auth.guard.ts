import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const ACCESS_TOKEN_COOKIE = 'access_token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: Request }>().req;

    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      req.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return true;
  }
}
