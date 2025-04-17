import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Token del repositorio
import { EMPRESA_REPOSITORY } from 'src/modules/empresa/domain/empresa.repository';

// Casos de uso (application layer)
import { CrearEmpresaUseCase } from './application/use-cases/crear-empresa.use-case';
import { ListarEmpresasAdheridasUltimoMesUseCase } from './application/use-cases/listar-adhesiones.use-case';
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from './application/use-cases/listar-transferencias.use-case';
// Infraestructura y persistencia
import {
  EmpresaOrmEntity,
  EmpresaRepositoryImpl,
  TransferenciaOrmEntity,
} from './infrastructure/persistence';
// Presentación
import { EmpresaController } from './presentation/controllers/empresa.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpresaOrmEntity, TransferenciaOrmEntity]),
  ],
  controllers: [EmpresaController],
  providers: [
    {
      provide: EMPRESA_REPOSITORY,
      useClass: EmpresaRepositoryImpl,
    },
    CrearEmpresaUseCase,
    ListarEmpresasAdheridasUltimoMesUseCase,
    ListarEmpresasConTransferenciasUltimoMesUseCase,
  ],
  exports: [],
})
export class EmpresaModule {}
