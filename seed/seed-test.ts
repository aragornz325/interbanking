import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EmpresaOrmEntity } from '../src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from '../src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { faker } from '@faker-js/faker';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import path from 'path';

if (!process.env.CI) {
  config({ path: path.resolve(__dirname, '../.test.env') });
}

async function waitForDb() {
  let retries = 5;
  while (retries) {
    try {
      await AppDataSource.query('SELECT 1');
      return;
    } catch (err) {
      console.log('[SEED] Esperando base de datos...');
      await new Promise((res) => setTimeout(res, 2000));
      retries--;
    }
  }
  throw new Error('No se pudo conectar a la base de datos');
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

async function seed() {
  await AppDataSource.initialize();
  await waitForDb();
  console.log('[SEED-TEST] Conectado a la base de datos');

  // 🔥 Limpieza total usando TRUNCATE con RESTART IDENTITY y CASCADE
  await AppDataSource.query(
    'TRUNCATE TABLE transferencias RESTART IDENTITY CASCADE',
  );
  await AppDataSource.query('TRUNCATE TABLE empresas RESTART IDENTITY CASCADE');

  const empresaRepo = AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = AppDataSource.getRepository(TransferenciaOrmEntity);
  const checkClean = async () => {
    for (let i = 0; i < 5; i++) {
      const countEmp = await empresaRepo.count();
      const countTransf = await transferenciaRepo.count();
      if (countEmp === 0 && countTransf === 0) return;
      console.log('[SEED] Esperando limpieza efectiva de tablas...');
      await new Promise((res) => setTimeout(res, 1000));
    }
    throw new Error('[SEED] Las tablas no están vacías después del TRUNCATE');
  };

  await checkClean();

  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));

  // ✅ Empresa adherida el mes pasado con CUIT único
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

  // ✅ Transferencia con fecha válida
  const transferencia = transferenciaRepo.create({
    empresa,
    empresaId: empresa.id,
    cuentaDebito: faker.finance.accountNumber(),
    cuentaCredito: faker.finance.accountNumber(),
    importe: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
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

  console.log('[SEED-TEST] Datos de prueba insertados correctamente');

  // 💤 Sleep preventivo para que PostgreSQL termine de procesar todo
await new Promise((res) => setTimeout(res, 1000));

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('[SEED-TEST] Error:', err);
  process.exit(1);
});
