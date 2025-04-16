/**
 * Tipo auxiliar: EmpresaConTransferenciasRaw
 *
 * 🧾 Representa la forma en que una empresa y sus transferencias
 * son devueltas desde una consulta SQL cruda (raw query) en PostgreSQL.
 *
 * 🚨 Las fechas (`fecha_adhesion`, `fecha`) vienen como `string` por defecto
 * y deben ser convertidas a `Date` manualmente antes de crear las entidades de dominio.
 *
 * Este tipo se utiliza para mapear manualmente los resultados
 * y construir objetos `Empresa` y `Transferencia` válidos.
 *
 * @property empresa_id - ID de la empresa.
 * @property cuit - CUIT de la empresa.
 * @property razon_social - Razón social de la empresa.
 * @property fecha_adhesion - Fecha en que se adhirió (como string ISO).
 * @property transferencias - Lista de transferencias asociadas.
 */
export type EmpresaConTransferenciasRaw = {
  empresa_id: string;
  cuit: string;
  razon_social: string;
  fecha_adhesion: string;
  transferencias: Array<{
    id: string;
    cuentaDebito: string;
    cuentaCredito: string;
    importe: number;
    fecha: string;
  }>;
};
