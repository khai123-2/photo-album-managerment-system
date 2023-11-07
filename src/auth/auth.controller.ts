import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterByEmailDto } from './dtos/register-by-email.dto';
import { Response } from 'express';
import { verifyEmailDto } from './dtos/verify-email.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.sto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerByEmail(
    @Body() registerByEmail: RegisterByEmailDto,
    @Res() res: Response,
  ): Promise<Response> {
    const payload = await this.authService.registerByEmail(registerByEmail);
    return res.status(HttpStatus.OK).send({ token: payload });
  }

  @Post('/verify-email')
  async verifyEmail(
    @Body() body: verifyEmailDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.verifyEmail(body);
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Post('/login')
  async login(
    @Body() body: LoginAuthDto,
    @Res() res: Response,
  ): Promise<Response> {
    const payload = await this.authService.login(body);
    return res.status(HttpStatus.OK).send({ token: payload });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    const token = await this.authService.forgotPassword(body.email);
    return res.status(HttpStatus.OK).send({ message: 'SENT_EMAIL', token });
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.resetPassword(token, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
