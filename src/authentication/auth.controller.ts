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

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response) {
    return this.authService.login(req, res);
  }

  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
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
    if (!user) res.json(new UnauthorizedException('Authentication failed'));
    return this.authService.providerLogin(user, res);
  }
}
