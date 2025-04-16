import { BadRequestException, ConflictException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción: DuplicateResourceException
 *
 * ⚠️ Se lanza cuando se intenta crear un recurso que ya existe.
 * Representa un error 409 - Conflict.
 *
 * @example
 * throw new DuplicateResourceException('El CUIT ya está registrado');
 */
export class DuplicateResourceException extends ConflictException {
  constructor(message = 'El recurso ya existe') {
    super(message);
  }
}

/**
 * Excepción: InvalidForeignKeyException
 *
 * 🚫 Se lanza cuando se intenta asociar una entidad con una clave foránea inválida.
 * Representa un error 400 - Bad Request.
 *
 * @example
 * throw new InvalidForeignKeyException('La empresa no existe');
 */
export class InvalidForeignKeyException extends BadRequestException {
  constructor(message = 'Referencia inválida') {
    super(message);
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message = 'Too Many Requests') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
