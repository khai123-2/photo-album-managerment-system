export type DatabaseConfig = {
  url?: string;
  type: string;
  host: string;
  port: number;
  password: string;
  name: string;
  username: string;
  synchronize?: boolean;
  autoLoadEntities?: boolean;
};

export type AppConfig = {
  nodeEnv?: string;
  port: number;
};

export type AuthConfig = {
  secret: string;
  tokenEmailExpires?: string;
  tokenExpires?: string;
};
export type AllTypeConfig = {
  database: DatabaseConfig;
  app: AppConfig;
  auth: AuthConfig;
};
