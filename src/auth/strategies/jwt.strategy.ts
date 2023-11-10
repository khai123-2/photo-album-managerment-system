import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AllTypeConfig } from 'src/config/config.type';
import { UserStatus } from 'src/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService<AllTypeConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
    });
  }

  async validate(args: { id: string }) {
    const user = await this.userService.getUser({
      id: args.id,
      status: UserStatus.ACTIVE,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
