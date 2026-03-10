import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/main/buildApp';

describe('buildApp', () => {
  it('returns ok on health', async () => {
    const app = buildApp();
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns 404 on unknown route', async () => {
    const app = buildApp();
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });
});
