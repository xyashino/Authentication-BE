import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@/authentication/auth.service';
import { AuthLoginDto } from '@/authentication/dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@/users/entities/user.entity';
import { UserObj } from '@decorators/user.decorator';

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
}
