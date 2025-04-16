import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

/**
 * Espera a que la base de datos esté disponible, intentando hasta 5 veces.
 * @param dataSource Instancia de TypeORM ya inicializada.
 */
export async function waitForDb({
  logger,
  dataSource,
}: {
  logger: Logger;
  dataSource: DataSource;
}): Promise<void> {
  let retries = 5;
  while (retries > 0) {
    try {
      await dataSource.query('SELECT 1');
      return;
    } catch {
      logger.debug('[SEED] Esperando base de datos...');
      await new Promise((res) => setTimeout(res, 2000));
      retries--;
    }
  }
  throw new Error('No se pudo conectar a la base de datos');
}
