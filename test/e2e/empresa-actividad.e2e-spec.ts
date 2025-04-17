import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { z } from 'zod';

const EmpresaActividadSchema = z.array(
  z.object({
    empresa: z.object({
      id: z.string(),
      cuit: z.string(),
      razonSocial: z.string(),
      fechaAdhesion: z.string(),
    }),
    transferencias: z.array(
      z.object({
        id: z.string(),
        empresaId: z.string(),
        cuentaDebito: z.string(),
        cuentaCredito: z.string(),
        importe: z.number(),
        fecha: z.string(),
      }),
    ),
  }),
);

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

  it('debería devolver empresas con transferencias en el último mes', async () => {
    console.log('[TEST] Consultando /empresas/actividad...');
    const res = await request(app.getHttpServer()).get('/empresas/actividad');

    expect(res.status).toBe(200);

    const data = EmpresaActividadSchema.parse(res.body);
    const empresas = data.map((e) => e.empresa.razonSocial);

    expect(empresas).toContain('Acme Corp');
    expect(empresas).toContain('Wayne Enterprises');
    expect(empresas).not.toContain('Umbrella Inc');

    for (const item of res.body) {
      expect(item).toHaveProperty('empresa');
      expect(item).toHaveProperty('transferencias');
      expect(item.transferencias.length).toBeGreaterThan(0);

      expect(item.empresa).toHaveProperty('id');
      expect(item.empresa).toHaveProperty('cuit');
      expect(item.empresa).toHaveProperty('razonSocial');
      expect(item.empresa).toHaveProperty('fechaAdhesion');

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
