import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { requestLogger } from '../../../src/presentation/middleware/requestLogger';
import { logger } from '../../../src/shared/utils/logger';

describe('requestLogger', () => {
  it('logs request info on finish', async () => {
    const spy = vi.spyOn(logger, 'info').mockImplementation(() => undefined);
    const app = express();
    app.use(requestLogger);
    app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const response = await request(app).get('/health').set('user-agent', 'test-agent');
    expect(response.status).toBe(200);

    expect(spy).toHaveBeenCalled();
    const lastCall = spy.mock.calls.at(-1);
    expect(lastCall?.[0]).toBe('Request processed');
    expect(lastCall?.[1]).toMatchObject({
      method: 'GET',
      path: '/health',
      status: 200,
      userAgent: 'test-agent'
    });
  });
});
