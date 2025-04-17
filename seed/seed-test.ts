import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import * as path from 'path';
import {
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
} from 'src/modules/empresa/infrastructure/persistence/index';
import { Repository } from 'typeorm';

import { empresasData, TRANSFERENCIAS } from './utils/data-test.seed';
import { initializeDataSource } from './utils/initialize-dataSource';

export async function seedTestData() {
  const logger = new Logger('SeedTestData');
  logger.log('Iniciando seed de datos de prueba...');

  if (!process.env.CI) {
    config({ path: path.resolve(__dirname, '../.test.env') });
  }

  const AppDataSource = await initializeDataSource();
  logger.debug('Conectado a la DB');

  const empresaRepo: Repository<EmpresaOrmEntity> =
    AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo: Repository<TransferenciaOrmEntity> =
    AppDataSource.getRepository(TransferenciaOrmEntity);

  logger.debug('Limpiando datos...');
  await transferenciaRepo.delete({});
  await empresaRepo.delete({});

  try {
    await empresaRepo.save(empresasData);
    await transferenciaRepo.save(
      TRANSFERENCIAS.map((t) => ({
        ...t,
      })),
    );
    logger.log('Datos de prueba insertados con éxito');
  } catch (error) {
    logger.error('Error al insertar datos', error);
    throw error;
  }

  logger.debug('Seed completado con éxito ✅');

  await AppDataSource.destroy();
  logger.log('conexión a la DB cerrada');
}

if (require.main === module) {
  seedTestData().catch((err) => {
    console.error('[SEED-TEST] Falló el seed', err);
    process.exit(1);
  });
}
