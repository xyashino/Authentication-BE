import * as dotenv from 'dotenv';
dotenv.config();
import { CookieOptions } from 'express';

const { JWT_PROTOCOL_SECURE, DOMAIN, JWT_HTTP_ONLY, JWT_EXPIRES_SECONDS } =
  process.env;
export const cookieConfig: CookieOptions = {
  secure: JWT_PROTOCOL_SECURE === 'true',
  domain: DOMAIN,
  httpOnly: JWT_HTTP_ONLY === 'true',
  maxAge: +JWT_EXPIRES_SECONDS,
};
