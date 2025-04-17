/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerLimitDetail, ThrottlerStorage } from '@nestjs/throttler';
import { CustomThrottlerGuard } from 'src/core/guards/custom-throttler.guard';
import { TooManyRequestsException } from 'src/shared/exceptions/custom.exceptions';

describe('CustomThrottlerGuard', () => {
  let guard: CustomThrottlerGuard;
  let loggerWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    const mockOptions = {} as any;
    const mockStorage = {} as ThrottlerStorage;
    const mockReflector = {} as Reflector;

    guard = new CustomThrottlerGuard(mockOptions, mockStorage, mockReflector);
    loggerWarnSpy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe lanzar TooManyRequestsException y loguear advertencia', async () => {
    const mockRequest = {
      ip: '123.456.789.000',
      method: 'GET',
      originalUrl: '/api/test',
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as Partial<ExecutionContext> as ExecutionContext;

    const throttlerDetail: ThrottlerLimitDetail = {
      key: 'ip:/ruta:GET',
      limit: 5,
      ttl: 60,
      totalHits: 6,
      timeToExpire: 42,
      tracker: 'mocked-tracker',
      isBlocked: false,
      timeToBlockExpire: 0,
    };

    await expect(
      guard['throwThrottlingException'](mockContext, throttlerDetail),
    ).rejects.toThrow(TooManyRequestsException);

    expect(loggerWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠️ Throttle excedido para IP 123.456.789.000'),
    );
  });
});
