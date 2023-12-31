import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { comparePass, generateHash } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthVerifyEmailDto } from './dtos/auth-verify-email.dto';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { TokenType, VerifyEmail, UserStatus } from 'src/constants';
import { AllTypeConfig } from 'src/config/config.type';
import { UserNotFoundException } from 'src/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllTypeConfig>,
  ) {}

  async registerByEmail(body: AuthRegisterDto) {
    const { email, password, confirmPassword } = body;
    const user = await this.userService.getUser({ email });
    if (user) {
      throw new BadRequestException('Email is already exist');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password confirm and password is not match',
      );
    }
    delete body.confirmPassword;
    const hashPassword = await generateHash(body.password);
    const newUser = await this.userService.saveUser({
      ...body,
      password: hashPassword,
    });
    const payload = {
      id: newUser.id,
    };
    const authConfig = this.configService.getOrThrow('auth', { infer: true });

    return await this.jwtService.signAsync(payload, {
      secret: authConfig.secret,
      expiresIn: authConfig.tokenExpires,
    });
  }

  async verifyEmail(data: AuthVerifyEmailDto) {
    const user = await this.userService.getUser({ email: data.email });
    if (!user) {
      throw new BadRequestException('User do not exist');
    }
    if (data.code !== VerifyEmail.CODE) {
      throw new BadRequestException('Verify code is wrong');
    }
    user.status = UserStatus.ACTIVE;
    return await this.userService.updateUser(user.id, user);
  }

  async login(data: AuthEmailLoginDto) {
    const user = await this.userService.getUser([
      { username: data.username },
      { email: data.username },
    ]);
    if (!user) {
      throw new UserNotFoundException();
    }
    const match = await comparePass(data.password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid password');
    }
    const payload = {
      id: user.id,
    };

    const authConfig = this.configService.getOrThrow('auth', { infer: true });

    return await this.jwtService.signAsync(payload, {
      secret: authConfig.secret,
      expiresIn: authConfig.tokenExpires,
    });
  }

  async forgotPassword(email: string) {
    const user = await this.userService.getUser({ email });
    if (!user) {
      throw new UserNotFoundException();
    }
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: TokenType.RESET_PASSWORD,
      expiresIn: this.configService.getOrThrow('auth', {
        infer: true,
      }).tokenEmailExpires,
    });
    return token;
  }

  async resetPassword(resetPasswordToken: string, data: AuthResetPasswordDto) {
    if (!resetPasswordToken) {
      throw new BadRequestException();
    }
    const payload = await this.jwtService.verifyAsync(resetPasswordToken, {
      secret: TokenType.RESET_PASSWORD,
    });
    const user = await this.userService.getUser({
      email: payload.email,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    if (data.newPassword !== data.confirmPassword) {
      throw new NotFoundException(
        'new password and confirm password is not match',
      );
    }
    const newHasPassword = await generateHash(data.newPassword);
    user.password = newHasPassword;
    return await this.userService.updateUser(user.id, user);
  }
}
