/**
 * Entidad de dominio: Transferencia
 *
 * Representa un movimiento financiero realizado por una empresa,
 * incluyendo origen, destino, importe y fecha.
 *
 * 📌 Esta entidad es utilizada para modelar las operaciones financieras
 * asociadas a una empresa en el sistema, y no está acoplada a ninguna
 * implementación técnica (ORM, base de datos, etc.).
 *
 * Se construye desde el repositorio y se utiliza en los casos de uso para
 * componer respuestas de negocio o aplicar lógica asociada.
 *
 * @property id - Identificador único de la transferencia (UUID).
 * @property empresaId - ID de la empresa que realizó la transferencia.
 * @property cuentaDebito - Número de cuenta desde la cual se debitó el importe.
 * @property cuentaCredito - Número de cuenta a la cual se acreditó el importe.
 * @property importe - Monto de dinero transferido.
 * @property fecha - Fecha en que se realizó la operación.
 *
 * @example
 * const t = new Transferencia('uuid', 'empresa-id', '000123', '000456', 5000.75, new Date());
 */
export class Transferencia {
  constructor(
    public readonly id: string,
    public readonly empresaId: string,
    public readonly cuentaDebito: string,
    public readonly cuentaCredito: string,
    public readonly importe: number,
    public readonly fecha: Date,
  ) {}
}
