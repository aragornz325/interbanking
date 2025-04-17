/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerMiddleware } from 'src/core/middlewares/audit';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    loggerSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería llamar a next() y loguear en finish', () => {
    const req = {
      method: 'GET',
      originalUrl: '/api/test',
      headers: { 'user-agent': 'JestTest' },
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' },
    } as Partial<Request> as Request;

    const res = {
      statusCode: 200,
      on: jest.fn(((event: string, callback: () => void) => {
        if (event === 'finish') callback();
        return res;
      }) as (event: string, callback: () => void) => Response),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    middleware.use(req, res, next);

    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(next).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/test 200'),
    );
  });
});
