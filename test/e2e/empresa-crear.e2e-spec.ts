/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

describe('POST /empresas (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  it('debería crear una empresa y devolver su estructura', async () => {
    const res = await request(app.getHttpServer()).post('/empresas').send({
      cuit: '20999999999',
      razonSocial: 'Empresa E2E',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      cuit: '20999999999',
      razonSocial: 'Empresa E2E',
      fechaAdhesion: expect.any(String),
    });
  });

  it('debería rechazar un CUIT duplicado', async () => {
    const payload = {
      cuit: '20999999999',
      razonSocial: 'Empresa E2E',
    };

    await request(app.getHttpServer()).post('/empresas').send(payload);

    const res = await request(app.getHttpServer())
      .post('/empresas')
      .send(payload);

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/ya existe/i);
  });
});
