import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrearEmpresaUseCase } from 'src/modules/empresa/application/use-cases/crear-empresa.use-case';
import { ListarEmpresasAdheridasUltimoMesUseCase } from 'src/modules/empresa/application/use-cases/listar-adhesiones.use-case';
import { ListarEmpresasConTransferenciasUltimoMesUseCase } from 'src/modules/empresa/application/use-cases/listar-transferencias.use-case';
import { BaseController } from 'src/shared/utils/perform-controller-operation';

import { CrearEmpresaDto } from '../dtos/crear-empresa.dto';

/**
 * Controlador HTTP: EmpresaController
 *
 * 🔌 Expone los endpoints relacionados a la gestión de empresas.
 * Cada método corresponde a un caso de uso de la capa de aplicación.
 *
 * 📦 Utiliza `performControllerOperation` para loguear, capturar errores
 * y mantener consistencia en el manejo de operaciones.
 *
 * @route /empresas
 */
@ApiTags('Empresa')
@Controller('empresas')
export class EmpresaController extends BaseController {
  constructor(
    private readonly crearEmpresa: CrearEmpresaUseCase,
    private readonly listarAdhesiones: ListarEmpresasAdheridasUltimoMesUseCase,
    private readonly listarTransferencias: ListarEmpresasConTransferenciasUltimoMesUseCase,
  ) {
    super(EmpresaController.name);
  }

  /**
   * Endpoint: Crear nueva empresa
   *
   * 📝 Crea una nueva empresa a partir del CUIT y razón social enviados
   * en el cuerpo del request.
   *
   * @route POST /empresas
   * @param dto - Objeto con `cuit` y `razonSocial` validados vía DTO.
   * @returns La empresa creada.
   *
   * @example
   * POST /empresas
   * {
   *   "cuit": "20304050607",
   *   "razonSocial": "Spartan S.A."
   * }
   */
  @Post()
  @ApiCreatedResponse({
    description: 'Empresa creada con éxito',
  })
  @ApiConflictResponse({
    description: 'La empresa ya existe (CUIT duplicado)',
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  async crear(@Body() dto: CrearEmpresaDto) {
    return this.performControllerOperation({
      functionName: 'crear Empresa',
      operation: async () =>
        this.crearEmpresa.execute(dto.cuit, dto.razonSocial),
      context: 'empresaController',
    });
  }

  /**
   * Endpoint: Listar empresas adheridas en el último mes
   *
   * 📊 Retorna todas las empresas cuya fecha de adhesión
   * se encuentre dentro del mes calendario anterior al actual.
   *
   * @route GET /empresas/adhesion
   * @returns Lista de empresas adheridas.
   */
  @Get('adhesion')
  @ApiResponse({
    status: 200,
    description: 'Empresas adheridas el último mes',
  })
  async listarAdheridas() {
    return this.performControllerOperation({
      functionName: 'listar empresas adheridas',
      operation: async () => this.listarAdhesiones.execute(),
      context: 'empresaController',
    });
  }

  /**
   * Endpoint: Listar empresas con transferencias
   *
   * 🔁 Devuelve empresas que hayan realizado transferencias
   * durante el mes calendario anterior, junto con sus movimientos.
   *
   * @route GET /empresas/actividad
   * @returns Array de objetos con empresa + transferencias asociadas.
   */
  @Get('actividad')
  @ApiResponse({
    status: 200,
    description: 'Empresas con transferencias recientes',
  })
  async listarConTransferencias() {
    return this.performControllerOperation({
      functionName: 'listar empresas con transferencias',
      operation: async () => this.listarTransferencias.execute(),
      context: 'empresaController',
    });
  }
}
