import { faker } from '@faker-js/faker/locale/es';
import { set, subMonths } from 'date-fns';
import {
  EmpresaOrmEntity,
  TransferenciaOrmEntity,
} from 'src/modules/empresa/infrastructure/persistence';

const now = new Date();
const lastMonth = subMonths(now, 1);

export const empresasData: EmpresaOrmEntity[] = [
  {
    id: faker.string.uuid(),
    razonSocial: 'Acme Corp',
    cuit: '30-12345678-9',
    fechaAdhesion: set(new Date(), { year: 2025, month: 2, date: 15 }),
  },
  {
    id: faker.string.uuid(),
    razonSocial: 'Umbrella Inc',
    cuit: '30-87654321-0',
    fechaAdhesion: set(new Date(), { year: 2025, month: 1, date: 28 }),
  },
  {
    id: faker.string.uuid(),
    razonSocial: 'Wayne Enterprises',
    cuit: '30-11112222-3',
    fechaAdhesion: lastMonth,
  },
];

export const TRANSFERENCIAS: TransferenciaOrmEntity[] = [
  {
    id: faker.string.uuid(),
    empresa: empresasData[0],
    cuentaDebito: '1234567890',
    cuentaCredito: '0987654321',
    importe: 10000,
    empresaId: empresasData[0].id,
    fecha: set(new Date(), { year: 2025, month: 2, date: 15 }),
  },
  {
    id: faker.string.uuid(),
    empresa: empresasData[1],
    cuentaDebito: '2345678901',
    cuentaCredito: '1098765432',
    importe: 5000,
    empresaId: empresasData[1].id,
    fecha: set(new Date(), { year: 2025, month: 1, date: 28 }),
  },
  {
    id: faker.string.uuid(),
    empresa: empresasData[2],
    cuentaDebito: '3456789012',
    cuentaCredito: '2109876543',
    importe: 8000,
    empresaId: empresasData[2].id,
    fecha: lastMonth,
  },
];
