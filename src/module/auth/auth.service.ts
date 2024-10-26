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

@Injectable()
export class AuthService {
  constructor(
    private readonly _i18n: I18nService,
    private readonly _jwtService: JwtService,
    private readonly _userRepository: UserRepository,
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

    const payload = { userId: isUserExists['_id'] };

    const access_token = await this._jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    return {
      message: `${this._i18n.t(`test.SIGNIN_SUCCESS`, {
        lang: I18nContext.current().lang,
      })}`,
      access_token,
      refresh_token: '',
    };
  }
}
