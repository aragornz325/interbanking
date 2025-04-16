import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

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

  afterEach(async () => {
    await db.query(`DELETE FROM transferencias;`);
    await db.query(`DELETE FROM empresas;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería retornar empresas adheridas el último mes', async () => {
    await db.query(`
      INSERT INTO empresas (id, cuit, razon_social, fecha_adhesion)
      VALUES ('00000000-0000-0000-0000-000000000002', '20112223334', 'Empresa Test Adhesión', NOW() - INTERVAL '1 month');
    `);

    const res = await request(app.getHttpServer()).get('/empresas/adhesion');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    for (const empresa of res.body) {
      expect(empresa).toHaveProperty('id');
      expect(empresa).toHaveProperty('cuit');
      expect(empresa).toHaveProperty('razonSocial');
      expect(empresa).toHaveProperty('fechaAdhesion');
    }
  });
});
