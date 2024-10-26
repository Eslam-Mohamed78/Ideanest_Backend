import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { refreshTokenSchema, signinSchema, signupSchema } from './auth.validation';
import { SigninDto } from './dto/signin.dto';
import { JoiValidationPipe } from '../../pipe/joi.pipe';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(signupSchema))
  async signup(@Body() body: SignupDto) {
    return this._authService.signup(body);
  }

  @Post('signin')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(signinSchema))
  async signin(@Body() body: SigninDto) {
    return this._authService.signin(body);
  }

  @Post('refresh-token')
  @UsePipes(new JoiValidationPipe(refreshTokenSchema))
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this._authService.refreshToken(body);
  }
}
