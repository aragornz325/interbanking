import { Logger } from '@nestjs/common';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence';
import { Repository } from 'typeorm';

/** Espera a que la transferencia se persista en la base de datos.
 * Reintenta hasta 5 veces antes de fallar.
 * @param transferenciaRepo - Repositorio de TransferenciaOrmEntity
 * @param empresaId - ID de la empresa a verificar
 * @param logger - Logger de NestJS
 * @param maxRetries - Número máximo de reintentos (default: 5)
 * @param delayMs - Tiempo de espera entre reintentos en milisegundos (default: 500)
 * @returns {Promise<void>}
 * @throws {Error} Si la transferencia no se encuentra después de los reintentos
 */
export async function confirmTransferenciaPersistencia(
  transferenciaRepo: Repository<TransferenciaOrmEntity>,
  empresaId: string,
  logger: Logger,
  maxRetries = 5,
  delayMs = 500,
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    const found = await transferenciaRepo.findOne({ where: { empresaId } });
    if (found) {
      logger.debug('[SEED] Confirmada persistencia en base de datos');
      return;
    }
    logger.warn(
      `[SEED] Transferencia no visible aún. Reintentando (${i + 1})...`,
    );
    await new Promise((res) => setTimeout(res, delayMs));
  }
  throw new Error('[SEED] Transferencia no persistió tras múltiples intentos');
}
