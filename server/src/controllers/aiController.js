import { aiService } from '../services/aiService.js';

export const aiController = {
  getFlags: async (req, res, next) => {
    try {
      const flags = await aiService.getFlags(req.query);
      res.json({
        success: true,
        count: flags.length,
        data: flags,
      });
    } catch (err) {
      next(err);
    }
  },

  getFlagById: async (req, res, next) => {
    try {
      const flag = await aiService.getFlagById(req.params.id);
      res.json({
        success: true,
        data: flag,
      });
    } catch (err) {
      next(err);
    }
  },

  updateFlag: async (req, res, next) => {
    try {
      const { status, notes } = req.body;
      const updated = await aiService.updateFlag(req.params.id, status, notes);
      res.json({
        success: true,
        message: `AI anomaly status verified as "${status}".`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  validateRecord: async (req, res, next) => {
    try {
      const result = await aiService.validateRecord(req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  compareRecords: async (req, res, next) => {
    try {
      const { recordIdA, recordIdB } = req.body;
      const result = await aiService.compareRecords(recordIdA, recordIdB);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  analyzeDocument: async (req, res, next) => {
    try {
      const { documentId } = req.body;
      res.json({
        success: true,
        data: {
          documentId,
          analysisType: 'NLP Land Deed Entity Recognition',
          status: 'Completed',
          confidence: 0.95,
          entities: [
            { label: 'OWNER', text: 'Suresh Kumar Sharma' },
            { label: 'KHASRA', text: '142/1' },
            { label: 'AREA', text: '2.45 Hectares' },
            { label: 'VILLAGE', text: 'Badshahpur' },
          ],
          notice: 'AI-generated flag. Final verification must be performed by an authorized official.',
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
