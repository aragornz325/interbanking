import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidad ORM: EmpresaOrmEntity
 *
 * 🏛️ Representa la tabla `empresas` en la base de datos.
 * Esta clase es utilizada exclusivamente por TypeORM para mapear
 * los datos de persistencia hacia la entidad de dominio `Empresa`.
 *
 * 🧱 Pertenece a la capa de infraestructura. No debe ser utilizada
 * directamente por casos de uso ni controladores.
 *
 * @property id - Clave primaria generada automáticamente (UUID).
 * @property cuit - CUIT único de la empresa (índice único en base de datos).
 * @property razonSocial - Nombre legal o comercial de la empresa.
 * @property fechaAdhesion - Fecha en la que se adhirió al sistema.
 *
 * @see Empresa - Entidad de dominio correspondiente
 */
@Entity({ name: 'empresas' })
export class EmpresaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true })
  cuit!: string;

  @Column()
  razonSocial!: string;

  @Column({ type: 'timestamp' })
  fechaAdhesion!: Date;
}
