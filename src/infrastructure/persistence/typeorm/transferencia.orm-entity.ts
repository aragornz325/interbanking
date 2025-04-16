import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmpresaOrmEntity } from './empresa.orm-entity';

/**
 * Entidad ORM: TransferenciaOrmEntity
 *
 * 💸 Representa la tabla `transferencias` en la base de datos.
 * Esta clase es utilizada por TypeORM para mapear los datos
 * persistidos hacia la entidad de dominio `Transferencia`.
 *
 * 🧱 Pertenece a la capa de infraestructura. No debe ser utilizada
 * directamente por los casos de uso ni el dominio.
 *
 * Contiene una relación `@ManyToOne` con la entidad `EmpresaOrmEntity`,
 * asociando cada transferencia a una empresa responsable.
 *
 * @property id - Clave primaria generada automáticamente (UUID).
 * @property cuentaDebito - Número de cuenta origen.
 * @property cuentaCredito - Número de cuenta destino.
 * @property importe - Monto de la transferencia (decimal).
 * @property fecha - Fecha de la operación (timestamp).
 * @property empresa - Relación con la entidad `EmpresaOrmEntity`.
 * @property empresaId - ID de la empresa asociada (FK explícita).
 *
 * @see Transferencia - Entidad de dominio correspondiente
 */

@Entity({ name: 'transferencias' })
export class TransferenciaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  cuentaDebito!: string;

  @Column()
  cuentaCredito!: string;

  @Column({ type: 'decimal' })
  importe!: number;

  @Column({ type: 'timestamp' })
  fecha!: Date;

  @ManyToOne(() => EmpresaOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empresa_id' })
  empresa!: EmpresaOrmEntity;

  @Column()
  empresaId!: string;
}
