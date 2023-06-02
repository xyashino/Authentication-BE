import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as process from 'process';

@Injectable()
export class AuthProvidersGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guards = process.env.AUTH_PROVIDERS.split(',');
    for (const guard of guards) {
      try {
        const result = await new (AuthGuard(guard))().canActivate(context);
        if (result) return true;
      } catch (error) {}
    }
    return false;
  }
}
