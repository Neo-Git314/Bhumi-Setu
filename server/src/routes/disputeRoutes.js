import express from 'express';
import { disputeController } from '../controllers/disputeController.js';
import { authenticateUser, requireRole } from '../middleware/authMiddleware.js';
import { auditAction } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.get('/', disputeController.getAll);
router.get('/:id', disputeController.getById);

router.post(
  '/',
  authenticateUser,
  auditAction('Dispute Management', (req) => `Registered land dispute grievance for parcel ${req.body.parcelId}`),
  disputeController.create
);

router.put(
  '/:id/status',
  authenticateUser,
  requireRole('REVENUE_OFFICER', 'DISPUTE_AUTHORITY', 'ADMIN'),
  auditAction('Dispute Management', (req) => `Updated dispute status to ${req.body.status}`),
  disputeController.updateStatus
);

router.post(
  '/:id/evidence',
  authenticateUser,
  auditAction('Dispute Evidence', (req) => `Attached evidence to dispute case ${req.params.id}`),
  disputeController.addEvidence
);

export default router;
