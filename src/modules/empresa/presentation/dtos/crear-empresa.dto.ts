import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { ICrearEmpresa } from './crear-empresa.interface';

/**
 * DTO: CrearEmpresaDto
 *
 * 📥 Define el contrato de entrada para la creación de una empresa.
 * Este objeto es validado automáticamente por NestJS usando los
 * decoradores de `class-validator`.
 *
 * ✨ Implementa la interfaz `ICrearEmpresa` como contrato explícito de los datos esperados.
 *
 * @property cuit - CUIT único de la empresa. Debe tener exactamente 11 dígitos numéricos.
 * @property razonSocial - Nombre comercial o legal de la empresa.
 *
 * @example
 * {
 *   "cuit": "20304050607",
 *   "razonSocial": "Industria Spartan S.A."
 * }
 */
export class CrearEmpresaDto implements ICrearEmpresa {
  @ApiProperty({
    description: 'CUIT único de la empresa',
    example: '20304050607',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{11}$/, {
    message: 'El CUIT debe tener 11 dígitos numéricos',
  })
  cuit!: string;

  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Industria Spartan S.A.',
  })
  @Length(3, 100, {
    message: 'La razón social debe tener entre 3 y 100 caracteres',
  })
  @IsNotEmpty()
  @IsString()
  razonSocial!: string;
}
