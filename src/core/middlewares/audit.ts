import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('AuditLog');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress;

    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      this.logger.log(
        `\x1b[34m${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - UA: ${userAgent}\x1b[34m`,
      );
    });

    next();
  }
}
