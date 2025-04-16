/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('GET /empresas/actividad (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('debería devolver al menos una empresa con transferencia reciente', async () => {
    const res = await request(app.getHttpServer()).get('/empresas/actividad');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          empresa: expect.objectContaining({
            cuit: '20111111111',
            razonSocial: 'Empresa Test',
          }),
          transferencias: expect.any(Array),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
