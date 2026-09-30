import express from 'express';
import { auditController } from '../controllers/auditController.js';
import { authenticateUser, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  authenticateUser,
  requireRole('AUDITOR', 'ADMIN', 'REVENUE_OFFICER'),
  auditController.getLogs
);

export default router;
