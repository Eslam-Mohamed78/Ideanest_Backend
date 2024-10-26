import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/user.enum';
import { User } from '../DataBase/user/user.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly _i18n: I18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    const user: User = request.user;

    if (user.access_level === UserRole.FULL_ACCESS) return true;

    if (!requiredRoles.includes(user.access_level))
      throw new ForbiddenException(
        `${this._i18n.t(`test.FORBIDDEN_RESOURCE`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    return true;
  }
}
