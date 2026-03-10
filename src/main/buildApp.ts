import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import { buildApiRoutes } from './buildApiRoutes';
import { errorHandler } from '../presentation/middleware/errorHandler';
import { requestLogger } from '../presentation/middleware/requestLogger';

type BuildAppOptions = {
  corsOrigin?: string;
};

export const buildApp = (options: BuildAppOptions = {}) => {
  const app = express();

  app.use(requestLogger);
  app.use(
    cors({
      origin: options.corsOrigin ?? '*'
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.use('/api/v1', buildApiRoutes());

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  app.use(errorHandler);

  return app;
};
