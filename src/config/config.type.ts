export interface DatabaseConfig {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  autoLoadEntities?: boolean;
}

export interface AllTypeConfig {
  database: DatabaseConfig;
}
