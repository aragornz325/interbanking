import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import {
  DuplicateResourceException,
  InvalidForeignKeyException,
} from './custom.exceptions';

interface PostgresError {
  driverError: {
    code: string;
  };
}

export class ErrorManager {
  static handle(error: unknown): never {
    const isPostgresError =
      error instanceof QueryFailedError ||
      (typeof error === 'object' &&
        error !== null &&
        'driverError' in error &&
        typeof (error as any).driverError?.code === 'string');

    if (isPostgresError) {
      const code = (error as PostgresError).driverError.code;

      switch (code) {
        case '23505':
          throw new DuplicateResourceException();

        case '23503':
          throw new InvalidForeignKeyException();

        case '23502':
          throw new BadRequestException('Campo obligatorio no puede ser nulo');

        default:
          throw new InternalServerErrorException(
            'Error de base de datos desconocido',
          );
      }
    }

    // ✅ Relanzamos si no se pudo manejar, asegurando tipo
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}
