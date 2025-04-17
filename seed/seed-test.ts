import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { startOfMonth, subMonths } from 'date-fns';
import { config } from 'dotenv';
import path from 'path';
import {
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
} from 'src/modules/empresa/infrastructure/persistence';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  checkClean,
  confirmTransferenciaPersistencia,
  generateUniqueCuit,
  waitForDb,
} from './utils';

if (!process.env.CI) {
  config({ path: path.resolve(__dirname, '../.test.env') });
}

const logger = new Logger('Seed Test');

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

async function seed({ logger }: { logger: Logger }): Promise<void> {
  await AppDataSource.initialize();
  await waitForDb({ logger, dataSource: AppDataSource });
  logger.debug('Conectado a la base de datos');

  await AppDataSource.query(
    'TRUNCATE TABLE transferencias RESTART IDENTITY CASCADE',
  );
  await AppDataSource.query('TRUNCATE TABLE empresas RESTART IDENTITY CASCADE');

  await new Promise((res) => setTimeout(res, 100));

  const empresaRepo = AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = AppDataSource.getRepository(TransferenciaOrmEntity);

  await checkClean({ empresaRepo, transferenciaRepo, logger });

  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));

  let cuit: string;
  let intentos = 0;
  let existente: EmpresaOrmEntity | null = null;

  do {
    cuit = generateUniqueCuit();
    existente = await empresaRepo.findOne({ where: { cuit } });
    intentos++;
    if (existente) {
      logger.warn(`[SEED] CUIT duplicado en intento ${intentos}: ${cuit}`);
    }
  } while (existente && intentos < 10);

  if (existente) {
    throw new Error('[SEED] No se pudo generar un CUIT único tras 10 intentos');
  }

  const empresa = empresaRepo.create({
    cuit,
    razonSocial: 'Empresa Test',
    fechaAdhesion: new Date(
      Date.UTC(
        lastMonthStart.getUTCFullYear(),
        lastMonthStart.getUTCMonth(),
        4,
        12,
        0,
        0,
      ),
    ),
  });

  await empresaRepo.save(empresa);

  const transferencia = transferenciaRepo.create({
    empresa,
    empresaId: empresa.id,
    cuentaDebito: faker.finance.accountNumber(),
    cuentaCredito: faker.finance.accountNumber(),
    importe: faker.number.float({
      min: 1000,
      max: 10000,
      fractionDigits: 2,
    }),
    fecha: new Date(
      Date.UTC(
        lastMonthStart.getUTCFullYear(),
        lastMonthStart.getUTCMonth(),
        4,
        12,
        0,
        0,
      ),
    ),
  });
  logger.debug('[SEED] Confirmada persistencia en base de datos');
  await transferenciaRepo.save(transferencia);
  await confirmTransferenciaPersistencia(transferenciaRepo, empresa.id, logger);

  await AppDataSource.manager.transaction(async (manager) => {
    const savedEmpresa = await manager.findOneByOrFail(EmpresaOrmEntity, {
      cuit,
    });
    await manager.findOneByOrFail(TransferenciaOrmEntity, {
      empresaId: savedEmpresa.id,
    });
    logger.debug('[SEED] Confirmada persistencia en base de datos');
  });

  logger.debug('Datos de prueba insertados correctamente');
  await new Promise((res) => setTimeout(res, 3000));
  await AppDataSource.destroy();
  logger.debug('SEED terminado y cerrando conexión...');
}

seed({ logger }).catch((err) => {
  logger.error('[SEED-TEST] Error:', err);
  process.exit(1);
});
