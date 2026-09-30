import express from 'express';
import { applicationController } from '../controllers/applicationController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { auditAction } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.get('/', applicationController.getAll);

router.post(
  '/',
  authenticateUser,
  auditAction('Citizen Applications', (req) => `Submitted application for ${req.body.type || 'Land Service'}`),
  applicationController.create
);

export default router;
