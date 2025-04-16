import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EmpresaOrmEntity } from 'src/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from 'src/infrastructure/persistence/typeorm/transferencia.orm-entity';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from 'src/shared/constant/db.constant';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get(DB_HOST),
  port: config.get(DB_PORT),
  username: config.get(DB_USER),
  password: config.get(DB_PASSWORD),
  database: config.get(DB_NAME),
  entities: [EmpresaOrmEntity, TransferenciaOrmEntity],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
});
