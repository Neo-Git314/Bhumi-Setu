import { auditService } from '../services/auditService.js';

export const auditController = {
  getLogs: async (req, res, next) => {
    try {
      const logs = await auditService.getAll(req.query);
      res.json({
        success: true,
        count: logs.length,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  },
};
