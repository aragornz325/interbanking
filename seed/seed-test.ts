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
  console.log('[SEED-TEST] Conectado a la base de datos');

  const empresaRepo = AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = AppDataSource.getRepository(TransferenciaOrmEntity);

  // 🔥 Limpieza total para evitar duplicados
  await transferenciaRepo.delete({});
  await empresaRepo.delete({});

  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  // ✅ Empresa adherida el mes pasado
  const empresa = empresaRepo.create({
    cuit: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
    razonSocial: 'Empresa Test',
    fechaAdhesion: new Date(
      Date.UTC(
        lastMonthStart.getUTCFullYear(),
        lastMonthStart.getUTCMonth(),
        4, // día 4 del mes anterior
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
        4, // día 4 del mes anterior
        12,
        0,
        0,
      ),
    ),
  });

  await transferenciaRepo.save(transferencia);

  console.log('[SEED-TEST] Datos de prueba insertados correctamente');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('[SEED-TEST] Error:', err);
  process.exit(1);
});
