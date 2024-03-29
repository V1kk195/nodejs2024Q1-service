import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggingService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new LoggingService(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const isHttpException = exception instanceof HttpException;

    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = isHttpException
      ? ((exception as HttpException).getResponse() as any)?.error
      : 'Internal server error';

    const message = isHttpException
      ? ((exception as HttpException).getResponse() as Error)?.message
      : 'Internal server error';

    const timestamp = new Date().toISOString();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    const responseBody = {
      statusCode: httpStatus,
      error,
      message,
      timestamp,
      path,
    };

    this.logger.error(`${httpStatus} ${path} ${message} ${timestamp} `);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
