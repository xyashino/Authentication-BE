import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { JwtPayload } from '@/authentication/jwt.strategy';
import { AuthLoginDto } from '@/authentication/dto/auth-login.dto';

@Injectable()
export class AuthService {
  private readonly cookieConfig: {
    maxAge: number;
    domain: string;
    httpOnly: boolean;
    secure: boolean;
  };
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.cookieConfig = {
      secure: this.configService.get('JWT_PROTOCOL_SECURE') === 'true',
      domain: this.configService.get<string>('DOMAIN'),
      httpOnly: this.configService.get('JWT_HTTP_ONLY') === 'true',
      maxAge: +this.configService.get('JWT_EXPIRES_SECONDS'),
    };
  }

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = +this.configService.get<string>('JWT_EXPIRES_SECONDS');
    const accessToken = sign(
      payload,
      this.configService.get<string>('JWT_SECRET_KEY'),
      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token: string | PromiseLike<string>;
    let userWithThisToken = null;
    do {
      token = randomUUID();
      userWithThisToken = await this.userRepository.findOneBy({
        currentTokenId: token,
      });
    } while (!!userWithThisToken);

    user.currentTokenId = token;

    await this.userRepository.save(user);
    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ email: req.email });

      const matchPwd: boolean =
        !!user && (await compare(req.password, user.password));

      if (!matchPwd) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = this.createToken(await this.generateToken(user));
      return res
        .cookie('jwt', token.accessToken, this.cookieConfig)
        .json({ logged: true, status: 200 });
    } catch (e) {
      return res.json({ error: e.message, status: e.status });
    }
  }

  async logout(user: User, res: Response): Promise<any> {
    try {
      user.currentTokenId = null;
      await this.userRepository.save(user);
      res.clearCookie('jwt', this.cookieConfig);
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
