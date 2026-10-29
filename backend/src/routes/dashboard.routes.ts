import { Router } from 'express';
import { DashboardController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', DashboardController.getDashboard);

export default router;
