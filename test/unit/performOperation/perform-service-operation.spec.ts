/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/require-await */
import { Logger } from '@nestjs/common';
import { ErrorManager } from 'src/shared/exceptions/error-manager';
import { BaseService } from 'src/shared/utils/perform-service-operation';

class DummyService extends BaseService {
  constructor() {
    super('DummyService');
  }

  async runOperation() {
    return this.performServiceOperation({
      functionName: 'TestOp',
      context: 'TestContext',
      operation: async () => 'ok',
    });
  }

  async runFailingOperation() {
    return this.performServiceOperation({
      functionName: 'FailOp',
      context: 'TestContext',
      operation: async () => {
        throw new Error('BOOM');
      },
    });
  }

  async runUnknownError() {
    return this.performServiceOperation({
      functionName: 'UnknownFail',
      context: 'TestContext',
      operation: async () => {
        throw 'some string error';
      },
    });
  }
}

describe('BaseService - performServiceOperation()', () => {
  let service: DummyService;
  let loggerLogSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;
  let errorManagerSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new DummyService();
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    errorManagerSpy = jest
      .spyOn(ErrorManager, 'handle')
      .mockImplementation(() => {
        throw new Error('Interceptado por ErrorManager');
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería loguear y retornar resultado si la operación tiene éxito', async () => {
    const result = await service.runOperation();

    expect(result).toBe('ok');
    expect(loggerLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('iniciada'),
    );
    expect(loggerLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('completada con éxito'),
    );
  });

  it('debería loguear error y delegar a ErrorManager si la operación falla', async () => {
    await expect(service.runFailingOperation()).rejects.toThrow(
      'Interceptado por ErrorManager',
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('fallida'),
      expect.any(String),
    );
    expect(errorManagerSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  it('debería lanzar un error genérico si el error no es instancia de Error', async () => {
    errorManagerSpy.mockImplementationOnce((err: unknown) => {
      throw err instanceof Error ? err : new Error('Unknown error');
    });

    await expect(service.runUnknownError()).rejects.toThrow('Unknown error');

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('fallida'),
      'some string error',
    );
    expect(errorManagerSpy).toHaveBeenCalledWith('some string error');
  });
});
