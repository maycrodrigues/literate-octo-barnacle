import { Router } from 'express';
import type { SettingsController } from '../controllers/SettingsController';
import { asyncHandler } from '../middleware/asyncHandler';

export const buildSettingsRoutes = (settingsController: SettingsController) => {
  const router = Router();

  router.get('/', asyncHandler(settingsController.getAll));
  router.post('/', asyncHandler(settingsController.save));

  return router;
};
