import { analyticsService } from '../services/analyticsService.js';

export const analyticsController = {
  getOverview: async (req, res, next) => {
    try {
      const data = await analyticsService.getOverview();
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getDisputes: async (req, res, next) => {
    try {
      const data = await analyticsService.getDisputes();
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getLandUse: async (req, res, next) => {
    try {
      const data = await analyticsService.getLandUse();
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getRegional: async (req, res, next) => {
    try {
      const data = await analyticsService.getRegional();
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
