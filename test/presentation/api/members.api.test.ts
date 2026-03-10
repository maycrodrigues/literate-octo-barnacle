import { Router } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { GetAllMembers } from '../../../src/application/use-cases/member/GetAllMembers';
import { SaveMember } from '../../../src/application/use-cases/member/SaveMember';
import type { Member } from '../../../src/domain/entities/Member';
import { MemberController } from '../../../src/presentation/controllers/MemberController';
import { buildMemberRoutes } from '../../../src/presentation/routes/memberRoutes';
import { createInMemoryMemberRepository } from '../../fakes/inMemoryRepositories';
import { buildTestApiApp } from '../../helpers/buildTestApiApp';

describe('API /members', () => {
  it('GET /api/v1/members returns list', async () => {
    const member: Member = {
      id: 'm1',
      tenantId: 't1',
      name: 'Maria',
      phone: '999',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const repo = createInMemoryMemberRepository([member]);
    const controller = new MemberController(new GetAllMembers(repo), new SaveMember(repo));
    const apiRouter = Router();
    apiRouter.use('/members', buildMemberRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const response = await request(app).get('/api/v1/members');
    expect(response.status).toBe(200);
    const body = response.body as unknown;
    expect(Array.isArray(body)).toBe(true);
    const list = body as Array<{ id: string }>;
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('m1');
  });

  it('POST /api/v1/members saves and returns payload', async () => {
    const repo = createInMemoryMemberRepository([]);
    const controller = new MemberController(new GetAllMembers(repo), new SaveMember(repo));
    const apiRouter = Router();
    apiRouter.use('/members', buildMemberRoutes(controller));
    const app = buildTestApiApp(apiRouter);

    const payload: Member = {
      id: 'm1',
      tenantId: 't1',
      name: 'Maria',
      phone: '999',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await request(app).post('/api/v1/members').send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 'm1' });
    expect(await repo.findById('m1')).toMatchObject({ id: 'm1' });
  });
});
