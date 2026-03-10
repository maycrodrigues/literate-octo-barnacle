import { describe, expect, it, vi } from 'vitest';

describe('connectToDatabase', () => {
  it('throws when MONGODB_URI is missing', async () => {
    const previous = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    vi.resetModules();
    const { connectToDatabase } = await import('../../src/infrastructure/database/connect');
    await expect(connectToDatabase()).rejects.toThrow('Missing env var: MONGODB_URI');
    if (previous !== undefined) process.env.MONGODB_URI = previous;
  });

  it('caches connection and calls connect once', async () => {
    const previous = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://example.invalid';
    vi.resetModules();

    const mongooseMock: { connect?: unknown } = {};
    const connect = vi.fn(() => Promise.resolve(mongooseMock));
    mongooseMock.connect = connect;

    vi.doMock('mongoose', () => ({ default: mongooseMock }));

    const { connectToDatabase } = await import('../../src/infrastructure/database/connect');
    const first = await connectToDatabase();
    const second = await connectToDatabase();

    expect(first).toBe(second);
    expect(connect).toHaveBeenCalledOnce();

    vi.doUnmock('mongoose');
    if (previous !== undefined) process.env.MONGODB_URI = previous;
    else delete process.env.MONGODB_URI;
  });
});
