import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config
import { throttlerConfig } from './core/config/throttle.config';
import { CustomThrottlerGuard } from './core/guards/custom-throttler.guard';
// Core
import { LoggerMiddleware } from './core/middlewares/audit';
import { getTypeOrmConfig } from './modules/database/orm.dataSource';
// Módulos propios
import { EmpresaModule } from './modules/empresa/empresa.module';

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
    EmpresaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*path',
      method: RequestMethod.ALL,
    });
  }
}
