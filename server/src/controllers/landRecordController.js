import { landRecordService } from '../services/landRecordService.js';

export const landRecordController = {
  getAll: async (req, res, next) => {
    try {
      const records = await landRecordService.getAll(req.query);
      res.json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const record = await landRecordService.getById(req.params.id);
      res.json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const history = await landRecordService.getHistory(req.params.id);
      res.json({
        success: true,
        parcelId: req.params.id,
        count: history.length,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const record = await landRecordService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Land record created successfully.',
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await landRecordService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Land record updated successfully.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
};
