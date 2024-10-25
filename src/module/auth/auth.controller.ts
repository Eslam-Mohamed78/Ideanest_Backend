import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { signinSchema, signupSchema } from './auth.validation';
import { SigninDto } from './dto/signin.dto';
import { JoiValidationPipe } from '../../pipe/joi.pipe';

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
}
