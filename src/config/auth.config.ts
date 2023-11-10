import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';

export default registerAs<AuthConfig>('auth', () => ({
  secret: process.env.AUTH_JWT_SECRET,
  tokenExpires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
  tokenEmailExpires: process.env.AUTH_JWT_TOKEN_EMAIL_EXPIRES_IN,
}));
