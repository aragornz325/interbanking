import { ListarEmpresasConTransferenciasUltimoMesUseCase } from '../../src/modules/empresa/application/use-cases/listar-transferencias.use-case';
import { Empresa } from '../../src/modules/empresa/domain/empresa.entity';
import { EmpresaRepository } from '../../src/modules/empresa/domain/empresa.repository';
import { Transferencia } from '../../src/modules/empresa/domain/transferencia.entity';
import { errorSpy, loggerSpy } from '../utils/logger-spy';

describe('ListarEmpresasConTransferenciasUltimoMesUseCase', () => {
  let useCase: ListarEmpresasConTransferenciasUltimoMesUseCase;
  let mockRepo: Partial<EmpresaRepository> & {
    listarEmpresasConTransferenciasUltimoMes: jest.Mock;
    listarEmpresasAdheridasUltimoMes: jest.Mock;
    crear: jest.Mock;
  };

  beforeEach(() => {
    mockRepo = {
      crear: jest.fn(),
      listarEmpresasAdheridasUltimoMes: jest.fn(),
      listarEmpresasConTransferenciasUltimoMes: jest.fn(),
    };

    useCase = new ListarEmpresasConTransferenciasUltimoMesUseCase(mockRepo);
    jest.clearAllMocks();
  });

  it('debería devolver empresas con transferencias del último mes calendario', async () => {
    loggerSpy(
      'Ejecutando caso de uso para listar empresas con transferencias',
      'ListarEmpresasConTransferenciasUltimoMesUseCase',
    );

    const now = new Date();
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    const empresa = new Empresa(
      'uuid-123',
      '20304050607',
      'Empresa de prueba transferencia',
      lastMonthDate,
    );

    const transferencia = new Transferencia(
      'tr-1',
      'uuid-123',
      '12345678',
      '87654321',
      1000,
      lastMonthDate,
    );

    const mockResultado = [{ empresa, transferencias: [transferencia] }];

    mockRepo.listarEmpresasConTransferenciasUltimoMes.mockResolvedValue(
      mockResultado,
    );

    const resultado = await useCase.execute();

    loggerSpy(
      `Empresas encontradas: ${resultado.length}`,
      'ListarEmpresasConTransferenciasUltimoMesUseCase',
    );

    expect(resultado).toEqual(mockResultado);
    expect(
      mockRepo.listarEmpresasConTransferenciasUltimoMes,
    ).toHaveBeenCalledTimes(1);

    const transferenciaFecha = resultado[0].transferencias[0].fecha;
    expect(transferenciaFecha.getMonth()).toBe(lastMonthDate.getMonth());
  });

  it('debería retornar un array vacío si no hay transferencias registradas', async () => {
    loggerSpy(
      'No se encontraron empresas con transferencias.',
      'ListarEmpresasConTransferenciasUltimoMesUseCase',
    );

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

    try {
      await useCase.execute();
    } catch (err) {
      errorSpy(
        'Error al ejecutar el caso de uso',
        (err as Error).stack,
        'ListarEmpresasConTransferenciasUltimoMesUseCase',
      );
      expect(err.message).toBe('Fallo en DB');
    }
  });
});
