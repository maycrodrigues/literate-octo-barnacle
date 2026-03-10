import { Router } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { GetSettings } from '../../../src/application/use-cases/settings/GetSettings';
import { SaveSettings } from '../../../src/application/use-cases/settings/SaveSettings';
import type { Settings } from '../../../src/domain/entities/Settings';
import { SettingsController } from '../../../src/presentation/controllers/SettingsController';
import { buildSettingsRoutes } from '../../../src/presentation/routes/settingsRoutes';
import { createInMemorySettingsRepository } from '../../fakes/inMemoryRepositories';
import { buildTestApiApp } from '../../helpers/buildTestApiApp';

describe('API /settings', () => {
  it('GET /api/v1/settings returns list', async () => {
    const settings: Settings = {
      id: 'global_settings',
      tenantId: 't1',
      categories: [],
      urgencies: [],
      status: [],
      tratativas: [],
      roles: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const repo = createInMemorySettingsRepository([settings]);
    const controller = new SettingsController(new GetSettings(repo), new SaveSettings(repo));
    const apiRouter = Router();
    apiRouter.use('/settings', buildSettingsRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const response = await request(app).get('/api/v1/settings');
    expect(response.status).toBe(200);
    const body = response.body as unknown;
    expect(Array.isArray(body)).toBe(true);
    const list = body as Array<{ id: string }>;
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('global_settings');
  });

  it('POST /api/v1/settings saves and returns payload', async () => {
    const repo = createInMemorySettingsRepository([]);
    const controller = new SettingsController(new GetSettings(repo), new SaveSettings(repo));
    const apiRouter = Router();
    apiRouter.use('/settings', buildSettingsRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const payload: Settings = {
      id: 'global_settings',
      tenantId: 't1',
      categories: [],
      urgencies: [],
      status: [],
      tratativas: [],
      roles: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await request(app).post('/api/v1/settings').send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 'global_settings' });
    expect(await repo.findById('global_settings')).toMatchObject({ id: 'global_settings' });
  });
});
