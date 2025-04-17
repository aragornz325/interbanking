import { faker } from '@faker-js/faker/locale/es';
import { Logger } from '@nestjs/common';
import { set, subMonths } from 'date-fns';
import { config } from 'dotenv';
import * as path from 'path';
import {
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
} from 'src/modules/empresa/infrastructure/persistence/index';
import { DataSource, Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export async function seedTestData() {
  const logger = new Logger('SeedTestData');
  logger.log('Iniciando seed de datos de prueba...');

  if (!process.env.CI) {
    config({ path: path.resolve(__dirname, '../.test.env') });
  }

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
  await AppDataSource.initialize();
  logger.debug('Conectado a la DB');

  const empresaRepo: Repository<EmpresaOrmEntity> =
    AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo: Repository<TransferenciaOrmEntity> =
    AppDataSource.getRepository(TransferenciaOrmEntity);

  logger.debug('Limpiando datos...');
  await transferenciaRepo.delete({});
  await empresaRepo.delete({});

  const now = new Date();
  const lastMonth = subMonths(now, 1);

  const EMPRESAS: EmpresaOrmEntity[] = [
    {
      id: faker.string.uuid(),
      razonSocial: 'Acme Corp',
      cuit: '30-12345678-9',
      fechaAdhesion: set(new Date(), { year: 2025, month: 2, date: 15 }),
    },
    {
      id: faker.string.uuid(),
      razonSocial: 'Umbrella Inc',
      cuit: '30-87654321-0',
      fechaAdhesion: set(new Date(), { year: 2025, month: 1, date: 28 }),
    },
    {
      id: faker.string.uuid(),
      razonSocial: 'Wayne Enterprises',
      cuit: '30-11112222-3',
      fechaAdhesion: lastMonth,
    },
  ];

  const empresas = await empresaRepo.save(EMPRESAS);

  const TRANSFERENCIAS: TransferenciaOrmEntity[] = [
    {
      id: faker.string.uuid(),
      empresa: empresas[0],
      cuentaDebito: '1234567890',
      cuentaCredito: '0987654321',
      importe: 10000,
      empresaId: empresas[0].id,
      fecha: set(new Date(), { year: 2025, month: 2, date: 15 }),
    },
    {
      id: faker.string.uuid(),
      empresa: empresas[1],
      cuentaDebito: '2345678901',
      cuentaCredito: '1098765432',
      importe: 5000,
      empresaId: empresas[1].id,
      fecha: set(new Date(), { year: 2025, month: 1, date: 28 }),
    },
    {
      id: faker.string.uuid(),
      empresa: empresas[2],
      cuentaDebito: '3456789012',
      cuentaCredito: '2109876543',
      importe: 8000,
      empresaId: empresas[2].id,
      fecha: lastMonth,
    },
  ];

  await transferenciaRepo.save(
    TRANSFERENCIAS.map((t) => ({
      ...t,
    })),
  );

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
