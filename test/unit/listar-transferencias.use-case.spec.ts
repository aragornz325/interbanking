/* eslint-disable @typescript-eslint/unbound-method */
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from '../../src/application/use-cases/listar-transferencias.use-case';
import { Empresa } from '../../src/core/domain/empresa.entity';
import { Transferencia } from '../../src/core/domain/transferencia.entity';
import { EmpresaRepository } from '../../src/core/domain/empresa.repository';

describe('ListarEmpresasConTransferenciasUltimoMesUseCase', () => {
  let useCase: ListarEmpresasConTransferenciasUltimoMesUseCase;
  let mockRepo: jest.Mocked<EmpresaRepository>;

  beforeEach(() => {
    mockRepo = {
      crear: jest.fn(),
      listarEmpresasAdheridasUltimoMes: jest.fn(),
      listarEmpresasConTransferenciasUltimoMes: jest.fn(),
    };

    useCase = new ListarEmpresasConTransferenciasUltimoMesUseCase(mockRepo);
  });

  it('debería devolver empresas con transferencias del último mes', async () => {
    const empresa = new Empresa(
      'uuid-123',
      '20304050607',
      'Empresa de prueba',
      new Date(),
    );

    const transferencias: Transferencia[] = [
      new Transferencia(
        'tr-1',
        'uuid-123',
        '12345678',
        '87654321',
        1000,
        new Date(),
      ),
    ];

    const mockResultado = [{ empresa, transferencias }];

    mockRepo.listarEmpresasConTransferenciasUltimoMes.mockResolvedValue(
      mockResultado,
    );

    const resultado = await useCase.execute();

    expect(resultado).toEqual(mockResultado);
    expect(
      mockRepo.listarEmpresasConTransferenciasUltimoMes,
    ).toHaveBeenCalled();
  });
});
