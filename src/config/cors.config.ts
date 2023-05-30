import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const { CORS_ORIGINS } = process.env;

export const corsConfig: CorsOptions = {
  origin: CORS_ORIGINS.split(','),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
};
