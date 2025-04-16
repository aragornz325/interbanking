import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class QueryErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // Detectamos por estructura si es un error de TypeORM / Postgres
        const code = err?.driverError?.code;

        if (code) {
          switch (code) {
            case '23505':
              console.log('[INTERCEPTOR] Clave duplicada interceptada');
              return throwError(
                () =>
                  new ConflictException(
                    'El recurso ya existe (violación de clave única)',
                  ),
              );

            case '23503':
              return throwError(
                () =>
                  new BadRequestException(
                    'Referencia inválida (clave foránea)',
                  ),
              );

            case '23502':
              return throwError(
                () =>
                  new BadRequestException(
                    'Campo obligatorio no puede ser nulo',
                  ),
              );

            default:
              return throwError(
                () =>
                  new InternalServerErrorException('Error de base de datos'),
              );
          }
        }

        return throwError(() => err);
      }),
    );
  }
}
