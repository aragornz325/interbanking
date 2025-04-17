/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CrearEmpresaUseCase } from 'src/modules/empresa/application/use-cases/crear-empresa.use-case';
import { ListarEmpresasAdheridasUltimoMesUseCase } from 'src/modules/empresa/application/use-cases/listar-adhesiones.use-case';
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from 'src/modules/empresa/application/use-cases/listar-transferencias.use-case';
import { Empresa } from 'src/modules/empresa/domain/empresa.entity';
import { Transferencia } from 'src/modules/empresa/domain/transferencia.entity';
import { EmpresaController } from 'src/modules/empresa/presentation/controllers/empresa.controller';

describe('EmpresaController - endpoints', () => {
  let controller: EmpresaController;
  let mockCrear: CrearEmpresaUseCase;
  let mockAdheridas: ListarEmpresasAdheridasUltimoMesUseCase;
  let mockTransferencias: ListarEmpresasConTransferenciasUltimoMesUseCase;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-04-17'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [
        {
          provide: CrearEmpresaUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListarEmpresasAdheridasUltimoMesUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListarEmpresasConTransferenciasUltimoMesUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(EmpresaController);
    mockCrear = module.get(CrearEmpresaUseCase);
    mockAdheridas = module.get(ListarEmpresasAdheridasUltimoMesUseCase);
    mockTransferencias = module.get(
      ListarEmpresasConTransferenciasUltimoMesUseCase,
    );
  });

  it('debe retornar empresas con transferencias en marzo (último mes calendario)', async () => {
    const fecha = new Date('2024-03-21');

    const empresa = new Empresa(
      'uuid-empresa',
      '20304050607',
      'Spartan Corp',
      fecha,
    );

    const transferencia = new Transferencia(
      'tr-001',
      'uuid-empresa',
      'cuenta-1',
      'cuenta-2',
      1000,
      fecha,
    );

    const mockResultado = [
      {
        empresa,
        transferencias: [transferencia],
      },
    ];

    jest
      .spyOn(mockTransferencias, 'execute')
      .mockResolvedValueOnce(mockResultado);

    const result = await controller.listarConTransferencias();

    expect(result).toEqual(mockResultado);
    expect(mockTransferencias.execute).toHaveBeenCalledTimes(1);
  });

  it('debe crear una empresa correctamente', async () => {
    const dto = { cuit: '20304050607', razonSocial: 'Spartan Corp' };
    const nueva = new Empresa('uuid-1', dto.cuit, dto.razonSocial, new Date());

    jest.spyOn(mockCrear, 'execute').mockResolvedValueOnce(nueva);

    const result = await controller.crear(dto);

    expect(result).toEqual(nueva);
    expect(mockCrear.execute).toHaveBeenCalledWith(dto.cuit, dto.razonSocial);
  });

  it('debe retornar empresas adheridas el último mes calendario', async () => {
    const empresas = [
      new Empresa(
        'uuid-2',
        '20987654321',
        'Noble Team Inc.',
        new Date('2024-03-10'),
      ),
    ];

    jest.spyOn(mockAdheridas, 'execute').mockResolvedValueOnce(empresas);

    const result = await controller.listarAdheridas();

    expect(result).toEqual(empresas);
    expect(mockAdheridas.execute).toHaveBeenCalledTimes(1);
  });
});
