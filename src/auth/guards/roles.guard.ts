//  https://docs.nestjs.com/guards#role-based-authentication

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!this.matchRoles(roles, user.role))
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);

    return true;
  }

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole);
  }
}
