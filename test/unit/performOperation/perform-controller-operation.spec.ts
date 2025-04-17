/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/require-await */
import { Logger } from '@nestjs/common';
import { ErrorManager } from 'src/shared/exceptions/error-manager';
import { BaseController } from 'src/shared/utils/perform-controller-operation';

class DummyController extends BaseController {
  constructor() {
    super('DummyController');
  }

  async runOperation() {
    return this.performControllerOperation({
      functionName: 'TestOp',
      context: 'TestContext',
      operation: async () => 'ok',
    });
  }

  async runFailingOperation() {
    return this.performControllerOperation({
      functionName: 'FailingOp',
      context: 'TestContext',
      operation: async () => {
        throw new Error('boom');
      },
    });
  }

  async runUnknownError() {
    return this.performControllerOperation({
      functionName: 'UnknownErrorOp',
      context: 'TestContext',
      operation: async () => {
        throw '💥 algo raro';
      },
    });
  }
}

describe('BaseController - performControllerOperation()', () => {
  let controller: DummyController;
  let loggerLogSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;
  let errorManagerSpy: jest.SpyInstance;

  beforeEach(() => {
    controller = new DummyController();
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    errorManagerSpy = jest
      .spyOn(ErrorManager, 'handle')
      .mockImplementation((err: unknown) => {
        throw err instanceof Error ? err : new Error('Unknown error');
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería loguear y retornar resultado si la operación tiene éxito', async () => {
    const result = await controller.runOperation();

    expect(result).toBe('ok');
    expect(loggerLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('iniciada'),
    );
    expect(loggerLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('completada con éxito'),
    );
  });

  it('debería loguear error y delegar a ErrorManager si la operación falla', async () => {
    await expect(controller.runFailingOperation()).rejects.toThrow('boom');

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('fallida'),
      expect.any(String),
    );
    expect(errorManagerSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  it('debería lanzar "Unknown error" si el error no es instancia de Error', async () => {
    await expect(controller.runUnknownError()).rejects.toThrow('Unknown error');

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('fallida'),
      '💥 algo raro',
    );
    expect(errorManagerSpy).toHaveBeenCalledWith('💥 algo raro');
  });
});
