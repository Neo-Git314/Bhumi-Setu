// BHUMI SETU 360° - Data Store & LocalStorage Persistence Service
import {
  INITIAL_PARCELS,
  INITIAL_DISPUTES,
  INITIAL_AI_ALERTS,
  INITIAL_DOCUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DISTRICT_ANALYTICS,
  MONTHLY_TRENDS,
  DISPUTE_CATEGORIES_DATA,
  LAND_USE_DATA,
  USER_ROLES,
} from '../data/mockData';

const STORAGE_KEYS = {
  PARCELS: 'bhumi_parcels_v1',
  DISPUTES: 'bhumi_disputes_v1',
  AI_ALERTS: 'bhumi_ai_alerts_v1',
  DOCUMENTS: 'bhumi_documents_v1',
  APPLICATIONS: 'bhumi_applications_v1',
  AUDIT_LOGS: 'bhumi_audit_logs_v1',
  NOTIFICATIONS: 'bhumi_notifications_v1',
};

// Helper: Dispatch global update event for reactive components
const notifyDataChanged = (dataType) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bhumi_data_changed', { detail: { dataType } }));
  }
};

// Initialize default storage safely
function getStoredItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// 1. LAND RECORD SERVICE
export const landRecordService = {
  getAll: () => getStoredItem(STORAGE_KEYS.PARCELS, INITIAL_PARCELS),

  getById: (id) => {
    const parcels = landRecordService.getAll();
    return parcels.find((p) => p.id === id || p.khasraNo === id);
  },

  search: ({ query = '', district = '', tehsil = '', village = '', landUse = '', status = '' }) => {
    let list = landRecordService.getAll();

    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.khasraNo.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q) ||
          p.surveyNo.toLowerCase().includes(q)
      );
    }
    if (district) {
      list = list.filter((p) => p.district.toLowerCase() === district.toLowerCase());
    }
    if (tehsil) {
      list = list.filter((p) => p.tehsil.toLowerCase() === tehsil.toLowerCase());
    }
    if (village) {
      list = list.filter((p) => p.village.toLowerCase().includes(village.toLowerCase()));
    }
    if (landUse) {
      list = list.filter((p) => p.landUse.toLowerCase() === landUse.toLowerCase());
    }
    if (status) {
      list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    return list;
  },

  updateStatus: (id, newStatus, eventRemark = 'Status updated by officer') => {
    const parcels = landRecordService.getAll();
    const updated = parcels.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0],
          history: [
            {
              date: new Date().toISOString().split('T')[0],
              event: eventRemark,
              by: 'Revenue Authority',
            },
            ...p.history,
          ],
        };
      }
      return p;
    });
    setStoredItem(STORAGE_KEYS.PARCELS, updated);
    notifyDataChanged('parcels');
    return updated.find((p) => p.id === id);
  },
};

