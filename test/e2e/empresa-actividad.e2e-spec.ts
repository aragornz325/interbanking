import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

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
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    for (const item of res.body) {
      expect(item).toHaveProperty('empresa');
      expect(item).toHaveProperty('transferencias');

      expect(item.empresa).toHaveProperty('id');
      expect(item.empresa).toHaveProperty('cuit');
      expect(item.empresa).toHaveProperty('razonSocial');
      expect(item.empresa).toHaveProperty('fechaAdhesion');

      expect(Array.isArray(item.transferencias)).toBe(true);

      for (const t of item.transferencias) {
        expect(t).toHaveProperty('id');
        expect(t).toHaveProperty('empresaId');
        expect(t).toHaveProperty('cuentaDebito');
        expect(t).toHaveProperty('cuentaCredito');
        expect(t).toHaveProperty('importe');
        expect(t).toHaveProperty('fecha');
      }
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
