import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.type';

export default registerAs<DatabaseConfig>('database', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  name: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  synchronize: Boolean(process.env.DB_SYNC) || false,
}));
