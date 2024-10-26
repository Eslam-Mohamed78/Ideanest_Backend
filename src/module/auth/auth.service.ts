import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from '../../DataBase/user/user.repository';
import { UserRole } from '../../enum/user.enum';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly _i18n: I18nService,
    private readonly _jwtService: JwtService,
    private readonly _userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signup(body: SignupDto) {
    const { name, email, password } = body;

    const isEmailExists = await this._userRepository.findOne({
      email,
    });

    if (isEmailExists)
      throw new UnprocessableEntityException(
        this._i18n.t(`test.EMAIL_ALREADY_EXISTS`, {
          lang: I18nContext.current().lang,
        }),
      );

    const hashPassword = bcrypt.hashSync(password, 10);

    await this._userRepository.create({
      name,
      email,
      password: hashPassword,
      access_level: UserRole.FULL_ACCESS,
    });

    return {
      message: `${this._i18n.t(`test.SIGNUP_SUCCESS`, {
        lang: I18nContext.current().lang,
      })}`,
    };
  }

  async signin(body: SigninDto) {
    const { email, password } = body;

    const isUserExists = await this._userRepository.findOneWithPassword({
      email,
    });

    if (!isUserExists)
      throw new BadRequestException(
        this._i18n.t(`test.INVALID_CREDENTIALS`, {
          lang: I18nContext.current().lang,
        }),
      );

    const isPassMatch = bcrypt.compareSync(password, isUserExists.password);

    if (!isPassMatch)
      throw new BadRequestException(
        this._i18n.t(`test.INVALID_CREDENTIALS`, {
          lang: I18nContext.current().lang,
        }),
      );

    const userTokens = await this.generateUserToken(isUserExists['_id']);

    return {
      message: `${this._i18n.t(`test.SIGNIN_SUCCESS`, {
        lang: I18nContext.current().lang,
      })}`,
      ...userTokens,
    };
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refresh_token } = body;
    const userId: Types.ObjectId = await this.cacheManager.get(refresh_token);

    if (!userId)
      throw new BadRequestException(
        this._i18n.t(`test.INVALID_TOKEN`, {
          lang: I18nContext.current().lang,
        }),
      );

    // delete old refresh_token
    await this.cacheManager.del(refresh_token);

    const userTokens = await this.generateUserToken(userId);

    return {
      message: `${this._i18n.t(`test.TOKEN_REFRESHED`, {
        lang: I18nContext.current().lang,
      })}`,
      ...userTokens,
    };
  }

  async revokeRefreshToken(req, body: RefreshTokenDto) {
    const { refresh_token } = body;
    const userId = req.user._id;

    const tokenOwner: Types.ObjectId =
      await this.cacheManager.get(refresh_token);

    if (!tokenOwner || tokenOwner.toString() !== userId.toString())
      throw new BadRequestException(
        this._i18n.t(`test.INVALID_TOKEN`, {
          lang: I18nContext.current().lang,
        }),
      );

    await this.cacheManager.del(refresh_token);

    return {
      message: `${this._i18n.t(`test.REFRESH_TOKEN_REVOKED`, {
        lang: I18nContext.current().lang,
      })}`,
    };
  }

  async generateUserToken(userId: Types.ObjectId) {
    const access_token = await this._jwtService.signAsync(
      { userId },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '2h',
      },
    );

    const refresh_token = uuidv4();

    await this.storeRefreshToken(
      userId,
      refresh_token,
      3 * 24 * 60 * 60 * 1000,
    );

    return { access_token, refresh_token };
  }

  async storeRefreshToken(
    userId: Types.ObjectId,
    refreshToken: string,
    expiresIn: number,
  ) {
    await this.cacheManager.set(refreshToken, userId, expiresIn);
  }
}
