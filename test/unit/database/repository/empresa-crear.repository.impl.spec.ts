/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Empresa } from 'src/modules/empresa/domain/empresa.entity';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { EmpresaRepositoryImpl } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.repository.impl';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { DataSource, Repository } from 'typeorm';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    DataSource: jest.fn(),
  };
});

describe('EmpresaRepositoryImpl - crear()', () => {
  let repo: EmpresaRepositoryImpl;
  let empresaRepoMock: jest.Mocked<Repository<EmpresaOrmEntity>>;

  beforeEach(() => {
    empresaRepoMock = {
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<EmpresaOrmEntity>>;

    const transferenciaRepoMock = {} as jest.Mocked<
      Repository<TransferenciaOrmEntity>
    >;
    const mockDataSource = {} as DataSource;

    repo = new EmpresaRepositoryImpl(
      empresaRepoMock,
      transferenciaRepoMock,
      mockDataSource,
    );
  });

  it('debe crear y retornar una empresa con ID', async () => {
    const fecha = new Date('2024-01-01');
    const inputEmpresa = Empresa.createWithoutId(
      '20304050607',
      'UNSC Spartan Ops',
      fecha,
    );

    const savedEntity = {
      id: 'uuid-1234',
      cuit: inputEmpresa.cuit,
      razonSocial: inputEmpresa.razonSocial,
      fechaAdhesion: inputEmpresa.fechaAdhesion,
    };

    empresaRepoMock.save.mockResolvedValueOnce(savedEntity);

    const result = await repo.crear(inputEmpresa);

    expect(empresaRepoMock.save).toHaveBeenCalledWith(inputEmpresa);
    expect(result).toEqual(
      new Empresa(
        savedEntity.id,
        savedEntity.cuit,
        savedEntity.razonSocial,
        savedEntity.fechaAdhesion,
      ),
    );
  });
});
