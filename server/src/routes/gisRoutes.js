import express from 'express';
import { gisController } from '../controllers/gisController.js';

const router = express.Router();

router.get('/parcels', gisController.getParcels);
router.get('/parcels/:id', gisController.getParcelById);
router.get('/layers', gisController.getLayers);
router.get('/nearby', gisController.getNearby);
router.post('/check-overlap', gisController.checkOverlap);
router.post('/calculate-area', gisController.calculateArea);

export default router;