// 2. DISPUTE MANAGEMENT SERVICE
export const disputeService = {
  getAll: () => getStoredItem(STORAGE_KEYS.DISPUTES, INITIAL_DISPUTES),

  getById: (id) => {
    const disputes = disputeService.getAll();
    return disputes.find((d) => d.id === id);
  },

  create: (newDisputeData) => {
    const disputes = disputeService.getAll();
    const newId = `DS-2024-${String(disputes.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newDispute = {
      id: newId,
      parcelId: newDisputeData.parcelId || 'P-10245',
      secondaryParcelId: newDisputeData.secondaryParcelId || '',
      title: newDisputeData.title || 'New Land Grievance / Boundary Dispute',
      category: newDisputeData.category || 'Boundary Dispute',
      applicant: newDisputeData.applicant || 'Citizen Applicant',
      applicantPhone: newDisputeData.applicantPhone || '+91 98000 00000',
      respondent: newDisputeData.respondent || 'Concerned Party',
      respondentPhone: newDisputeData.respondentPhone || '+91 98000 00001',
      assignedOfficer: 'Shri Vikram Malhotra (Revenue Officer)',
      officerDesignation: 'SDM Gurugram',
      priority: newDisputeData.priority || 'Medium',
      status: 'Complaint',
      filingDate: today,
      lastUpdated: today,
      description: newDisputeData.description || 'Dispute submitted via Bhumi Setu platform for formal verification.',
      location: newDisputeData.location || 'Gurugram District',
      conflictingFields: newDisputeData.conflictingFields || [
        { field: 'Claimed Rights', recordA: 'Registered Deed Claim', recordB: 'Possession / Boundary Claim' },
      ],
      timeline: [
        { step: 'Complaint Submitted', date: today, completed: true, remark: 'Initial complaint filed and assigned.' },
        { step: 'Verification', date: '', completed: false, remark: 'Awaiting field revenue inspection.' },
        { step: 'Evidence Collection', date: '', completed: false, remark: 'Parties summoned for records submission.' },
        { step: 'Officer Review', date: '', completed: false, remark: 'Tribunal examination.' },
        { step: 'Resolution', date: '', completed: false, remark: 'Formal order.' },
        { step: 'Closure', date: '', completed: false, remark: 'Record synchronized.' },
      ],
      evidenceIds: newDisputeData.evidenceIds || ['DOC-801'],
    };

    const updated = [newDispute, ...disputes];
    setStoredItem(STORAGE_KEYS.DISPUTES, updated);

    // Update parcel status to Under Dispute
    if (newDispute.parcelId) {
      landRecordService.updateStatus(newDispute.parcelId, 'Under Dispute', `Dispute registered (${newId})`);
    }

    // Add Audit Log
    auditService.log({
      user: newDispute.applicant,
      role: USER_ROLES.CITIZEN,
      action: `Registered Dispute ${newId}`,
      module: 'Dispute Management',
      recordId: newId,
      status: 'Success',
      details: `New dispute registered for parcel ${newDispute.parcelId}`,
    });

    notifyDataChanged('disputes');
    return newDispute;
  },

  updateStatus: (id, newStatus, remark = '') => {
    const disputes = disputeService.getAll();
    const today = new Date().toISOString().split('T')[0];

    const stages = ['Complaint', 'Verification', 'Evidence Collection', 'Review', 'Resolution', 'Closed'];
    const currentStageIndex = stages.indexOf(newStatus);

    const updated = disputes.map((d) => {
      if (d.id === id) {
        const updatedTimeline = d.timeline.map((step) => {
          const stepIndex = stages.findIndex((s) => s.toLowerCase().includes(step.step.toLowerCase().slice(0, 4)));
          if (stepIndex <= currentStageIndex) {
            return {
              ...step,
              completed: true,
              date: step.date || today,
              remark: step.remark || (remark && stepIndex === currentStageIndex ? remark : 'Completed by authority'),
            };
          }
          return step;
        });

        return {
          ...d,
          status: newStatus,
          lastUpdated: today,
          timeline: updatedTimeline,
        };
      }
      return d;
    });

    setStoredItem(STORAGE_KEYS.DISPUTES, updated);

    // Add Audit Log
    auditService.log({
      user: 'Shri Vikram Malhotra',
      role: USER_ROLES.REVENUE_OFFICER,
      action: `Updated Dispute Status to ${newStatus}`,
      module: 'Dispute Management',
      recordId: id,
      status: 'Success',
      details: remark || `Advanced stage of case ${id} to ${newStatus}`,
    });

    // Notify
    notificationService.add({
      title: `Case #${id} Advanced to ${newStatus}`,
      message: `The case status has been officially updated to "${newStatus}". ${remark ? `Note: ${remark}` : ''}`,
      type: 'info',
      link: `/disputes/${id}`,
      role: [USER_ROLES.CITIZEN, USER_ROLES.REVENUE_OFFICER, USER_ROLES.DISPUTE_AUTHORITY],
    });

    notifyDataChanged('disputes');
    return updated.find((d) => d.id === id);
  },
};

