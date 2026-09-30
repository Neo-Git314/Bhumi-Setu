import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', authenticateUser, authController.getCurrentUser);

export default router;
