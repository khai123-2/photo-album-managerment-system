import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { Response } from 'express';
import { AuthVerifyEmailDto } from './dtos/auth-verify-email.dto';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.sto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerByEmail(
    @Body() registerByEmail: AuthRegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.authService.registerByEmail(registerByEmail);
    return res.status(HttpStatus.OK).send({ token });
  }

  @Post('/verify-email')
  async verifyEmail(
    @Body() body: AuthVerifyEmailDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.verifyEmail(body);
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Post('/login')
  async login(
    @Body() body: AuthEmailLoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const accessToken = await this.authService.login(body);
    return res.status(HttpStatus.OK).send({ accessToken });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: AuthForgotPasswordDto,
    @Res() res: Response,
  ) {
    const token = await this.authService.forgotPassword(body.email);
    return res.status(HttpStatus.OK).send({ message: 'SENT_EMAIL', token });
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: AuthResetPasswordDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.resetPassword(token, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
