import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { LinkedinConfig } from '@/config/strategy/linkedin.config';
import { UsersService } from '@/users/users.service';
import { LoginType } from '@/enums/login-type.enum';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    super(LinkedinConfig);
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
        provider: LoginType.Linkedin,
      },
    );
    done(null, user);
  }
}
