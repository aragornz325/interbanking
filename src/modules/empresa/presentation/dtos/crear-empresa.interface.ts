/**
 * Interfaz: ICrearEmpresa
 *
 * 🧾 Define la estructura mínima requerida para crear una empresa.
 * Esta interfaz es implementada por el DTO `CrearEmpresaDto`.
 *
 * ✨ Se utiliza para garantizar que cualquier objeto destinado a representar
 * la creación de una empresa contenga estos dos campos obligatorios.
 *
 * @property cuit - CUIT único de la empresa (11 dígitos numéricos).
 * @property razonSocial - Nombre legal o comercial de la empresa.
 */
export interface ICrearEmpresa {
  cuit: string;
  razonSocial: string;
}
