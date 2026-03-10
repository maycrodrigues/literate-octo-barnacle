import type { Contact } from '../../src/domain/entities/Contact';
import type { Demand } from '../../src/domain/entities/Demand';
import type { Member } from '../../src/domain/entities/Member';
import type { Settings } from '../../src/domain/entities/Settings';
import type { IContactRepository } from '../../src/domain/repositories/IContactRepository';
import type { IDemandRepository } from '../../src/domain/repositories/IDemandRepository';
import type { IMemberRepository } from '../../src/domain/repositories/IMemberRepository';
import type { ISettingsRepository } from '../../src/domain/repositories/ISettingsRepository';

type WithId = { id: string };

const upsertById = <T extends WithId>(items: T[], value: T) => {
  const index = items.findIndex((item) => item.id === value.id);
  if (index === -1) {
    items.push(value);
    return;
  }
  items[index] = value;
};

export const createInMemoryDemandRepository = (seed: Demand[] = []): IDemandRepository => {
  const items = [...seed];
  return {
    findAll() {
      return Promise.resolve([...items]);
    },
    findById(id: string) {
      return Promise.resolve(items.find((d) => d.id === id) ?? null);
    },
    save(demand: Demand) {
      upsertById(items, demand);
      return Promise.resolve(demand);
    }
  };
};

export const createInMemoryMemberRepository = (seed: Member[] = []): IMemberRepository => {
  const items = [...seed];
  return {
    findAll() {
      return Promise.resolve([...items]);
    },
    findById(id: string) {
      return Promise.resolve(items.find((m) => m.id === id) ?? null);
    },
    save(member: Member) {
      upsertById(items, member);
      return Promise.resolve(member);
    }
  };
};

export const createInMemoryContactRepository = (seed: Contact[] = []): IContactRepository => {
  const items = [...seed];
  return {
    findAll() {
      return Promise.resolve([...items]);
    },
    findById(id: string) {
      return Promise.resolve(items.find((c) => c.id === id) ?? null);
    },
    save(contact: Contact) {
      upsertById(items, contact);
      return Promise.resolve(contact);
    }
  };
};

export const createInMemorySettingsRepository = (seed: Settings[] = []): ISettingsRepository => {
  const items = [...seed];
  return {
    findAll() {
      return Promise.resolve([...items]);
    },
    findById(id: string) {
      return Promise.resolve(items.find((s) => s.id === id) ?? null);
    },
    save(settings: Settings) {
      upsertById(items, settings);
      return Promise.resolve(settings);
    }
  };
};
