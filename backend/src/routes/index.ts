import { Router } from 'express';
import authRoutes from './auth.routes.js';
import itemRoutes from './item.routes.js';
import roomRoutes from './room.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import householdRoutes from './household.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/rooms', roomRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/household', householdRoutes);

export default router;
