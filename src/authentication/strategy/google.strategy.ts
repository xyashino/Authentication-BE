import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleConfig } from '@/config/strategy/google.config';
import { UsersService } from '@/users/users.service';
import { LoginType } from '@/enums/login-type.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    super(GoogleConfig);
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos, displayName } = profile;
    const user = await this.usersService.findOrCreateProviderUser(
      emails[0].value,
      {
        avatar: photos[0].value ?? null,
        fullName: displayName ?? 'Unknown',
        provider: LoginType.Google,
      },
    );
    done(null, user);
  }
}
