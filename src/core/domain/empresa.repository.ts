import { Empresa } from './empresa.entity';
import { Transferencia } from './transferencia.entity';

export const EMPRESA_REPOSITORY = Symbol('EmpresaRepository');

/**
 * Puerto de salida: EmpresaRepository
 *
 * 🧱 Esta clase abstracta define el contrato que deben implementar
 * los adaptadores de infraestructura para manejar la persistencia de empresas.
 *
 * 🔁 Se utiliza desde los casos de uso (capa de aplicación) para garantizar
 * independencia de la lógica de negocio respecto al motor de base de datos.
 *
 * 📌 Forma parte de la arquitectura hexagonal, actuando como interfaz que
 * permite desacoplar el dominio de los detalles técnicos (ORM, DB, etc).
 *
 * @symbol EMPRESA_REPOSITORY - Token utilizado para la inyección de dependencias.
 *
 * @method crear - Persiste una nueva empresa en la base de datos.
 * @method listarEmpresasAdheridasUltimoMes - Devuelve las empresas adheridas durante el último mes calendario.
 * @method listarEmpresasConTransferenciasUltimoMes - Devuelve las empresas con transferencias en el último mes calendario junto con sus movimientos.
 */
export abstract class EmpresaRepository {
  abstract crear(empresa: Empresa): Promise<Empresa>;
  abstract listarEmpresasAdheridasUltimoMes(): Promise<Empresa[]>;
  abstract listarEmpresasConTransferenciasUltimoMes(): Promise<
    Array<{
      empresa: Empresa;
      transferencias: Transferencia[];
    }>
  >;
}
