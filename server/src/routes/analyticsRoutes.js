import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', analyticsController.getOverview);
router.get('/disputes', analyticsController.getDisputes);
router.get('/land-use', analyticsController.getLandUse);
router.get('/regional', analyticsController.getRegional);

export default router;
