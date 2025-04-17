import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

import { errorSpy, loggerSpy } from '../utils/logger-spy';
import { EmpresaActividadSchema } from './schemas/empresa-actividad.schema';

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
    loggerSpy('Consultando /empresas/actividad...', 'GET /empresas/actividad');

    const res = await request(app.getHttpServer()).get('/empresas/actividad');

    expect(res.status).toBe(200);
    loggerSpy('Respuesta recibida correctamente.', 'GET /empresas/actividad');

    const data = EmpresaActividadSchema.parse(res.body);
    const empresas = data.map((e) => e.empresa.razonSocial);

    loggerSpy(
      `Empresas encontradas: ${empresas.join(', ')}`,
      'GET /empresas/actividad',
    );

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

    loggerSpy('Validaciones finalizadas con éxito.', 'GET /empresas/actividad');
  });

  it('debería manejar errores si la ruta falla', async () => {
    loggerSpy('Consultando /ruta-inexistente...', 'GET /empresas/actividad');

    const res = await request(app.getHttpServer()).get('/ruta-inexistente');

    if (res.status !== 404) {
      errorSpy(
        'La ruta debería haber fallado con 404, pero devolvió otro código',
        undefined,
        'GET /empresas/actividad',
      );
    }

    expect(res.status).toBe(404);
    loggerSpy(
      'Error correctamente detectado: ruta no encontrada',
      'GET /empresas/actividad',
    );
  });

  afterAll(async () => {
    await app.close();
    loggerSpy(
      'Aplicación cerrada después de los tests.',
      'GET /empresas/actividad',
    );
  });
});
