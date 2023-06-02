import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';

export interface JwtPayload {
  id?: string;
}

function cookieExtractor(req: any): null | string {
  console.log(req);
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    const id = payload?.id;
    if (!id) return done(new UnauthorizedException(), false);

    const user = await this.userRepository.findOneBy({
      currentTokenId: payload.id,
    });
    if (!user) return done(new UnauthorizedException(), false);
    done(null, user);
  }
}
