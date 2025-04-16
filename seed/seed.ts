import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EmpresaOrmEntity } from '../src/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from '../src/infrastructure/persistence/typeorm/transferencia.orm-entity';

const envArg = process.argv[2] || 'dev';
const envFile = `.${envArg}.env`;

config({ path: envFile });

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
  console.log(`[SEED] Conectado a la base de datos (${envArg})`);

  const empresaRepo = AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = AppDataSource.getRepository(TransferenciaOrmEntity);

  const totalEmpresas = await empresaRepo.count();
  const totalTransferencias = await transferenciaRepo.count();

  if (totalEmpresas > 0 || totalTransferencias > 0) {
    console.log(
      '[SEED] Datos ya existentes. No se insertarán nuevos registros.',
    );
    await AppDataSource.destroy();
    return;
  }

  const empresas = Array.from({ length: 5 }).map(() =>
    empresaRepo.create({
      cuit: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      razonSocial: faker.company.name(),
      fechaAdhesion: faker.date.recent({ days: 25 }),
    }),
  );
  await empresaRepo.save(empresas);
  console.log(`[SEED] Insertadas ${empresas.length} empresas`);

  const transferencias = Array.from({ length: 10 }).map(() => {
    const empresa = faker.helpers.arrayElement(empresas);
    return transferenciaRepo.create({
      cuentaDebito: faker.finance.accountNumber(),
      cuentaCredito: faker.finance.accountNumber(),
      importe: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
      fecha: faker.date.recent({ days: 20 }),
      empresa,
      empresaId: empresa.id,
    });
  });

  await transferenciaRepo.save(transferencias);
  console.log(`[SEED] Insertadas ${transferencias.length} transferencias`);

  await AppDataSource.destroy();
  console.log('[SEED] Completado y conexión cerrada');
}

seed().catch((err) => {
  console.error('[SEED] Error:', err);
  process.exit(1);
});
