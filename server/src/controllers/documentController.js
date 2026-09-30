import { documentService } from '../services/documentService.js';

export const documentController = {
  getAll: async (req, res, next) => {
    try {
      const docs = await documentService.getAll(req.query);
      res.json({
        success: true,
        count: docs.length,
        data: docs,
      });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const doc = await documentService.getById(req.params.id);
      res.json({
        success: true,
        data: doc,
      });
    } catch (err) {
      next(err);
    }
  },

  getVersions: async (req, res, next) => {
    try {
      const versions = await documentService.getVersions(req.params.id);
      res.json({
        success: true,
        data: versions,
      });
    } catch (err) {
      next(err);
    }
  },

  upload: async (req, res, next) => {
    try {
      const docData = {
        title: req.body.title || 'Submitted Document',
        category: req.body.category || 'Dispute Evidence',
        parcelId: req.body.parcelId,
        caseId: req.body.caseId,
        fileType: req.file ? req.file.mimetype.split('/')[1].toUpperCase() : (req.body.fileType || 'PDF'),
        fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB',
        uploadedBy: req.user ? req.user.name : (req.body.uploadedBy || 'Portal User'),
        summary: req.body.summary || 'Supporting land governance document.',
      };

      const newDoc = await documentService.upload(docData);
      res.status(201).json({
        success: true,
        message: 'Document stored and indexed in digital repository.',
        data: newDoc,
      });
    } catch (err) {
      next(err);
    }
  },

  extractFields: async (req, res, next) => {
    try {
      const extracted = await documentService.extractFields(req.params.id);
      res.json({
        success: true,
        data: extracted,
      });
    } catch (err) {
      next(err);
    }
  },
};
