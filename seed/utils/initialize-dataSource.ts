import {
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
} from 'src/modules/empresa/infrastructure/persistence/index';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export async function initializeDataSource(): Promise<DataSource> {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [EmpresaOrmEntity, TransferenciaOrmEntity],
    namingStrategy: new SnakeNamingStrategy(),
  });
  return await AppDataSource.initialize();
}
