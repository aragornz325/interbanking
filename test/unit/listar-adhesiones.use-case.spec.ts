import { ListarEmpresasAdheridasUltimoMesUseCase } from '../../src/modules/empresa/application/use-cases/listar-adhesiones.use-case';
import { Empresa } from '../../src/modules/empresa/domain/empresa.entity';
import { errorSpy } from '../utils/logger-spy';

describe('ListarEmpresasAdheridasUltimoMesUseCase', () => {
  let useCase: ListarEmpresasAdheridasUltimoMesUseCase;
  let empresaRepository: {
    crear: jest.Mock;
    listarEmpresasAdheridasUltimoMes: jest.Mock;
    listarEmpresasConTransferenciasUltimoMes: jest.Mock;
  };

  beforeEach(() => {
    empresaRepository = {
      crear: jest.fn(),
      listarEmpresasAdheridasUltimoMes: jest.fn(),
      listarEmpresasConTransferenciasUltimoMes: jest.fn(),
    };

    useCase = new ListarEmpresasAdheridasUltimoMesUseCase(empresaRepository);
    jest.clearAllMocks();
  });

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  it('debería retornar una lista de empresas adheridas el último mes', async () => {
    const mockEmpresas: Empresa[] = [
      new Empresa('1', '20123456789', 'Empresa Uno', lastMonth),
      new Empresa('2', '20987654321', 'Empresa Dos', lastMonth),
    ];

    empresaRepository.listarEmpresasAdheridasUltimoMes.mockResolvedValue(
      mockEmpresas,
    );

    const result = await useCase.execute();

    expect(
      empresaRepository.listarEmpresasAdheridasUltimoMes,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockEmpresas);
  });

  it('debería retornar un array vacío si no hay empresas adheridas', async () => {
    empresaRepository.listarEmpresasAdheridasUltimoMes.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(
      empresaRepository.listarEmpresasAdheridasUltimoMes,
    ).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar ErrorManager si el repositorio falla', async () => {
    const mockError = new Error('DB error');
    empresaRepository.listarEmpresasAdheridasUltimoMes.mockRejectedValueOnce(
      mockError,
    );

    try {
      await useCase.execute();
    } catch (err) {
      errorSpy(
        'Error al listar empresas adheridas',
        (err as Error).stack,
        'ListarEmpresasAdheridasUltimoMesUseCase',
      );
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('DB error');
    }
  });
});
