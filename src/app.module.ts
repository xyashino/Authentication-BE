import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from '@/config/typeorm.config';
import { AuthModule } from './authentication/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    AuthModule,
    UsersModule,
    UploadModule,
  ],
})
export class AppModule {}
