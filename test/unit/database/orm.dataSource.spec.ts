/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from 'src/modules/database/orm.dataSource';
import { EmpresaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/empresa.orm-entity';
import { TransferenciaOrmEntity } from 'src/modules/empresa/infrastructure/persistence/typeorm/transferencia.orm-entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

describe('getTypeOrmConfig', () => {
  it('debe devolver una configuración válida de TypeORM', () => {
    const mockConfig = {
      get: jest.fn((key: string) => {
        const values = {
          DB_HOST: 'localhost',
          DB_PORT: 5432,
          DB_USER: 'test_user',
          DB_PASSWORD: 'test_pass',
          DB_NAME: 'test_db',
        };
        return values[key];
      }),
    } as unknown as ConfigService;

    const config = getTypeOrmConfig(mockConfig) as PostgresConnectionOptions;

    expect(config.type).toBe('postgres');
    expect(config.host).toBe('localhost');
    expect(config.port).toBe(5432);
    expect(config.username).toBe('test_user');
    expect(config.password).toBe('test_pass');
    expect(config.database).toBe('test_db');
    expect(config.entities).toEqual([EmpresaOrmEntity, TransferenciaOrmEntity]);
    expect(config.migrations![0]).toContain('migrations/');
    expect(config.synchronize).toBe(true);
    expect(config.logging).toBe(false);
    expect(config.namingStrategy).toBeInstanceOf(SnakeNamingStrategy);
  });
});
