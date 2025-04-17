import { Logger } from '@nestjs/common';

import { ErrorManager } from '../exceptions/error-manager';
import { PerformOperationParams } from '../interfaces/operation-handler.interface';

/**
 * Clase abstracta: BaseController
 *
 * 🧭 Define una clase base para todos los controladores del sistema.
 * Provee un mecanismo estándar para ejecutar operaciones encapsuladas
 * con manejo de errores, logs y contexto de ejecución.
 *
 * ✅ Implementa el patrón de `performOperation`, utilizando un logger
 * y delegando errores a `ErrorManager`.
 *
 * ✔️ Heredar esta clase asegura que todos los endpoints
 * tengan trazabilidad y control de fallos unificados.
 */
export abstract class BaseController {
  protected readonly logger: Logger;

  constructor(contextName: string) {
    this.logger = new Logger(contextName);
  }

  /**
   * Ejecuta una operación dentro del contexto del controlador.
   *
   * 📋 Esta función envuelve una función asíncrona (`operation`) con
   * logs de inicio/éxito/fallo y delega el manejo de errores al `ErrorManager`.
   *
   * @template T - Tipo de retorno esperado.
   * @param operation - Función que realiza la lógica principal.
   * @param context - Contexto de ejecución (por defecto: 'CONTROLLER').
   * @param functionName - Nombre de la operación (para los logs).
   * @returns Resultado de la operación si es exitosa.
   * @throws Error transformada o relanzada por ErrorManager.
   *
   * @example
   * return this.performControllerOperation({
   *   functionName: 'crear empresa',
   *   context: 'empresaController',
   *   operation: async () => this.crearEmpresaUseCase.execute(...)
   * });
   */
  protected async performControllerOperation<T>({
    operation,
    context = 'CONTROLLER',
    functionName,
  }: PerformOperationParams<T>): Promise<T> {
    try {
      this.logger.log(
        `\x1b[35m🟢 [${context}] ${functionName ?? 'Operación'} iniciada \x1b[35m`,
      );
      const result = await operation();
      this.logger.log(
        `\x1b[35m ✅ [${context}] ${functionName ?? 'Operación'} completada con éxito \x1b[35m`,
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
