import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const requestTime = new Date().getTime();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = new Date().getTime();

      if (statusCode == 200 || statusCode == 201)
        this.logger.log(
          `${method} ${originalUrl} - ${statusCode} - ${responseTime - requestTime}ms`,
        );
    });
    next();
  }
}
