import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as PROCESS from 'process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PROCESS.env.PORT || 4000);
}
bootstrap();