// 3. AI DATA VALIDATION SERVICE
export const aiValidationService = {
  getAll: () => getStoredItem(STORAGE_KEYS.AI_ALERTS, INITIAL_AI_ALERTS),

  getById: (id) => {
    const alerts = aiValidationService.getAll();
    return alerts.find((a) => a.id === id);
  },

  updateStatus: (id, status, officerNotes = '') => {
    const alerts = aiValidationService.getAll();
    const updated = alerts.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status, // 'Verified', 'Dismissed', 'Pending Review'
          reviewedAt: new Date().toISOString().split('T')[0],
          officerNotes,
        };
      }
      return a;
    });
    setStoredItem(STORAGE_KEYS.AI_ALERTS, updated);

    // If verified, ensure parcel reflects this or audit
    const alert = alerts.find((a) => a.id === id);
    if (alert && status === 'Verified' && alert.parcelId) {
      landRecordService.updateStatus(alert.parcelId, 'Verified', `AI flag verified and resolved by Revenue Officer.`);
    }

    auditService.log({
      user: 'Shri Vikram Malhotra',
      role: USER_ROLES.REVENUE_OFFICER,
      action: `Marked AI Alert ${id} as ${status}`,
      module: 'AI Validation',
      recordId: id,
      status: 'Success',
      details: officerNotes || `Human verification performed on AI anomaly flag ${id}.`,
    });

    notifyDataChanged('ai_alerts');
    return updated.find((a) => a.id === id);
  },
};

// 4. DOCUMENT & EVIDENCE SERVICE
export const documentService = {
  getAll: () => getStoredItem(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS),

  getById: (id) => {
    const docs = documentService.getAll();
    return docs.find((d) => d.id === id);
  },

  getByParcel: (parcelId) => {
    const docs = documentService.getAll();
    return docs.filter((d) => d.parcelId === parcelId);
  },

  getByCase: (caseId) => {
    const docs = documentService.getAll();
    return docs.filter((d) => d.caseId === caseId);
  },

  upload: (docData) => {
    const docs = documentService.getAll();
    const newId = `DOC-${String(800 + docs.length + 1)}`;
    const today = new Date().toISOString().split('T')[0];

    const newDoc = {
      id: newId,
      title: docData.title || 'Uploaded Document',
      category: docData.category || 'Dispute Evidence',
      parcelId: docData.parcelId || 'P-10245',
      caseId: docData.caseId || '',
      fileType: docData.fileType || 'PDF',
      fileSize: docData.fileSize || '2.4 MB',
      uploadDate: today,
      uploadedBy: docData.uploadedBy || 'Current User',
      verificationStatus: 'Pending',
      version: '1.0',
      hash: '0x' + Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2) + 'a1b2c3d4',
      summary: docData.summary || 'Supporting land governance document uploaded to Bhumi Setu repository.',
    };

    const updated = [newDoc, ...docs];
    setStoredItem(STORAGE_KEYS.DOCUMENTS, updated);

    auditService.log({
      user: newDoc.uploadedBy,
      role: USER_ROLES.CITIZEN,
      action: `Uploaded Document ${newId} (${newDoc.category})`,
      module: 'Evidence Management',
      recordId: newId,
      status: 'Success',
      details: `Hash: ${newDoc.hash.slice(0, 16)}...`,
    });

    notifyDataChanged('documents');
    return newDoc;
  },
};

