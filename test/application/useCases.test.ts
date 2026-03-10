import { describe, expect, it } from 'vitest';
import { GetAllContacts } from '../../src/application/use-cases/contact/GetAllContacts';
import { SaveContact } from '../../src/application/use-cases/contact/SaveContact';
import { GetAllDemands } from '../../src/application/use-cases/demand/GetAllDemands';
import { GetDemandById } from '../../src/application/use-cases/demand/GetDemandById';
import { SaveDemand } from '../../src/application/use-cases/demand/SaveDemand';
import { GetAllMembers } from '../../src/application/use-cases/member/GetAllMembers';
import { SaveMember } from '../../src/application/use-cases/member/SaveMember';
import { GetSettings } from '../../src/application/use-cases/settings/GetSettings';
import { SaveSettings } from '../../src/application/use-cases/settings/SaveSettings';
import type { Contact } from '../../src/domain/entities/Contact';
import type { Demand } from '../../src/domain/entities/Demand';
import type { Member } from '../../src/domain/entities/Member';
import type { Settings } from '../../src/domain/entities/Settings';
import {
  createInMemoryContactRepository,
  createInMemoryDemandRepository,
  createInMemoryMemberRepository,
  createInMemorySettingsRepository
} from '../fakes/inMemoryRepositories';

describe('Use cases', () => {
  it('GetAllDemands returns repository results', async () => {
    const repo = createInMemoryDemandRepository([
      {
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
      }
    ]);

    const useCase = new GetAllDemands(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('d1');
  });

  it('GetDemandById returns null when missing', async () => {
    const repo = createInMemoryDemandRepository([]);
    const useCase = new GetDemandById(repo);
    const result = await useCase.execute('missing');
    expect(result).toBeNull();
  });

  it('SaveDemand upserts via repository', async () => {
    const repo = createInMemoryDemandRepository([]);
    const useCase = new SaveDemand(repo);
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

    const saved = await useCase.execute(demand);
    expect(saved).toEqual(demand);

    const fetched = await repo.findById('d1');
    expect(fetched).toEqual(demand);
  });

  it('GetAllMembers returns repository results', async () => {
    const repo = createInMemoryMemberRepository([
      {
        id: 'm1',
        tenantId: 't1',
        name: 'Maria',
        phone: '999',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const useCase = new GetAllMembers(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('m1');
  });

  it('SaveMember persists via repository', async () => {
    const repo = createInMemoryMemberRepository([]);
    const useCase = new SaveMember(repo);
    const member: Member = {
      id: 'm1',
      tenantId: 't1',
      name: 'Maria',
      phone: '999',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = await useCase.execute(member);
    expect(saved).toEqual(member);
    expect(await repo.findById('m1')).toEqual(member);
  });

  it('GetAllContacts returns repository results', async () => {
    const repo = createInMemoryContactRepository([
      {
        id: 'c1',
        tenantId: 't1',
        name: 'Ana',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const useCase = new GetAllContacts(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('c1');
  });

  it('SaveContact persists via repository', async () => {
    const repo = createInMemoryContactRepository([]);
    const useCase = new SaveContact(repo);
    const contact: Contact = {
      id: 'c1',
      tenantId: 't1',
      name: 'Ana',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = await useCase.execute(contact);
    expect(saved).toEqual(contact);
    expect(await repo.findById('c1')).toEqual(contact);
  });

  it('GetSettings returns repository results', async () => {
    const repo = createInMemorySettingsRepository([
      {
        id: 'global_settings',
        tenantId: 't1',
        categories: [],
        urgencies: [],
        status: [],
        tratativas: [],
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const useCase = new GetSettings(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('global_settings');
  });

  it('SaveSettings persists via repository', async () => {
    const repo = createInMemorySettingsRepository([]);
    const useCase = new SaveSettings(repo);
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

    const saved = await useCase.execute(settings);
    expect(saved).toEqual(settings);
    expect(await repo.findById('global_settings')).toEqual(settings);
  });
});
