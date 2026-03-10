import express from 'express';
import type { Router } from 'express';
import { errorHandler } from '../../src/presentation/middleware/errorHandler';

export const buildTestApiApp = (apiRouter: Router) => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1', apiRouter);
  app.use(errorHandler);
  return app;
};
