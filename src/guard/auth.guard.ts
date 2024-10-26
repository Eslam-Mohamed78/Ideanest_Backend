import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from '../DataBase/user/user.repository';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly _i18n: I18nService,
    private readonly _userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException(
        `${this._i18n.t(`test.UNAUTHORIZED`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      const isUserExists = await this._userRepository.findById(payload.userId);

      if (!isUserExists)
        throw new UnauthorizedException(
          `${this._i18n.t(`test.UNAUTHORIZED`, {
            lang: I18nContext.current().lang,
          })}`,
        );

      request['user'] = isUserExists;

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `${this._i18n.t(`test.UNAUTHORIZED`, {
          lang: I18nContext.current().lang,
        })}`,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
