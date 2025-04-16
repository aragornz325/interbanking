// Nest core
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

// Nest modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// Config / Middleware / Guards
import { getTypeOrmConfig } from './core/config/orm.dataSource';
import { throttlerConfig } from './core/config/throttle.config';
import { LoggerMiddleware } from './core/middlewares/audit';
import { CustomThrottlerGuard } from './core/guards/custom-throttler.guard';

// Domain / Application
import { EMPRESA_REPOSITORY } from './core/domain/empresa.repository';
import { useCases } from './application';

// ORM Entities
import { ormEntities } from './infrastructure/persistence';

// Presentation
import { EmpresaController } from './presentation/controllers/empresa.controller';
import { EmpresaRepositoryImpl } from './infrastructure/persistence/typeorm/empresa.repository.impl';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig),
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    TypeOrmModule.forFeature(ormEntities),
  ],
  controllers: [EmpresaController],
  providers: [
    { provide: EMPRESA_REPOSITORY, useClass: EmpresaRepositoryImpl },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    ...useCases,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
