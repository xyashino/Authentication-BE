import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { corsConfig } from '@/config/cors.config';
import { pipesConfig } from '@/config/pipes.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(corsConfig);
  app.useGlobalPipes(pipesConfig);
  app.use(cookieParser());
  await app.listen(+configService.get('PORT'));
}
bootstrap();
