import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { asyncHandler } from '../../../src/presentation/middleware/asyncHandler';
import { errorHandler } from '../../../src/presentation/middleware/errorHandler';

describe('asyncHandler', () => {
  it('forwards thrown errors to error handler', async () => {
    const app = express();
    app.get(
      '/boom',
      asyncHandler(async () => {
        await Promise.resolve();
        throw new Error('Boom');
      })
    );
    app.use(errorHandler);

    const response = await request(app).get('/boom');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Boom' }
    });
  });
});
