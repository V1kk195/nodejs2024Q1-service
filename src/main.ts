import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as PROCESS from 'process';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { Logger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new Logger());
  app.useGlobalPipes(new ValidationPipe());

  try {
    const document = yaml.load(
      readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
    );
    SwaggerModule.setup('doc', app, document as OpenAPIObject);
  } catch (error) {
    console.error('Error loading YAML document:', error);
  }

  await app.listen(PROCESS.env.PORT || 4000);
}
bootstrap();
