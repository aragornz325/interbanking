import { NextFunction, Request, Response } from 'express';
import { LoggerMiddleware } from 'src/core/middlewares/audit';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    jest.spyOn<any, any>(middleware['logger'], 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería loguear información de la petición (camino feliz)', () => {
    const req = {
      method: 'GET',
      originalUrl: '/ruta',
      headers: { 'user-agent': 'chrome' },
      ip: '123.456.789.0',
    } as unknown as Request;

    const res = {
      statusCode: 200,
      on: (event: string, cb: () => void) => {
        if (event === 'finish') cb();
        return res;
      },
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('debería usar fallback para IP y User-Agent cuando no están definidos', () => {
    const req = {
      method: 'POST',
      originalUrl: '/otro-endpoint',
      headers: {},
      connection: { remoteAddress: '192.168.0.1' },
    } as unknown as Request;

    const res = {
      statusCode: 201,
      on: (event: string, cb: () => void) => {
        if (event === 'finish') cb();
        return res;
      },
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
