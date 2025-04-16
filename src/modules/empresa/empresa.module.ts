import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infraestructura y persistencia
import {
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
  EmpresaRepositoryImpl,
} from './infrastructure/persistence';

// Casos de uso (application layer)
import { CrearEmpresaUseCase } from './application/use-cases/crear-empresa.use-case';
import { ListarEmpresasAdheridasUltimoMesUseCase } from './application/use-cases/listar-adhesiones.use-case';
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from './application/use-cases/listar-transferencias.use-case';

// Presentación
import { EmpresaController } from './presentation/controllers/empresa.controller';

// Token del repositorio
import { EMPRESA_REPOSITORY } from 'src/modules/empresa/domain/empresa.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpresaOrmEntity, TransferenciaOrmEntity]),
  ],
  controllers: [EmpresaController],
  providers: [
    { provide: EMPRESA_REPOSITORY, useClass: EmpresaRepositoryImpl },
    CrearEmpresaUseCase,
    ListarEmpresasAdheridasUltimoMesUseCase,
    ListarEmpresasConTransferenciasUltimoMesUseCase,
  ],
  exports: [],
})
export class EmpresaModule {}
