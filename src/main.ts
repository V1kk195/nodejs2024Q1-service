import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as PROCESS from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PROCESS.env.PORT || 4000);
}
bootstrap();
