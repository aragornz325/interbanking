import { HttpStatus } from '@nestjs/common';
import {
  DuplicateResourceException,
  InvalidForeignKeyException,
  TooManyRequestsException,
} from 'src/shared/exceptions/custom.exceptions';

describe('Custom Exceptions', () => {
  describe('DuplicateResourceException', () => {
    it('debe lanzar con mensaje por defecto y status 409', () => {
      const ex = new DuplicateResourceException();
      expect(ex.message).toBe('El recurso ya existe');
      expect(ex.getStatus()).toBe(HttpStatus.CONFLICT);
    });

    it('debe lanzar con mensaje personalizado', () => {
      const ex = new DuplicateResourceException('Ya existe el CUIT');
      expect(ex.message).toBe('Ya existe el CUIT');
    });
  });

  describe('InvalidForeignKeyException', () => {
    it('debe lanzar con mensaje por defecto y status 400', () => {
      const ex = new InvalidForeignKeyException();
      expect(ex.message).toBe('Referencia inválida');
      expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('debe lanzar con mensaje personalizado', () => {
      const ex = new InvalidForeignKeyException('Empresa no encontrada');
      expect(ex.message).toBe('Empresa no encontrada');
    });
  });

  describe('TooManyRequestsException', () => {
    it('debe lanzar con mensaje por defecto y status 429', () => {
      const ex = new TooManyRequestsException();
      expect(ex.message).toBe('Too Many Requests');
      expect(ex.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it('debe lanzar con mensaje personalizado', () => {
      const ex = new TooManyRequestsException('Demasiadas peticiones seguidas');
      expect(ex.message).toBe('Demasiadas peticiones seguidas');
    });
  });
});
