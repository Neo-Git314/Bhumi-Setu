import { db } from '../models/db.js';

export const auditService = {
  getAll: async (filters = {}) => {
    let logs = db.getAuditLogs();
    if (filters.user) logs = logs.filter((l) => l.user.toLowerCase().includes(filters.user.toLowerCase()));
    if (filters.module) logs = logs.filter((l) => l.module.toLowerCase() === filters.module.toLowerCase());
    if (filters.role) logs = logs.filter((l) => l.role.toLowerCase() === filters.role.toLowerCase());
    return logs;
  },

  create: (entry) => {
    return db.createAuditLog(entry);
  },
};
