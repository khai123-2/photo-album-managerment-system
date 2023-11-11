import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';

export default registerAs<AppConfig>('app', () => ({
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
}));
