import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { JwtStrategy } from '@/authentication/strategy/jwt.strategy';
import { GithubStrategy } from '@/authentication/strategy/github.strategy';
import { GoogleStrategy } from '@/authentication/strategy/google.strategy';
import { LinkedinStrategy } from '@/authentication/strategy/linkedin.strategy';
import { FacebookStrategy } from '@/authentication/strategy/facebook.strategy';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    FacebookStrategy,
    LinkedinStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
