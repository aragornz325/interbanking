/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Empresa } from 'src/modules/empresa/domain/empresa.entity';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { EmpresaRepositoryImpl } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.repository.impl';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { DataSource, Repository } from 'typeorm';

describe('EmpresaRepositoryImpl - listarEmpresasAdheridasUltimoMes()', () => {
  let repo: EmpresaRepositoryImpl;
  let empresaRepoMock: jest.Mocked<Repository<EmpresaOrmEntity>>;

  beforeEach(() => {
    empresaRepoMock = {
      find: jest.fn(),
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

  it('debe devolver empresas adheridas el último mes', async () => {
    const mockFecha = new Date('2024-03-15');

    const rawEmpresas: EmpresaOrmEntity[] = [
      {
        id: 'emp-1',
        cuit: '20304050607',
        razonSocial: 'Spartan Corp',
        fechaAdhesion: mockFecha,
      },
    ];

    empresaRepoMock.find.mockResolvedValueOnce(rawEmpresas);

    const result = await repo.listarEmpresasAdheridasUltimoMes();

    expect(empresaRepoMock.find).toHaveBeenCalledWith({
      where: {
        fechaAdhesion: expect.any(Object), // Between(...) no se puede comparar directamente
      },
    });

    expect(result).toEqual([
      new Empresa('emp-1', '20304050607', 'Spartan Corp', mockFecha),
    ]);
  });
});
