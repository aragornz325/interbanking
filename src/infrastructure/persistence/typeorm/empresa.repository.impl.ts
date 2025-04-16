import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EmpresaRepository } from 'src/core/domain/empresa.repository';
import { Empresa } from 'src/core/domain/empresa.entity';
import { EmpresaOrmEntity } from './empresa.orm-entity';
import { TransferenciaOrmEntity } from './transferencia.orm-entity';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Transferencia } from 'src/core/domain/transferencia.entity';
import { DataSource } from 'typeorm';
import { EmpresaConTransferenciasRaw } from 'src/shared/interfaces/empresa-transferenciaRaw';

@Injectable()
export class EmpresaRepositoryImpl implements EmpresaRepository {
  constructor(
    @InjectRepository(EmpresaOrmEntity)
    private readonly empresaRepo: Repository<EmpresaOrmEntity>,
    @InjectRepository(TransferenciaOrmEntity)
    private readonly transferenciaRepo: Repository<TransferenciaOrmEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Registra una nueva empresa en la base de datos.
   *
   * 💾 Persiste la entidad de dominio `Empresa` utilizando el repositorio TypeORM.
   * Devuelve una nueva instancia de `Empresa` reconstruida a partir del resultado almacenado,
   * asegurando independencia del ORM en capas superiores.
   *
   * @param empresa - Objeto de dominio `Empresa` con CUIT, razón social y fecha de adhesión.
   * @returns Instancia de `Empresa` persistida, incluyendo su ID generado por la base de datos.
   * @throws Error si ocurre un fallo durante la operación de guardado.
   *
   * @example
   * const empresa = new Empresa(undefined, '20304050607', 'UNSC Spartan Ops', new Date());
   * const nueva = await repo.crear(empresa);
   * console.log(nueva.id); // UUID generado
   */
  async crear(empresa: Empresa): Promise<Empresa> {
    const saved = await this.empresaRepo.save(empresa);
    return new Empresa(
      saved.id,
      saved.cuit,
      saved.razonSocial,
      saved.fechaAdhesion,
    );
  }

  /**
   * Obtiene todas las empresas que se adhirieron durante el último mes calendario.
   *
   * 📅 El rango evaluado corresponde desde el primer hasta el último día
   * del mes anterior al mes actual (ejemplo: si hoy es 15/04, el rango es 01/03 - 31/03).
   *
   * 🧠 Esta consulta está optimizada usando un filtro por rango de fechas sobre el campo `fechaAdhesion`.
   *
   * @returns Array de instancias de la entidad de dominio `Empresa`.
   * @throws Error si ocurre un fallo al consultar o mapear los datos.
   *
   * @example
   * const empresas = await repo.listarEmpresasAdheridasUltimoMes();
   * console.log(empresas[0].razonSocial);
   */
  async listarEmpresasAdheridasUltimoMes(): Promise<Empresa[]> {
    const inicio = startOfMonth(subMonths(new Date(), 1));
    const fin = endOfMonth(subMonths(new Date(), 1));
    const empresas = await this.empresaRepo.find({
      where: { fechaAdhesion: Between(inicio, fin) },
    });
    return empresas.map(
      (e) => new Empresa(e.id, e.cuit, e.razonSocial, e.fechaAdhesion),
    );
  }

  /**
   * Obtiene las empresas que realizaron transferencias durante el último mes calendario,
   * junto con todas sus transferencias correspondientes en ese período.
   *
   * 🔍 Esta operación está optimizada mediante una RawQuery para evitar el problema N+1
   * y reducir la carga de trabajo en memoria, delegando la agrupación y combinación a la base de datos.
   *
   * @returns Array de objetos con la estructura: { empresa: Empresa, transferencias: Transferencia[] }
   * @throws Error si ocurre un fallo al ejecutar la consulta o procesar los resultados.
   *
   * @example
   * const resultados = await repo.listarEmpresasConTransferenciasUltimoMes();
   * console.log(resultados[0].empresa.razonSocial);
   * console.log(resultados[0].transferencias.length);
   */
  async listarEmpresasConTransferenciasUltimoMes(): Promise<
    Array<{ empresa: Empresa; transferencias: Transferencia[] }>
  > {
    const inicio = startOfMonth(subMonths(new Date(), 1));
    const fin = endOfMonth(subMonths(new Date(), 1));

    const rows = await this.dataSource.query<EmpresaConTransferenciasRaw[]>(
      `
    SELECT 
      e.id AS empresa_id,
      e.cuit,
      e.razon_social,
      e.fecha_adhesion,
      json_agg(json_build_object(
        'id', t.id,
        'cuentaDebito', t.cuenta_debito,
        'cuentaCredito', t.cuenta_credito,
        'importe', t.importe,
        'fecha', t.fecha
      )) AS transferencias
    FROM empresas e
    JOIN transferencias t ON t.empresa_id = e.id
    WHERE t.fecha BETWEEN $1 AND $2
    GROUP BY e.id;
    `,
      [inicio, fin],
    );

    return rows.map((row) => ({
      empresa: new Empresa(
        row.empresa_id,
        row.cuit,
        row.razon_social,
        new Date(row.fecha_adhesion),
      ),
      transferencias: row.transferencias.map(
        (t) =>
          new Transferencia(
            t.id,
            row.empresa_id,
            t.cuentaDebito,
            t.cuentaCredito,
            t.importe,
            new Date(t.fecha),
          ),
      ),
    }));
  }
}
