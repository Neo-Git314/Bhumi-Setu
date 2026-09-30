import { db } from '../models/db.js';

export const disputeService = {
  getAll: async (filters = {}) => {
    let list = db.getDisputes();
    if (filters.status) {
      list = list.filter((d) => d.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.priority) {
      list = list.filter((d) => d.priority.toLowerCase() === filters.priority.toLowerCase());
    }
    if (filters.parcelId) {
      list = list.filter((d) => d.parcelId === filters.parcelId);
    }
    return list;
  },

  getById: async (id) => {
    const dispute = db.getDisputeById(id);
    if (!dispute) {
      const err = new Error(`Dispute case "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }
    return dispute;
  },

  create: async (disputeData) => {
    return db.createDispute(disputeData);
  },

  updateStatus: async (id, status, remark = '', officerName = 'Revenue Authority') => {
    const dispute = db.updateDisputeStatus(id, status, remark);
    if (!dispute) {
      const err = new Error(`Cannot update: Dispute case "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }
    return dispute;
  },

  addEvidence: async (id, evidenceData) => {
    const dispute = db.getDisputeById(id);
    if (!dispute) {
      const err = new Error(`Dispute case "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    const doc = db.createDocument({
      ...evidenceData,
      caseId: id,
      parcelId: dispute.parcelId,
    });

    if (!dispute.evidenceIds) dispute.evidenceIds = [];
    dispute.evidenceIds.push(doc.id);

    return doc;
  },
};
