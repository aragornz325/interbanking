import { Transferencia } from './transferencia.entity';

/**
 * Puerto de salida: TransferenciaRepository
 *
 * 🧾 Define el contrato que deben implementar los adaptadores de infraestructura
 * para manejar la persistencia de transferencias.
 *
 * 📦 Esta interfaz forma parte del patrón de arquitectura hexagonal,
 * permitiendo que la capa de aplicación (casos de uso) interactúe con
 * las transferencias sin conocer detalles del almacenamiento (ORM, base de datos, etc.).
 *
 * Se espera que un adaptador (ej: TypeORM, Prisma, memoria) implemente esta interfaz.
 *
 * @method listarPorEmpresa - Retorna todas las transferencias asociadas a una empresa por su ID.
 * @method listarUltimoMes - Retorna todas las transferencias realizadas durante el último mes calendario.
 * @method guardar - Persiste una transferencia en la fuente de datos.
 */
export abstract class TransferenciaRepository {
  abstract listarPorEmpresa(empresaId: string): Promise<Transferencia[]>;
  abstract listarUltimoMes(): Promise<Transferencia[]>;
  abstract guardar(transferencia: Transferencia): Promise<void>;
}
