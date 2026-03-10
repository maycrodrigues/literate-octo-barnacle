import { Router } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { GetAllContacts } from '../../../src/application/use-cases/contact/GetAllContacts';
import { SaveContact } from '../../../src/application/use-cases/contact/SaveContact';
import type { Contact } from '../../../src/domain/entities/Contact';
import { ContactController } from '../../../src/presentation/controllers/ContactController';
import { buildContactRoutes } from '../../../src/presentation/routes/contactRoutes';
import { createInMemoryContactRepository } from '../../fakes/inMemoryRepositories';
import { buildTestApiApp } from '../../helpers/buildTestApiApp';

describe('API /contacts', () => {
  it('GET /api/v1/contacts returns list', async () => {
    const contact: Contact = {
      id: 'c1',
      tenantId: 't1',
      name: 'Ana',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const repo = createInMemoryContactRepository([contact]);
    const controller = new ContactController(new GetAllContacts(repo), new SaveContact(repo));
    const apiRouter = Router();
    apiRouter.use('/contacts', buildContactRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const response = await request(app).get('/api/v1/contacts');
    expect(response.status).toBe(200);
    const body = response.body as unknown;
    expect(Array.isArray(body)).toBe(true);
    const list = body as Array<{ id: string }>;
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('c1');
  });

  it('POST /api/v1/contacts saves and returns payload', async () => {
    const repo = createInMemoryContactRepository([]);
    const controller = new ContactController(new GetAllContacts(repo), new SaveContact(repo));
    const apiRouter = Router();
    apiRouter.use('/contacts', buildContactRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const payload: Contact = {
      id: 'c1',
      tenantId: 't1',
      name: 'Ana',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await request(app).post('/api/v1/contacts').send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 'c1' });
    expect(await repo.findById('c1')).toMatchObject({ id: 'c1' });
  });
});
