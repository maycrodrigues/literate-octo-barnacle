import { Router } from 'express';
import type { ContactController } from '../controllers/ContactController';
import { asyncHandler } from '../middleware/asyncHandler';

export const buildContactRoutes = (contactController: ContactController) => {
  const router = Router();

  router.get('/', asyncHandler(contactController.getAll));
  router.post('/', asyncHandler(contactController.save));

  return router;
};
