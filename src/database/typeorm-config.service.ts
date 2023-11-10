import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllTypeConfig } from 'src/config/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllTypeConfig>) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseConfig = this.configService.getOrThrow('database', {
      infer: true,
    });
    return {
      type: databaseConfig.type,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.name,
      entities: [__dirname + '/../**/*.entity{.js,.ts}'],
      synchronize: databaseConfig.synchronize,
    } as TypeOrmModuleOptions;
  }
}
