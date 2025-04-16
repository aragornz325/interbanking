import { CrearEmpresaUseCase } from './use-cases/crear-empresa.use-case';
import { ListarEmpresasAdheridasUltimoMesUseCase } from './use-cases/listar-adhesiones.use-case';
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from './use-cases/listar-transferencias.use-case';

export const useCases = [
  CrearEmpresaUseCase,
  ListarEmpresasConTransferenciasUltimoMesUseCase,
  ListarEmpresasAdheridasUltimoMesUseCase,
];
