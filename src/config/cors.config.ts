import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const { CORS } = process.env;
export const corsConfig: CorsOptions = {
  origin: CORS.split(','),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
};
