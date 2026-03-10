import type { Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { errorHandler } from '../../../src/presentation/middleware/errorHandler';
import { NotFoundError } from '../../../src/shared/errors';
import { logger } from '../../../src/shared/utils/logger';

describe('errorHandler', () => {
  it('returns AppError status and payload', () => {
    const err = new NotFoundError('X_NOT_FOUND', 'Not here', { id: '1' });
    const status = vi.fn().mockReturnThis();
    const json = vi.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;

    errorHandler(err, {} as never, res, {} as never);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      error: { code: 'X_NOT_FOUND', message: 'Not here', details: { id: '1' } }
    });
  });

  it('returns 500 for non-AppError and logs', () => {
    const err = new Error('Boom');
    const status = vi.fn().mockReturnThis();
    const json = vi.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    errorHandler(err, {} as never, res, {} as never);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Boom' }
    });
    expect(spy).toHaveBeenCalledOnce();
  });
});
