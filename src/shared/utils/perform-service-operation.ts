import { Logger } from '@nestjs/common';
import { ErrorManager } from '../exceptions/error-manager';
import { PerformOperationParams } from '../interfaces/operation-handler.interface';

/**
 * Clase abstracta: BaseService
 *
 * 🛠️ Clase base para todos los servicios y casos de uso en la capa de aplicación.
 * Proporciona un wrapper estándar para ejecutar lógica de negocio con:
 * - Logging estructurado
 * - Contexto dinámico
 * - Manejo centralizado de errores
 *
 * 🚀 Al extender esta clase, cada servicio gana trazabilidad y robustez
 * sin tener que repetir lógica de logging o try/catch.
 */

export abstract class BaseService {
  protected readonly logger: Logger;
  constructor(contextName: string) {
    this.logger = new Logger(contextName);
  }

  /**
   * Ejecuta una operación controlada dentro de un servicio o use case.
   *
   * 🔁 Encapsula cualquier función asíncrona con logs de inicio, éxito y fallo.
   * Si ocurre un error, lo maneja de forma centralizada usando `ErrorManager`.
   *
   * @template T - Tipo del resultado esperado.
   * @param operation - Función que contiene la lógica del servicio.
   * @param context - Nombre del contexto (por defecto: 'SERVICE').
   * @param functionName - Nombre específico de la operación, útil para logs.
   * @returns El resultado de la operación si tiene éxito.
   * @throws Una excepción manejada o relanzada por `ErrorManager`.
   *
   * @example
   * return this.performServiceOperation({
   *   functionName: 'listar empresas',
   *   context: 'listarEmpresasUseCase',
   *   operation: async () => this.empresaRepo.listarEmpresas()
   * });
   */
  protected async performServiceOperation<T>({
    operation,
    context = 'SERVICE',
    functionName,
  }: PerformOperationParams<T>): Promise<T> {
    try {
      this.logger.log(
        `🟢 [${context}] ${functionName ?? 'Operación'} iniciada`,
      );
      const result = await operation();
      this.logger.log(
        `✅ [${context}] ${functionName ?? 'Operación'} completada con éxito`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `❌ [${context}] ${functionName ?? 'Operación'} fallida`,
        error instanceof Error ? error.stack : String(error),
      );
      ErrorManager.handle(error);
    }
  }
}
