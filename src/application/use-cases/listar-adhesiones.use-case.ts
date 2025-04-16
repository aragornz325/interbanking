import { Injectable, Inject } from '@nestjs/common';
import {
  EmpresaRepository,
  EMPRESA_REPOSITORY,
} from 'src/core/domain/empresa.repository';
import { Empresa } from 'src/core/domain/empresa.entity';
import { BaseService } from 'src/shared/utils/perform-service-operation';

@Injectable()
export class ListarEmpresasAdheridasUltimoMesUseCase extends BaseService {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepo: EmpresaRepository,
  ) {
    super(ListarEmpresasAdheridasUltimoMesUseCase.name);
  }

  /**
   * Caso de uso: Listar empresas adheridas en el último mes calendario.
   *
   * 🏢 Este método consulta el repositorio de empresas para recuperar aquellas
   * cuya fecha de adhesión se encuentre dentro del mes calendario anterior al actual.
   *
   * ⚙️ Utiliza `performServiceOperation` para registrar la operación con logs
   * y capturar errores de manera estructurada.
   *
   * @returns Promesa que resuelve con un array de instancias de `Empresa`.
   *
   * @throws Error si ocurre una falla durante la consulta.
   *
   * @example
   * const empresas = await useCase.execute();
   * console.log(empresas.length); // Total de empresas adheridas en el último mes
   */
  async execute(): Promise<Empresa[]> {
    return await this.performServiceOperation({
      functionName: 'listar empresas adheridas en el último mes',
      operation: async () =>
        await this.empresaRepo.listarEmpresasAdheridasUltimoMes(),
      context: 'listarEmpresasAdheridasUltimoMesUseCase',
    });
  }
}
