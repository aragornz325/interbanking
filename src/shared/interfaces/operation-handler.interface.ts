/**
 * Interfaz: PerformOperationParams<T>
 *
 * ⚙️ Define los parámetros necesarios para ejecutar una operación
 * asincrónica controlada mediante el helper `performOperation`.
 *
 * 📦 Esta interfaz es utilizada tanto por `performControllerOperation`
 * como `performServiceOperation` para aplicar un wrapper profesional
 * alrededor de cualquier lógica con logs y manejo centralizado de errores.
 *
 * @typeParam T - Tipo del valor que se espera como resultado de la operación.
 *
 * @property operation - Función asíncrona que encapsula la lógica principal a ejecutar.
 * @property context - (Opcional) Nombre o etiqueta que indica el contexto de ejecución (por ej. 'empresaController').
 * @property functionName - (Opcional) Nombre descriptivo de la función o caso de uso que se está ejecutando.
 *
 * @example
 * {
 *   functionName: 'crear empresa',
 *   context: 'empresaController',
 *   operation: async () => service.crear(dto)
 * }
 */
export interface PerformOperationParams<T> {
  operation: () => Promise<T>;
  context?: string;
  functionName?: string;
}
