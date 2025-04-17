import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { startOfMonth, subMonths } from 'date-fns';
import { config } from 'dotenv';
import path from 'path';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { checkClean } from './utils/check-clean.util';
import { waitForDb } from './utils/wait-for-db.util';

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

/**
 * Ejecuta el seed de datos de prueba para entorno de testing.
 * Incluye una empresa adherida el mes pasado y una transferencia reciente.
 */
async function seed({ logger }: { logger: Logger }): Promise<void> {
  await AppDataSource.initialize();
  await waitForDb({
    logger: logger,
    dataSource: AppDataSource,
  });
  logger.debug('Conectado a la base de datos');

  await AppDataSource.query(
    'TRUNCATE TABLE transferencias RESTART IDENTITY CASCADE',
  );
  await AppDataSource.query('TRUNCATE TABLE empresas RESTART IDENTITY CASCADE');

  const empresaRepo = AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = AppDataSource.getRepository(TransferenciaOrmEntity);

  await checkClean({
    empresaRepo,
    transferenciaRepo,
    logger,
  });

  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));

  const empresa = empresaRepo.create({
    cuit: faker.string.uuid().replace(/-/g, '').slice(0, 11),
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

  await transferenciaRepo.save(transferencia);

  logger.debug('Datos de prueba insertados correctamente');

  // Espera para asegurar que PostgreSQL haya finalizado el write
  await new Promise((res) => setTimeout(res, 1000));

  await AppDataSource.destroy();
}

seed({
  logger: logger,
}).catch((err) => {
  logger.error('[SEED-TEST] Error:', err);
  process.exit(1);
});
