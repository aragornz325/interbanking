import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const envArg = process.argv[2] || 'dev';
const envFile = `.${envArg}.env`;

config({ path: envFile });

const logger = new Logger('Seed');
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

async function seed({ logger }: { logger: Logger }) {
  await AppDataSource.initialize();
  logger.debug(`Conectado a la base de datos (${envArg})`);

  const empresaRepo = AppDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = AppDataSource.getRepository(TransferenciaOrmEntity);

  const totalEmpresas = await empresaRepo.count();
  const totalTransferencias = await transferenciaRepo.count();

  if (totalEmpresas > 9 || totalTransferencias > 12) {
    logger.debug('Datos ya existentes. No se insertarán nuevos registros.');
    await AppDataSource.destroy();
    return;
  }

  const empresas = Array.from({ length: 15 }).map(() =>
    empresaRepo.create({
      cuit: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      razonSocial: faker.company.name(),
      fechaAdhesion: faker.date.recent({ days: 60 }),
    }),
  );
  await empresaRepo.save(empresas);
  logger.debug(` Insertadas ${empresas.length} empresas`);

  const transferencias = Array.from({ length: 20 }).map(() => {
    const empresa = faker.helpers.arrayElement(empresas);
    return transferenciaRepo.create({
      cuentaDebito: faker.finance.accountNumber(),
      cuentaCredito: faker.finance.accountNumber(),
      importe: faker.number.float({
        min: 1000,
        max: 10000,
        fractionDigits: 2,
      }),
      fecha: faker.date.recent({ days: 60 }),
      empresa,
      empresaId: empresa.id,
    });
  });

  await transferenciaRepo.save(transferencias);
  logger.debug(` Insertadas ${transferencias.length} transferencias`);

  await AppDataSource.destroy();
  logger.debug(' Completado y conexión cerrada');
}

seed({
  logger: logger,
}).catch((err) => {
  logger.error(' Error:', err);
  process.exit(1);
});
