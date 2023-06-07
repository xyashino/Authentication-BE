import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { FacebookConfig } from '@/config/strategy/facebook.config';
import { UsersService } from '@/users/users.service';
import { LoginType } from '@/enums/login-type.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    super(FacebookConfig);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (error, user) => void,
  ) {
    const { emails, photos, displayName } = profile;
    const user = await this.usersService.findOrCreateProviderUser(
      emails[0].value,
      {
        avatar: photos[0].value ?? null,
        fullName: displayName ?? 'Unknown',
        provider: LoginType.Facebook,
      },
    );
    done(null, user);
  }
}
