import { Router } from 'express';
import type { MemberController } from '../controllers/MemberController';
import { asyncHandler } from '../middleware/asyncHandler';

export const buildMemberRoutes = (memberController: MemberController) => {
  const router = Router();

  router.get('/', asyncHandler(memberController.getAll));
  router.post('/', asyncHandler(memberController.save));

  return router;
};
