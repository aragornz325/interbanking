/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { TooManyRequestsException } from 'src/shared/exceptions/custom.exceptions';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const req = context.switchToHttp().getRequest();

    this.logger.warn(
      `⚠️ Throttle excedido para IP ${req.ip} → limit=${throttlerLimitDetail.limit}, ttl=${throttlerLimitDetail.ttl}s, endpoint=${req.method} ${req.originalUrl}`,
    );

    throw new TooManyRequestsException(
      '⚠️ Has superado el límite de peticiones. Esperá un momento antes de reintentar.',
    );
  }
}
