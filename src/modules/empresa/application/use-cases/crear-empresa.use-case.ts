import { Inject, Injectable } from '@nestjs/common';
import { Empresa } from 'src/modules/empresa/domain/empresa.entity';
import {
  EMPRESA_REPOSITORY,
  EmpresaRepository,
} from 'src/modules/empresa/domain/empresa.repository';
import { BaseService } from 'src/shared/utils/perform-service-operation';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CrearEmpresaUseCase extends BaseService {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepo: EmpresaRepository,
  ) {
    super(CrearEmpresaUseCase.name);
  }

  /**
   * Caso de uso: Crear una nueva empresa.
   *
   * 🏢 Este método encapsula la lógica de creación de una empresa,
   * generando su ID único (UUID) y asignando la fecha de adhesión actual.
   *
   * 🎯 El objetivo es registrar una empresa nueva a partir de su CUIT y razón social,
   * delegando la persistencia al repositorio, y asegurando trazabilidad con logs y manejo de errores.
   *
   * @param cuit - El CUIT único de la empresa (11 dígitos numéricos).
   * @param razonSocial - Nombre legal o comercial de la empresa.
   * @returns Instancia persistida de `Empresa`, con ID y fecha de adhesión definidos.
   *
   * @throws DuplicateResourceException si ya existe una empresa con el mismo CUIT.
   * @throws Error general si ocurre una falla en el proceso de creación.
   *
   * @example
   * const empresa = await useCase.execute('20304050607', 'Spartan Logistics S.A.');
   * console.log(empresa.id); // UUID generado
   */
  async execute(cuit: string, razonSocial: string): Promise<Empresa> {
    const nuevaEmpresa = new Empresa(uuidv4(), cuit, razonSocial, new Date());
    return await this.performServiceOperation({
      functionName: 'crear empresa',
      operation: async () => {
        const empresaCreada = await this.empresaRepo.crear(nuevaEmpresa);
        return empresaCreada;
      },
      context: 'crearEmpresaUseCase',
    });
  }
}
