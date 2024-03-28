import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      '[HTTP]',
      'LOG',
      req.method,
      req.baseUrl,
      JSON.stringify(req.query),
      JSON.stringify(req.body),
      res.statusCode,
    );
    next();
  }
}
