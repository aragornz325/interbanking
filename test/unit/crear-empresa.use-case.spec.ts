import { DuplicateResourceException } from 'src/shared/exceptions/custom.exceptions';

import { CrearEmpresaUseCase } from '../../src/modules/empresa/application/use-cases/crear-empresa.use-case';
import { Empresa } from '../../src/modules/empresa/domain/empresa.entity';
import { errorSpy } from '../utils/logger-spy';

describe('CrearEmpresaUseCase', () => {
  let useCase: CrearEmpresaUseCase;
  let repo: { crear: jest.Mock };

  const CONTEXT = 'CrearEmpresaUseCase';
  const cuit = '20304050607';
  const razonSocial = 'UNSC Spartan Ops';
  const fecha = new Date('2024-01-01');

  const empresaResult = new Empresa('uuid-1234', cuit, razonSocial, fecha);

  beforeEach(() => {
    repo = {
      crear: jest.fn().mockResolvedValue(empresaResult),
    };
    useCase = new CrearEmpresaUseCase(repo as any);
    jest.clearAllMocks();
  });

  it('debe crear una empresa correctamente', async () => {
    const result = await useCase.execute(cuit, razonSocial);
    expect(result).toEqual(empresaResult);
    expect(repo.crear).toHaveBeenCalled();
  });

  it('debe manejar errores lanzados por el repositorio', async () => {
    const mockError = new Error('DB fail');
    repo.crear.mockRejectedValueOnce(mockError);

    try {
      await useCase.execute(cuit, razonSocial);
    } catch (err) {
      errorSpy(
        'Error lanzado por el repositorio',
        (err as Error).stack,
        CONTEXT,
      );
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('DB fail');
    }
  });

  it('debe rechazar CUITs duplicados (mockeando lógica)', async () => {
    const duplicadoError = new DuplicateResourceException(
      'Empresa ya registrada',
    );
    repo.crear.mockRejectedValueOnce(duplicadoError);

    try {
      await useCase.execute(cuit, razonSocial);
    } catch (err) {
      errorSpy('CUIT duplicado detectado', (err as Error).stack, CONTEXT);
      expect(err).toBeInstanceOf(DuplicateResourceException);
      expect((err as Error).message).toBe('Empresa ya registrada');
    }
  });

  it('debe hacer snapshot del resultado', async () => {
    const result = await useCase.execute(cuit, razonSocial);
    expect(result).toMatchSnapshot();
  });
});
