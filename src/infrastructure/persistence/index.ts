import { EmpresaOrmEntity } from './typeorm/empresa.orm-entity';
import { EmpresaRepositoryImpl } from './typeorm/empresa.repository.impl';
import { TransferenciaOrmEntity } from './typeorm/transferencia.orm-entity';

export const ormEntities = [
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
  EmpresaRepositoryImpl,
];
