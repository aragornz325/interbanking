import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferenciaOrmEntity } from './infrastructure/persistence/typeorm/transferencia.orm-entity';
import { EmpresaOrmEntity } from './infrastructure/persistence/typeorm/empresa.orm-entity';
import { EmpresaRepositoryImpl } from './infrastructure/persistence/typeorm/empresa.repository.impl';
import { CrearEmpresaUseCase } from './application/use-cases/crear-empresa.use-case';
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from './application/use-cases/listar-transferencias.use-case';
import { ListarEmpresasAdheridasUltimoMesUseCase } from './application/use-cases/listar-adhesiones.use-case';
import { EMPRESA_REPOSITORY } from './core/domain/empresa.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './core/config/orm.dataSource';
import { EmpresaController } from './presentation/controllers/empresa.controller';
import { LoggerMiddleware } from './core/middlewares/audit';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './core/config/throttle.config';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './core/guards/custom-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([EmpresaOrmEntity, TransferenciaOrmEntity]),
  ],
  controllers: [EmpresaController],
  providers: [
    {
      provide: EMPRESA_REPOSITORY,
      useClass: EmpresaRepositoryImpl,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    CrearEmpresaUseCase,
    ListarEmpresasConTransferenciasUltimoMesUseCase,
    ListarEmpresasAdheridasUltimoMesUseCase,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
