/* eslint-disable @typescript-eslint/unbound-method */
import { ListarEmpresasAdheridasUltimoMesUseCase } from '../../src/application/use-cases/listar-adhesiones.use-case';
import { Empresa } from '../../src/core/domain/empresa.entity';
import { EmpresaRepository } from '../../src/core/domain/empresa.repository';
import { Logger } from '@nestjs/common';

describe('ListarEmpresasAdheridasUltimoMesUseCase', () => {
  let useCase: ListarEmpresasAdheridasUltimoMesUseCase;
  let empresaRepository: jest.Mocked<EmpresaRepository>;

  const loggerSpy = jest
    .spyOn(Logger.prototype, 'log')
    .mockImplementation(() => {});
  const errorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    empresaRepository = {
      crear: jest.fn(),
      listarEmpresasAdheridasUltimoMes: jest.fn(),
      listarEmpresasConTransferenciasUltimoMes: jest.fn(),
    };

    useCase = new ListarEmpresasAdheridasUltimoMesUseCase(empresaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar una lista de empresas adheridas el último mes', async () => {
    const mockEmpresas: Empresa[] = [
      new Empresa('1', '20123456789', 'Empresa Uno', new Date()),
      new Empresa('2', '20987654321', 'Empresa Dos', new Date()),
    ];

    empresaRepository.listarEmpresasAdheridasUltimoMes.mockResolvedValue(
      mockEmpresas,
    );

    const result = await useCase.execute();

    expect(
      empresaRepository.listarEmpresasAdheridasUltimoMes,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockEmpresas);
    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('listarEmpresasAdheridasUltimoMes'),
    );
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

    await expect(useCase.execute()).rejects.toThrow(Error);
    expect(errorSpy).toHaveBeenCalled();
  });
});
