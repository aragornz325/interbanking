import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DuplicateResourceException,
  InvalidForeignKeyException,
} from 'src/shared/exceptions/custom.exceptions';
import { ErrorManager } from 'src/shared/exceptions/error-manager';
import { QueryFailedError } from 'typeorm';

describe('ErrorManager', () => {
  const createFakeError = (code: string): any => ({
    driverError: { code },
  });

  it('debe lanzar DuplicateResourceException para código 23505', () => {
    expect(() => ErrorManager.handle(createFakeError('23505'))).toThrow(
      DuplicateResourceException,
    );
  });

  it('debe lanzar InvalidForeignKeyException para código 23503', () => {
    expect(() => ErrorManager.handle(createFakeError('23503'))).toThrow(
      InvalidForeignKeyException,
    );
  });

  it('debe lanzar BadRequestException para código 23502', () => {
    expect(() => ErrorManager.handle(createFakeError('23502'))).toThrow(
      BadRequestException,
    );
  });

  it('debe lanzar InternalServerErrorException para código desconocido', () => {
    expect(() => ErrorManager.handle(createFakeError('99999'))).toThrow(
      InternalServerErrorException,
    );
  });

  it('debe relanzar si no es un error manejable', () => {
    const customError = new Error('Custom');
    expect(() => ErrorManager.handle(customError)).toThrow(customError);
  });

  it('debe lanzar Error por defecto si no es una instancia de Error', () => {
    expect(() => ErrorManager.handle('error string')).toThrowError(
      'Unknown error',
    );
  });

  it('debe manejar errores QueryFailedError directamente', () => {
    const driverError = { code: '23505' } as never;
    const error = new QueryFailedError('SELECT', [], driverError);
    expect(() => ErrorManager.handle(error)).toThrow(
      DuplicateResourceException,
    );
  });
});
