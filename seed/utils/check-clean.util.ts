import { Logger } from '@nestjs/common';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { Repository } from 'typeorm';

/**
 * Verifica que las tablas empresa y transferencia estén vacías
 * luego del TRUNCATE. Reintenta hasta 5 veces antes de fallar.
 *
 * @param empresaRepo - Repositorio de EmpresaOrmEntity
 * @param transferenciaRepo - Repositorio de TransferenciaOrmEntity
 * @param logger - Logger de NestJS
 */
export async function checkClean({
  empresaRepo,
  transferenciaRepo,
  logger,
}: {
  empresaRepo: Repository<EmpresaOrmEntity>;
  transferenciaRepo: Repository<TransferenciaOrmEntity>;
  logger: Logger;
}): Promise<void> {
  for (let i = 0; i < 5; i++) {
    const countEmp = await empresaRepo.count();
    const countTransf = await transferenciaRepo.count();
    if (countEmp === 0 && countTransf === 0) return;

    logger.debug('[SEED] Esperando limpieza efectiva de tablas...');
    await new Promise((res) => setTimeout(res, 1000));
  }

  throw new Error('[SEED] Las tablas no están vacías después del TRUNCATE');
}
