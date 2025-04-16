/* eslint-disable @typescript-eslint/unbound-method */
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from '../../src/modules/empresa/application/use-cases/listar-transferencias.use-case';
import { Empresa } from '../../src/modules/empresa/domain/empresa.entity';
import { Transferencia } from '../../src/modules/empresa/domain/transferencia.entity';
import { EmpresaRepository } from '../../src/modules/empresa/domain/empresa.repository';
import { Logger } from '@nestjs/common';

describe('ListarEmpresasConTransferenciasUltimoMesUseCase', () => {
  let useCase: ListarEmpresasConTransferenciasUltimoMesUseCase;
  let mockRepo: jest.Mocked<EmpresaRepository>;

  const loggerSpy = jest
    .spyOn(Logger.prototype, 'log')
    .mockImplementation(() => {});
  const errorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    mockRepo = {
      crear: jest.fn(),
      listarEmpresasAdheridasUltimoMes: jest.fn(),
      listarEmpresasConTransferenciasUltimoMes: jest.fn(),
    };

    useCase = new ListarEmpresasConTransferenciasUltimoMesUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    ).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('listar empresas con transferencias'),
    );
  });

  it('debería retornar un array vacío si no hay transferencias registradas', async () => {
    mockRepo.listarEmpresasConTransferenciasUltimoMes.mockResolvedValue([]);

    const resultado = await useCase.execute();

    expect(resultado).toEqual([]);
    expect(
      mockRepo.listarEmpresasConTransferenciasUltimoMes,
    ).toHaveBeenCalledTimes(1);
  });

  it('debería manejar errores lanzados por el repositorio', async () => {
    const error = new Error('Fallo en DB');
    mockRepo.listarEmpresasConTransferenciasUltimoMes.mockRejectedValueOnce(
      error,
    );

    await expect(useCase.execute()).rejects.toThrow('Fallo en DB');
    expect(errorSpy).toHaveBeenCalled();
  });
});
