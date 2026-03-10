export type NodeEnv = 'development' | 'test' | 'production';

export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

export const getNumberEnv = (key: string, fallback: number): number => {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

export const getEnv = () => {
  return {
    nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? 'development',
    port: getNumberEnv('PORT', 3000),
    mongodbUri: process.env.MONGODB_URI ?? '',
    corsOrigin: process.env.CORS_ORIGIN ?? '*'
  };
};

export const requireMongoDbUri = (): string => getRequiredEnv('MONGODB_URI');
