/* eslint-disable @typescript-eslint/unbound-method */
import { CrearEmpresaUseCase } from '../../src/application/use-cases/crear-empresa.use-case';
import { Empresa } from '../../src/core/domain/empresa.entity';
import { EmpresaRepository } from '../../src/core/domain/empresa.repository';

describe('CrearEmpresaUseCase', () => {
  let useCase: CrearEmpresaUseCase;
  let empresaRepository: jest.Mocked<EmpresaRepository>;

  beforeEach(() => {
    empresaRepository = {
      crear: jest.fn(),
      listarEmpresasAdheridasUltimoMes: jest.fn(),
      listarEmpresasConTransferenciasUltimoMes: jest.fn(),
    };

    useCase = new CrearEmpresaUseCase(empresaRepository);
  });

  it('debería crear una empresa y devolverla', async () => {
    const cuit = '20304050607';
    const razonSocial = 'UNSC Spartan Ops';

    const empresaMock = new Empresa('uuid-mock', cuit, razonSocial, new Date());

    empresaRepository.crear.mockResolvedValue(empresaMock);

    const result = await useCase.execute(cuit, razonSocial);

    expect(empresaRepository.crear).toHaveBeenCalledTimes(1);
    expect(empresaRepository.crear).toHaveBeenCalledWith(expect.any(Empresa));
    expect(result).toEqual(empresaMock);
  });
});
