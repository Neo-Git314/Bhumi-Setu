import { gisService } from '../services/gisService.js';

export const gisController = {
  getParcels: async (req, res, next) => {
    try {
      const geojson = await gisService.getParcelsGeoJson();
      res.json(geojson);
    } catch (err) {
      next(err);
    }
  },

  getParcelById: async (req, res, next) => {
    try {
      const feature = await gisService.getParcelById(req.params.id);
      res.json(feature);
    } catch (err) {
      next(err);
    }
  },

  getLayers: async (req, res, next) => {
    try {
      const layers = await gisService.getLayers();
      res.json({
        success: true,
        data: layers,
      });
    } catch (err) {
      next(err);
    }
  },

  getNearby: async (req, res, next) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          error: 'BadRequest',
          message: 'Query parameters "lat" and "lng" are required.',
        });
      }
      const nearby = await gisService.getNearby(lat, lng, radius);
      res.json({
        success: true,
        count: nearby.length,
        data: nearby,
      });
    } catch (err) {
      next(err);
    }
  },

  checkOverlap: async (req, res, next) => {
    try {
      const { parcelA, parcelB } = req.body;
      const result = await gisService.checkOverlap(parcelA, parcelB);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  calculateArea: async (req, res, next) => {
    try {
      const { coordinates } = req.body;
      if (!coordinates || !Array.isArray(coordinates)) {
        return res.status(400).json({
          success: false,
          error: 'BadRequest',
          message: 'An array of polygon coordinates [[lng, lat], ...] is required.',
        });
      }
      const area = await gisService.calculateArea(coordinates);
      res.json({
        success: true,
        data: area,
      });
    } catch (err) {
      next(err);
    }
  },
};
