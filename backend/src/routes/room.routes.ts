import { Router } from 'express';
import { RoomController } from '../controllers/room.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', RoomController.getRooms);
router.post('/', RoomController.createRoom);
router.patch('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);

export default router;
