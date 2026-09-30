import express from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, notificationController.getAll);
router.put('/:id/read', authenticateUser, notificationController.markRead);
router.post('/read-all', authenticateUser, notificationController.markAllRead);

export default router;
