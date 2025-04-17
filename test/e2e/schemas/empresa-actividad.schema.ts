import { z } from 'zod';

export const EmpresaActividadSchema = z.array(
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
