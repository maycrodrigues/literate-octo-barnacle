import { Router } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { GetAllDemands } from '../../../src/application/use-cases/demand/GetAllDemands';
import { GetDemandById } from '../../../src/application/use-cases/demand/GetDemandById';
import { SaveDemand } from '../../../src/application/use-cases/demand/SaveDemand';
import type { Demand } from '../../../src/domain/entities/Demand';
import { DemandController } from '../../../src/presentation/controllers/DemandController';
import { buildDemandRoutes } from '../../../src/presentation/routes/demandRoutes';
import { logger } from '../../../src/shared/utils/logger';
import { createInMemoryDemandRepository } from '../../fakes/inMemoryRepositories';
import { buildTestApiApp } from '../../helpers/buildTestApiApp';

describe('API /demands', () => {
  it('GET /api/v1/demands returns list', async () => {
    const demand: Demand = {
      id: 'd1',
      tenantId: 't1',
      title: 'A',
      category: 'cat',
      urgency: 'high',
      description: 'desc',
      requesterName: 'John',
      requesterContact: '999',
      protocol: 'p1',
      active: true,
      status: 'open',
      statusHistory: [],
      totalDuration: 0,
      timeline: [],
      tratativas: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const repo = createInMemoryDemandRepository([demand]);
    const controller = new DemandController(new GetAllDemands(repo), new GetDemandById(repo), new SaveDemand(repo));
    const apiRouter = Router();
    apiRouter.use('/demands', buildDemandRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const response = await request(app).get('/api/v1/demands');
    expect(response.status).toBe(200);
    const body = response.body as unknown;
    expect(Array.isArray(body)).toBe(true);
    const list = body as Array<{ id: string }>;
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('d1');
  });

  it('GET /api/v1/demands/:id returns 200 when found', async () => {
    const demand: Demand = {
      id: 'd1',
      tenantId: 't1',
      title: 'A',
      category: 'cat',
      urgency: 'high',
      description: 'desc',
      requesterName: 'John',
      requesterContact: '999',
      protocol: 'p1',
      active: true,
      status: 'open',
      statusHistory: [],
      totalDuration: 0,
      timeline: [],
      tratativas: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const repo = createInMemoryDemandRepository([demand]);
    const controller = new DemandController(new GetAllDemands(repo), new GetDemandById(repo), new SaveDemand(repo));
    const apiRouter = Router();
    apiRouter.use('/demands', buildDemandRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const response = await request(app).get('/api/v1/demands/d1');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 'd1' });
  });

  it('GET /api/v1/demands/:id returns 404 when missing', async () => {
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    const repo = createInMemoryDemandRepository([]);
    const controller = new DemandController(new GetAllDemands(repo), new GetDemandById(repo), new SaveDemand(repo));
    const apiRouter = Router();
    apiRouter.use('/demands', buildDemandRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const response = await request(app).get('/api/v1/demands/missing');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'DEMAND_NOT_FOUND',
        message: 'Demand not found',
        details: { demandId: 'missing' }
      }
    });
  });

  it('POST /api/v1/demands saves and returns payload', async () => {
    const repo = createInMemoryDemandRepository([]);
    const controller = new DemandController(new GetAllDemands(repo), new GetDemandById(repo), new SaveDemand(repo));
    const apiRouter = Router();
    apiRouter.use('/demands', buildDemandRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const payload: Demand = {
      id: 'd1',
      tenantId: 't1',
      title: 'A',
      category: 'cat',
      urgency: 'high',
      description: 'desc',
      requesterName: 'John',
      requesterContact: '999',
      protocol: 'p1',
      active: true,
      status: 'open',
      statusHistory: [],
      totalDuration: 0,
      timeline: [],
      tratativas: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await request(app).post('/api/v1/demands').send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 'd1' });
    expect(await repo.findById('d1')).toMatchObject({ id: 'd1' });
  });
});
