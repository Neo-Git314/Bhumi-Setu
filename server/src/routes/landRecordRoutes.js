import express from 'express';
import { landRecordController } from '../controllers/landRecordController.js';
import { authenticateUser, requireRole } from '../middleware/authMiddleware.js';
import { auditAction } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.get('/', landRecordController.getAll);
router.get('/:id', landRecordController.getById);
router.get('/:id/history', landRecordController.getHistory);

router.post(
  '/',
  authenticateUser,
  requireRole('REVENUE_OFFICER', 'ADMIN'),
  auditAction('Land Records', (req) => `Created new land record for Khasra ${req.body.khasraNo}`),
  landRecordController.create
);

router.put(
  '/:id',
  authenticateUser,
  requireRole('REVENUE_OFFICER', 'ADMIN'),
  auditAction('Land Records', (req) => `Updated land record ${req.params.id}`),
  landRecordController.update
);

export default router;
