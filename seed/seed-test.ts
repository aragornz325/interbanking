import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { EmpresaOrmEntity } from '../src/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from '../src/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { subMonths, startOfMonth } from 'date-fns';

config({ path: '.test.env' });

const testDataSource = new DataSource({
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

async function seedTestData() {
  await testDataSource.initialize();

  const empresaRepo = testDataSource.getRepository(EmpresaOrmEntity);
  const transferenciaRepo = testDataSource.getRepository(
    TransferenciaOrmEntity,
  );

  await transferenciaRepo.delete({});
  await empresaRepo.delete({});

  const empresa = empresaRepo.create({
    id: '00000000-0000-0000-0000-000000000001',
    cuit: '20111111111',
    razonSocial: 'Empresa Test',
    fechaAdhesion: new Date('2024-03-15T00:00:00Z'),
  });

  await empresaRepo.save(empresa);
  const fechaValidaDinamica = new Date(
    startOfMonth(subMonths(new Date(), 1)).getTime() + 5 * 24 * 60 * 60 * 1000,
  );

  const transferencia = transferenciaRepo.create({
    id: '00000000-0000-0000-0000-000000000100',
    empresa,
    empresaId: empresa.id,
    importe: 5000.5,
    cuentaDebito: '12345678',
    cuentaCredito: '87654321',
    fecha: fechaValidaDinamica,
  });

  await transferenciaRepo.save(transferencia);

  console.log('[SEED-TEST] Datos de prueba insertados');
  await testDataSource.destroy();
}

seedTestData().catch((err) => {
  console.error('[SEED-TEST] Error:', err);
  process.exit(1);
});
