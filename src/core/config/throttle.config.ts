import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60,
      limit: 5,
    },
  ],
  getTracker: (req) => req.ip ?? req.headers['x-forwarded-for'] ?? 'unknown',
  generateKey: (context: ExecutionContext, _tracker: string): string => {
    const req = context.switchToHttp().getRequest();

    const ip = req.ip ?? req.headers['x-forwarded-for'] ?? 'unknown';
    const method = req.method;
    const path = req.originalUrl || req.url;
    const userAgent = req.headers['user-agent'] ?? 'unknown';

    return `${ip}-${method}-${path}-${userAgent}`;
  },
};
