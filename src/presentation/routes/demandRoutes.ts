import { Router } from 'express';
import type { DemandController } from '../controllers/DemandController';
import { asyncHandler } from '../middleware/asyncHandler';

export const buildDemandRoutes = (demandController: DemandController) => {
  const router = Router();

  router.get('/', asyncHandler(demandController.getAll));
  router.get('/:id', asyncHandler(demandController.getById));
  router.post('/', asyncHandler(demandController.save));

  return router;
};
