import { describe, expect, it } from 'vitest';
import { getEnv, getNumberEnv, getRequiredEnv } from '../../src/shared/env';

describe('env', () => {
  it('getRequiredEnv throws when missing', () => {
    const previous = process.env.REQUIRED_TEST;
    delete process.env.REQUIRED_TEST;
    expect(() => getRequiredEnv('REQUIRED_TEST')).toThrow('Missing env var: REQUIRED_TEST');
    if (previous !== undefined) process.env.REQUIRED_TEST = previous;
  });

  it('getNumberEnv uses fallback when missing or invalid', () => {
    const previous = process.env.PORT_TEST;
    delete process.env.PORT_TEST;
    expect(getNumberEnv('PORT_TEST', 123)).toBe(123);
    process.env.PORT_TEST = 'x';
    expect(getNumberEnv('PORT_TEST', 123)).toBe(123);
    process.env.PORT_TEST = '8080';
    expect(getNumberEnv('PORT_TEST', 123)).toBe(8080);
    if (previous !== undefined) process.env.PORT_TEST = previous;
    else delete process.env.PORT_TEST;
  });

  it('getEnv returns defaults', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevPort = process.env.PORT;
    const prevMongo = process.env.MONGODB_URI;
    const prevCors = process.env.CORS_ORIGIN;
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.MONGODB_URI;
    delete process.env.CORS_ORIGIN;

    expect(getEnv()).toEqual({ nodeEnv: 'development', port: 3000, mongodbUri: '', corsOrigin: '*' });

    if (prevNodeEnv !== undefined) process.env.NODE_ENV = prevNodeEnv;
    else delete process.env.NODE_ENV;
    if (prevPort !== undefined) process.env.PORT = prevPort;
    else delete process.env.PORT;
    if (prevMongo !== undefined) process.env.MONGODB_URI = prevMongo;
    else delete process.env.MONGODB_URI;
    if (prevCors !== undefined) process.env.CORS_ORIGIN = prevCors;
    else delete process.env.CORS_ORIGIN;
  });
});
