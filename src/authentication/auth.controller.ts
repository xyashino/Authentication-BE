import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@/authentication/auth.service';
import { AuthLoginDto } from '@/authentication/dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@/users/entities/user.entity';
import { UserObj } from '@decorators/user.decorator';
import { AuthProvidersGuard } from '@/authentication/guards/auth-providers.guard';
import { Serialize } from '@interceptors/serialization.interceptor';
import { ResponseUserDto } from '@/users/dto/response-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Post('login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response) {
    return this.authService.login(req, res);
  }

  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
  }

  @Get('me')
  @Serialize(ResponseUserDto)
  @UseGuards(AuthGuard('jwt'))
  async check(@UserObj() user: User) {
    return user;
  }
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async providerAuth() {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {}

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('provider/callback')
  @UseGuards(AuthProvidersGuard)
  providerCallback(@Request() req, @Res() res: Response) {
    const { user } = req;
    if (!user)
      return res.redirect(this.configService.get('AUTH_FAILURE_REDIRECT_URL'));
    return this.authService.providerLogin(user, res);
  }
}
