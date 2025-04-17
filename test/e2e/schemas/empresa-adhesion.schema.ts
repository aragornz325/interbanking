import { z } from 'zod';

export const EmpresaSchema = z.object({
  id: z.string(),
  cuit: z.string(),
  razonSocial: z.string(),
  fechaAdhesion: z.string(),
});
