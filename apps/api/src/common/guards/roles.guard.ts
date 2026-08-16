import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../modules/users/enums/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: Request }>().req.user;

    return !!user && requiredRoles.includes(user.role);
  }
}
