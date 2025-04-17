import { Empresa } from 'src/modules/empresa/domain/empresa.entity';
import { Transferencia } from 'src/modules/empresa/domain/transferencia.entity';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { EmpresaRepositoryImpl } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.repository.impl';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { DataSource, Repository } from 'typeorm';

describe('EmpresaRepositoryImpl - listarEmpresasConTransferenciasUltimoMes()', () => {
  let repo: EmpresaRepositoryImpl;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    const empresaRepoMock = {} as jest.Mocked<Repository<EmpresaOrmEntity>>;
    const transferenciaRepoMock = {} as jest.Mocked<
      Repository<TransferenciaOrmEntity>
    >;

    mockDataSource = {
      query: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    repo = new EmpresaRepositoryImpl(
      empresaRepoMock,
      transferenciaRepoMock,
      mockDataSource,
    );
  });

  it('debe mapear empresas con transferencias correctamente', async () => {
    const fecha = new Date('2024-03-01');

    const rawRow = [
      {
        empresa_id: 'uuid-empresa-1',
        cuit: '20304050607',
        razon_social: 'Spartan Corp',
        fecha_adhesion: fecha.toISOString(),
        transferencias: [
          {
            id: 'tr1',
            cuentaDebito: '111',
            cuentaCredito: '222',
            importe: 500,
            fecha: fecha.toISOString(),
          },
        ],
      },
    ];

    mockDataSource.query.mockResolvedValueOnce(rawRow);

    const result = await repo.listarEmpresasConTransferenciasUltimoMes();

    expect(mockDataSource.query).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].empresa).toEqual(
      new Empresa(
        'uuid-empresa-1',
        '20304050607',
        'Spartan Corp',
        new Date(rawRow[0].fecha_adhesion),
      ),
    );
    expect(result[0].transferencias[0]).toEqual(
      new Transferencia(
        'tr1',
        'uuid-empresa-1',
        '111',
        '222',
        500,
        new Date(rawRow[0].transferencias[0].fecha),
      ),
    );
  });
});
