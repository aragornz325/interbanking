/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExecutionContext } from '@nestjs/common';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

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
