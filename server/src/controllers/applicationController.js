import { db } from '../models/db.js';

export const applicationController = {
  getAll: async (req, res, next) => {
    try {
      let apps = db.getApplications();
      if (req.query.applicant) {
        apps = apps.filter((a) => a.applicantName.toLowerCase().includes(req.query.applicant.toLowerCase()));
      }
      if (req.query.status) {
        apps = apps.filter((a) => a.status.toLowerCase() === req.query.status.toLowerCase());
      }
      res.json({
        success: true,
        count: apps.length,
        data: apps,
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const app = db.createApplication({
        ...req.body,
        applicantName: req.user ? req.user.name : (req.body.applicantName || 'Citizen Applicant'),
      });
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        data: app,
      });
    } catch (err) {
      next(err);
    }
  },
};
