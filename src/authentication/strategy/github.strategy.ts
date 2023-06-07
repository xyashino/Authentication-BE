import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { GithubConfig } from '@/config/strategy/github.config';
import { UsersService } from '@/users/users.service';
import { LoginType } from '@/enums/login-type.enum';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    super(GithubConfig);
  }

  async validate(
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (error, user) => void,
  ): Promise<any> {
    const { emails, photos, displayName } = profile;
    const user = await this.usersService.findOrCreateProviderUser(
      emails[0].value,
      {
        avatar: photos[0].value ?? null,
        fullName: displayName ?? 'Unknown',
        provider: LoginType.Github,
      },
    );
    done(null, user);
  }
}
