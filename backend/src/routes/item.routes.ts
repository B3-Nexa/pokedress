import { Router } from 'express';
import { ItemController } from '../controllers/item.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', upload.single('photo'), ItemController.createItem);
router.post('/upload-photo', upload.single('photo'), ItemController.uploadPhoto);
router.get('/check-duplicates', ItemController.checkDuplicates);
router.get('/', ItemController.getItems);
router.get('/:id', ItemController.getItemById);
router.patch('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
