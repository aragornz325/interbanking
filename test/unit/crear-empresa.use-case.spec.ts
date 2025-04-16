// Jest setup file to configure the testing environment

// Nest core
import { Logger } from '@nestjs/common';

// Domain / Application
import { CrearEmpresaUseCase } from '../../src/modules/empresa/application/use-cases/crear-empresa.use-case';
import { Empresa } from '../../src/modules/empresa/domain/empresa.entity';
import { DuplicateResourceException } from 'src/shared/exceptions/custom.exceptions';

describe('CrearEmpresaUseCase', () => {
  let useCase: CrearEmpresaUseCase;
  let repo: { crear: jest.Mock };

  const cuit = '20304050607';
  const razonSocial = 'UNSC Spartan Ops';
  const fecha = new Date('2024-01-01');

  const empresaData = Empresa.createWithoutId(cuit, razonSocial, fecha);

  const empresaResult = new Empresa('uuid-1234', cuit, razonSocial, fecha);

  beforeEach(() => {
    repo = {
      crear: jest.fn().mockResolvedValue(empresaResult),
    };
    useCase = new CrearEmpresaUseCase(repo as any);
  });

  it('debe crear una empresa correctamente', async () => {
    const logSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {});

    const result = await useCase.execute(cuit, razonSocial);

    expect(result).toEqual(empresaResult);
    expect(repo.crear).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('crearEmpresa'),
    );

    logSpy.mockRestore();
  });

  it('debe manejar errores lanzados por el repositorio', async () => {
    const mockError = new Error('DB fail');
    repo.crear.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(cuit, razonSocial)).rejects.toThrow('DB fail');
  });

  it('debe rechazar CUITs duplicados (mockeando lógica)', async () => {
    const duplicadoError = new DuplicateResourceException(
      'Empresa ya registrada',
    );

    repo.crear.mockRejectedValueOnce(duplicadoError);

    try {
      await useCase.execute(cuit, razonSocial);
    } catch (err) {
      expect(err).toBeInstanceOf(DuplicateResourceException);
      expect((err as Error).message).toBe('Empresa ya registrada');
    }
  });

  it('debe hacer snapshot del resultado', async () => {
    const result = await useCase.execute(cuit, razonSocial);
    expect(result).toMatchSnapshot();
  });
});
