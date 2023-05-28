import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export class TypeormConfig {
  static async getOrmConfig(
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [
        `${configService.get('DB_ENTITY_BASE')}/**/**/*.entity{.ts,.js}`,
        `${configService.get('DB_ENTITY_BASE')}/**/*.entity{.ts,.js}`,
        `${configService.get('DB_ENTITY_BASE')}/*.entity{.ts,.js}`,
      ],
      bigNumberStrings: false,
      logging: configService.get('DB_LOGGING') === 'true',
      migrations: ['dist/migration/*.js'],
      synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      autoLoadEntities: true,
      extra: {
        decimalNumbers: true,
      },
    };
  }
}
export const typeormConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeormConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
