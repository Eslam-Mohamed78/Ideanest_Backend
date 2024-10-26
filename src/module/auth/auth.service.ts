import {
  BadRequestException,
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
import { RefreshTokenRepository } from '../../DataBase/refresh-token/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly _i18n: I18nService,
    private readonly _jwtService: JwtService,
    private readonly _userRepository: UserRepository,
    private readonly _refreshTokenRepository: RefreshTokenRepository,
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

    const refreshToken = await this._refreshTokenRepository.findOneAndDelete({
      token: refresh_token,
      expiry_date: { $gt: new Date() },
    });

    if (!refreshToken)
      throw new BadRequestException(
        this._i18n.t(`test.INVALID_TOKEN`, {
          lang: I18nContext.current().lang,
        }),
      );

    const userTokens = await this.generateUserToken(refreshToken.user_id);

    return {
      message: `${this._i18n.t(`test.REFRESH_TOKEN`, {
        lang: I18nContext.current().lang,
      })}`,
      ...userTokens,
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

    await this.storeRefreshToken(userId, refresh_token);

    return { access_token, refresh_token };
  }

  async storeRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // after 3 days from now

    await this._refreshTokenRepository.create({
      token: refreshToken,
      user_id: userId,
      expiry_date: expiryDate,
    });
  }
}
