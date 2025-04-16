/**
 * Entidad de dominio: Empresa
 *
 * Representa a una empresa registrada en el sistema, con su CUIT,
 * razón social y fecha de adhesión. Esta entidad es independiente
 * de cualquier framework, ORM o tecnología de persistencia.
 *
 * 📌 Usada como objeto principal en los casos de uso de creación,
 * consulta por fecha de adhesión y agrupación de transferencias.
 *
 * @property id - Identificador único de la empresa (UUID).
 * @property cuit - Código Único de Identificación Tributaria (11 dígitos).
 * @property razonSocial - Nombre legal o comercial de la empresa.
 * @property fechaAdhesion - Fecha en la que la empresa fue adherida al sistema.
 *
 * @example
 * const empresa = new Empresa('uuid', '20304050607', 'Spartan Ops S.A.', new Date());
 */
export class Empresa {
  constructor(
    public readonly id: string,
    public readonly cuit: string,
    public readonly razonSocial: string,
    public readonly fechaAdhesion: Date,
  ) {}
}