// 5. APPLICATION SERVICE
export const applicationService = {
  getAll: () => getStoredItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS),

  submit: (appData) => {
    const apps = applicationService.getAll();
    const newId = `APP-2024-${String(100 + apps.length + 1)}`;
    const today = new Date().toISOString().split('T')[0];

    const newApp = {
      id: newId,
      type: appData.type || 'Boundary Demarcation (Nishandehi)',
      parcelId: appData.parcelId || 'P-10245',
      khasraNo: appData.khasraNo || '142/1',
      applicantName: appData.applicantName || 'Citizen Applicant',
      applicantPhone: appData.applicantPhone || '+91 98100 00000',
      submissionDate: today,
      status: 'Submitted',
      assignedOfficer: 'Revenue Inspection Cell',
      feesPaid: appData.feesPaid || 500,
      village: appData.village || 'Badshahpur',
      district: appData.district || 'Gurugram',
      stage: 'Application Acknowledged & In Queue',
    };

    const updated = [newApp, ...apps];
    setStoredItem(STORAGE_KEYS.APPLICATIONS, updated);

    auditService.log({
      user: newApp.applicantName,
      role: USER_ROLES.CITIZEN,
      action: `Submitted Application ${newId} (${newApp.type})`,
      module: 'Citizen Portal',
      recordId: newId,
      status: 'Success',
      details: `Fees Paid: ₹${newApp.feesPaid}`,
    });

    notifyDataChanged('applications');
    return newApp;
  },
};

// 6. AUDIT SERVICE
export const auditService = {
  getAll: () => getStoredItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),

  log: ({ user, role, action, module, recordId, status = 'Success', details = '' }) => {
    const logs = auditService.getAll();
    const newId = `AUD-${String(9900 + logs.length + 1)}`;
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

    const newEntry = {
      id: newId,
      timestamp,
      user,
      role,
      action,
      module,
      recordId,
      ipSession: '10.14.88.23 [NIC-SECURE-SESSION]',
      status,
      details,
    };

    const updated = [newEntry, ...logs];
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, updated);
    notifyDataChanged('audit_logs');
    return newEntry;
  },
};

// 7. NOTIFICATION SERVICE
export const notificationService = {
  getAll: () => getStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),

  markAsRead: (id) => {
    const list = notificationService.getAll();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyDataChanged('notifications');
  },

  markAllAsRead: () => {
    const list = notificationService.getAll();
    const updated = list.map((n) => ({ ...n, read: true }));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyDataChanged('notifications');
  },

  add: (notif) => {
    const list = notificationService.getAll();
    const newNotif = {
      id: `NOTIF-${list.length + 1}`,
      time: 'Just now',
      read: false,
      ...notif,
    };
    const updated = [newNotif, ...list];
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyDataChanged('notifications');
    return newNotif;
  },
};

// 8. STATS & ANALYTICS HELPER
export const statsService = {
  getOverviewStats: () => {
    const parcels = landRecordService.getAll();
    const disputes = disputeService.getAll();
    const aiAlerts = aiValidationService.getAll();
    const applications = applicationService.getAll();

    const activeDisputes = disputes.filter((d) => d.status !== 'Closed').length;
    const pendingApps = applications.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length;
    const aiIssues = aiAlerts.filter((a) => a.status === 'Pending Review').length;
    const verifiedParcels = parcels.filter((p) => p.status === 'Verified').length;

    return {
      totalRecords: parcels.length + 48520, // Scaled for realism + mock
      parcelsCount: parcels.length,
      pendingApplications: pendingApps + 184,
      activeDisputes: activeDisputes + 138,
      dataQualityIssues: aiIssues,
      recordsVerified: verifiedParcels + 42100,
      accuracyRate: '98.4%',
      avgResolutionDays: 14,
    };
  },

  getDistrictAnalytics: () => DISTRICT_ANALYTICS,
  getMonthlyTrends: () => MONTHLY_TRENDS,
  getDisputeCategories: () => DISPUTE_CATEGORIES_DATA,
  getLandUseDistribution: () => LAND_USE_DATA,
};

// Reset to initial demo seed anytime
export const resetDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(INITIAL_PARCELS));
  localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(INITIAL_DISPUTES));
  localStorage.setItem(STORAGE_KEYS.AI_ALERTS, JSON.stringify(INITIAL_AI_ALERTS));
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  notifyDataChanged('all');
};
