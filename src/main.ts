import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as PROCESS from 'process';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = yaml.load(
    readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
  );

  SwaggerModule.setup('doc', app, document as OpenAPIObject);

  await app.listen(PROCESS.env.PORT || 4000);
}
bootstrap();
