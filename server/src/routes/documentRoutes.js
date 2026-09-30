import express from 'express';
import multer from 'multer';
import { documentController } from '../controllers/documentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { auditAction } from '../middleware/auditMiddleware.js';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const router = express.Router();

router.get('/', documentController.getAll);
router.get('/:id', documentController.getById);
router.get('/:id/versions', documentController.getVersions);
router.get('/:id/extract-fields', documentController.extractFields);

router.post(
  '/upload',
  authenticateUser,
  upload.single('file'),
  auditAction('Evidence Management', (req) => `Uploaded document ${req.body.title || 'Land Record'}`),
  documentController.upload
);

export default router;
