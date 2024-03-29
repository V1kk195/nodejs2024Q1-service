import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as PROCESS from 'process';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { LoggingService } from './logger/logger.service';
import { AllExceptionsFilter } from './exceptionFilter/exceptionFilter';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: [process.env.LOG_LEVEL as LogLevel],
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  const logger = new LoggingService();
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());

  try {
    const document = yaml.load(
      readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
    );
    SwaggerModule.setup('doc', app, document as OpenAPIObject);
  } catch (error) {
    console.error('Error loading YAML document:', error);
  }

  process.on('uncaughtException', (err, origin) => {
    logger.error(err, origin);
  });

  process.on('unhandledRejection', (reason: string, promise) => {
    logger.error('Unhandled Rejection at:', reason);
  });

  await app.listen(PROCESS.env.PORT || 4000);
}
bootstrap();
