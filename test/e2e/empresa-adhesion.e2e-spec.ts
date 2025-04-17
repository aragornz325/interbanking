import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';

import { EmpresaSchema } from './schemas/empresa-adhesion.schema';

const logger = new Logger('Test empresa - Adhesion');
describe('GET /empresas/adhesion (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new (await import('@nestjs/common')).ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    db = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería retornar empresas adheridas en el último mes', async () => {
    logger.debug(' Consultando /empresas/adhesion...');

    const res = await request(app.getHttpServer()).get('/empresas/adhesion');

    const result = EmpresaSchema.array().safeParse(res.body);

    if (!result.success)
      throw new Error(JSON.stringify(result.error.format(), null, 2));

    const empresas = result.data.map((e) => e.razonSocial);

    expect(empresas).toContain('Acme Corp');
    expect(empresas).toContain('Wayne Enterprises');
    expect(empresas).not.toContain('Umbrella Inc');

    for (const empresa of res.body) {
      expect(empresa).toHaveProperty('id');
      expect(empresa).toHaveProperty('cuit');
      expect(empresa).toHaveProperty('razonSocial');
      expect(empresa).toHaveProperty('fechaAdhesion');
    }
  });
});
