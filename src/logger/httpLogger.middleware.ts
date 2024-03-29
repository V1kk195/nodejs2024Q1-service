import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new LoggingService(HttpLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    res.on('close', () => {
      this.logger.log(
        `[HTTP] ${req.method} ${req.url} ${res.statusCode} ${JSON.stringify(
          req.query,
        )} ${JSON.stringify(req.body)}`,
      );
    });

    next();
  }
}
