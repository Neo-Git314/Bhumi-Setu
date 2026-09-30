import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { authenticateUser, requireRole } from '../middleware/authMiddleware.js';
import { auditAction } from '../middleware/auditMiddleware.js';

const router = express.Router();

router.get('/flags', aiController.getFlags);
router.get('/flags/:id', aiController.getFlagById);

router.put(
  '/flags/:id',
  authenticateUser,
  requireRole('REVENUE_OFFICER', 'ADMIN'),
  auditAction('AI Validation', (req) => `Officer verified AI Flag ${req.params.id} as ${req.body.status}`),
  aiController.updateFlag
);

router.post('/validate-record', aiController.validateRecord);
router.post('/compare-records', aiController.compareRecords);
router.post('/analyze-document', aiController.analyzeDocument);

export default router;
