import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDatabase } from './infrastructure/database/connect';
import { buildApp } from './main/buildApp';
import { getEnv } from './shared/env';
import { logger } from './shared/utils/logger';

dotenv.config();

const start = async () => {
  const env = getEnv();
  await connectToDatabase();
  logger.info('Connected to MongoDB');

  const app = buildApp({ corsOrigin: env.corsOrigin });
  const server = app.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
  });

  const shutdown = async (signal: string) => {
    logger.info('Shutting down', { signal });
    await mongoose.connection.close(false);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
};

start().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
