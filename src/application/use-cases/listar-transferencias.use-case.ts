import { Injectable, Inject } from '@nestjs/common';
import {
  EmpresaRepository,
  EMPRESA_REPOSITORY,
} from 'src/core/domain/empresa.repository';
import { Empresa } from 'src/core/domain/empresa.entity';
import { BaseService } from 'src/shared/utils/perform-service-operation';
import { Transferencia } from 'src/core/domain/transferencia.entity';

@Injectable()
export class ListarEmpresasConTransferenciasUltimoMesUseCase extends BaseService {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepo: EmpresaRepository,
  ) {
    super(ListarEmpresasConTransferenciasUltimoMesUseCase.name);
  }
  /**
   * Caso de uso: Listar empresas con transferencias realizadas durante el último mes calendario.
   *
   * 🔄 Este método consulta el repositorio de empresas, el cual retorna
   * cada empresa junto con sus transferencias registradas durante el mes calendario anterior.
   *
   * ⚙️ La lógica se encuentra optimizada mediante una RawQuery con `JOIN` y `GROUP BY`,
   * evitando el problema de N+1 y mejorando el rendimiento de consulta.
   *
   * 🛡️ El método también gestiona logs y errores mediante `performServiceOperation`.
   *
   * @returns Promesa que resuelve con un array de objetos que contienen:
   *  - `empresa`: Instancia de la entidad `Empresa`.
   *  - `transferencias`: Array de transferencias asociadas a dicha empresa.
   *
   * @throws Error si ocurre una falla durante la operación.
   *
   * @example
   * const resultados = await useCase.execute();
   * console.log(resultados[0].empresa.razonSocial);
   * console.log(resultados[0].transferencias.length);
   */
  async execute(): Promise<
    Array<{ empresa: Empresa; transferencias: Transferencia[] }>
  > {
    return await this.performServiceOperation({
      functionName: 'listar empresas con transferencias',
      operation: async () =>
        await this.empresaRepo.listarEmpresasConTransferenciasUltimoMes(),
      context: 'listarTransferenciasUseCase',
    });
  }
}
