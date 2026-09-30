import { disputeService } from '../services/disputeService.js';

export const disputeController = {
  getAll: async (req, res, next) => {
    try {
      const disputes = await disputeService.getAll(req.query);
      res.json({
        success: true,
        count: disputes.length,
        data: disputes,
      });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const dispute = await disputeService.getById(req.params.id);
      res.json({
        success: true,
        data: dispute,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const newDispute = await disputeService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Land dispute case registered successfully.',
        data: newDispute,
      });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status, remark } = req.body;
      const officer = req.user ? req.user.name : 'Authorized Officer';
      const updated = await disputeService.updateStatus(req.params.id, status, remark, officer);
      res.json({
        success: true,
        message: `Dispute stage advanced to "${status}".`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  addEvidence: async (req, res, next) => {
    try {
      const evidence = await disputeService.addEvidence(req.params.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Evidence document attached to dispute case.',
        data: evidence,
      });
    } catch (err) {
      next(err);
    }
  },
};
