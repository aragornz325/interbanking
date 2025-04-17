/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';

describe('POST /empresas (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;

  const TEST_CUIT = '20999999999';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    db = moduleFixture.get(DataSource);
  });

  beforeEach(async () => {
    await db.query(
      `DELETE FROM transferencias WHERE empresa_id IN (SELECT id FROM empresas WHERE cuit = '20999999999');`,
    );
    await db.query(`DELETE FROM empresas WHERE cuit = '20999999999';`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería crear una empresa y devolver su estructura', async () => {
    const res = await request(app.getHttpServer()).post('/empresas').send({
      cuit: TEST_CUIT,
      razonSocial: 'Empresa E2E',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      cuit: TEST_CUIT,
      razonSocial: 'Empresa E2E',
      fechaAdhesion: expect.any(String),
    });
  });

  it('debería rechazar un CUIT duplicado', async () => {
    const payload = {
      cuit: TEST_CUIT,
      razonSocial: 'Empresa E2E',
    };

    await request(app.getHttpServer()).post('/empresas').send(payload);

    const res = await request(app.getHttpServer())
      .post('/empresas')
      .send(payload);

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/ya existe|conflicto|duplicado/i);
  });

  it('debería rechazar un payload inválido', async () => {
    const res = await request(app.getHttpServer())
      .post('/empresas')
      .send({ cuit: '', razonSocial: '' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.message).toBeDefined();
  });

  it('debería rechazar un CUIT malformado', async () => {
    const res = await request(app.getHttpServer())
      .post('/empresas')
      .send({ cuit: 'abc123', razonSocial: 'Mal CUIT' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(Array.isArray(res.body.message)).toBe(true);
    expect(res.body.message).toContainEqual(expect.stringMatching(/cuit/i));
  });
});
