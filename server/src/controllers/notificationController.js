import { db } from '../models/db.js';

export const notificationController = {
  getAll: async (req, res, next) => {
    try {
      res.json({
        success: true,
        data: db.getNotifications(),
      });
    } catch (err) {
      next(err);
    }
  },

  markRead: async (req, res, next) => {
    try {
      const list = db.getNotifications();
      const notif = list.find((n) => n.id === req.params.id);
      if (notif) notif.read = true;
      res.json({ success: true, data: notif });
    } catch (err) {
      next(err);
    }
  },

  markAllRead: async (req, res, next) => {
    try {
      const list = db.getNotifications();
      list.forEach((n) => {
        n.read = true;
      });
      res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (err) {
      next(err);
    }
  },
};
