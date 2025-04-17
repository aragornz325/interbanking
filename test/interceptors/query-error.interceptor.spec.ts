/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { QueryErrorInterceptor } from 'src/shared/exceptions/query-error.interceptor';

describe('QueryErrorInterceptor', () => {
  let interceptor: QueryErrorInterceptor;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [QueryErrorInterceptor],
    }).compile();

    interceptor = moduleRef.get(QueryErrorInterceptor);
  });

  const mockContext = {} as ExecutionContext;

  const simulateCallHandler = (error: any): CallHandler => ({
    handle: () => throwError(() => error),
  });

  it('debe lanzar ConflictException cuando el código es 23505', (done) => {
    const error = { driverError: { code: '23505' } };

    interceptor.intercept(mockContext, simulateCallHandler(error)).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toContain('clave única');
        done();
      },
    });
  });

  it('debe lanzar BadRequestException cuando el código es 23503', (done) => {
    const error = { driverError: { code: '23503' } };

    interceptor.intercept(mockContext, simulateCallHandler(error)).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toContain('foránea');
        done();
      },
    });
  });

  it('debe lanzar BadRequestException cuando el código es 23502', (done) => {
    const error = { driverError: { code: '23502' } };

    interceptor.intercept(mockContext, simulateCallHandler(error)).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toContain('nulo');
        done();
      },
    });
  });

  it('debe lanzar InternalServerErrorException para otros códigos', (done) => {
    const error = { driverError: { code: '99999' } };

    interceptor.intercept(mockContext, simulateCallHandler(error)).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toContain('base de datos');
        done();
      },
    });
  });

  it('debe relanzar errores que no tienen driverError', (done) => {
    const error = new Error('Otro error');

    interceptor.intercept(mockContext, simulateCallHandler(error)).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        done();
      },
    });
  });
});
