import { ValidationPipe } from '@nestjs/common';

export const pipesConfig = new ValidationPipe({
  disableErrorMessages: false,
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
