import { db } from '../models/db.js';

export const aiService = {
  getFlags: async (filters = {}) => {
    let list = db.getAiFlags();
    if (filters.status) list = list.filter((f) => f.status.toLowerCase() === filters.status.toLowerCase());
    if (filters.severity) list = list.filter((f) => f.severity.toLowerCase() === filters.severity.toLowerCase());
    return list;
  },

  getFlagById: async (id) => {
    const flag = db.getAiFlagById(id);
    if (!flag) {
      const err = new Error(`AI Flag "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }
    return flag;
  },

  updateFlag: async (id, status, officerNotes = '') => {
    const updated = db.updateAiFlagStatus(id, status, officerNotes);
    if (!updated) {
      const err = new Error(`AI Flag "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    // If verified by officer, ensure parcel reflects resolved state
    if (status === 'Verified' && updated.parcelId) {
      db.updateParcel(updated.parcelId, { status: 'Verified' });
    }

    return updated;
  },

  validateRecord: async (record) => {
    const parcels = db.getParcels();
    const anomalies = [];

    // 1. Missing Field Detection
    if (!record.ownerName) {
      anomalies.push({
        type: 'Missing Data',
        field: 'ownerName',
        severity: 'Critical',
        explanation: 'Mandatory titleholder name is missing from record.',
      });
    }
    if (!record.area) {
      anomalies.push({
        type: 'Missing Data',
        field: 'area',
        severity: 'High',
        explanation: 'Cadastral parcel area declaration is missing.',
      });
    }

    // 2. Duplicate / Khasra Conflict Check
    const matchedKhasra = parcels.filter(
      (p) =>
        p.id !== record.id &&
        p.khasraNo === record.khasraNo &&
        p.village.toLowerCase() === (record.village || '').toLowerCase()
    );

    if (matchedKhasra.length > 0) {
      anomalies.push({
        type: 'Duplicate / Collision',
        severity: 'Critical',
        matchedRecordId: matchedKhasra[0].id,
        explanation: `Khasra number ${record.khasraNo} in village ${record.village} already exists under titleholder "${matchedKhasra[0].ownerName}".`,
        confidence: 0.94,
      });
    }

    return {
      isValid: anomalies.length === 0,
      anomaliesCount: anomalies.length,
      anomalies,
      notice: 'AI-generated flag. Final verification must be performed by an authorized official.',
      validationTimestamp: new Date().toISOString(),
    };
  },

  compareRecords: async (recordIdA, recordIdB) => {
    const parcelA = db.getParcelById(recordIdA);
    const parcelB = db.getParcelById(recordIdB);

    if (!parcelA || !parcelB) {
      const err = new Error('Both record identifiers must be provided and valid for comparison.');
      err.statusCode = 400;
      throw err;
    }

    const differences = [];

    const checkField = (fieldName, valA, valB, severity = 'Medium') => {
      if (valA !== valB) {
        differences.push({
          field: fieldName,
          recordA: valA || 'N/A',
          recordB: valB || 'N/A',
          match: false,
          severity,
        });
      } else {
        differences.push({
          field: fieldName,
          recordA: valA,
          recordB: valB,
          match: true,
          severity: 'None',
        });
      }
    };

    checkField('Owner Name', parcelA.ownerName, parcelB.ownerName, 'Critical');
    checkField('Khasra Number', parcelA.khasraNo, parcelB.khasraNo, 'Critical');
    checkField('Parcel Area', parcelA.area, parcelB.area, 'High');
    checkField('Land Use', parcelA.landUse, parcelB.landUse, 'Medium');
    checkField('Village', parcelA.village, parcelB.village, 'High');
    checkField('Registration Number', parcelA.registrationNo, parcelB.registrationNo, 'High');
    checkField('Mutation Number', parcelA.mutationNo, parcelB.mutationNo, 'High');

    const hasInconsistency = differences.some((d) => !d.match);

    return {
      recordA: parcelA,
      recordB: parcelB,
      differences,
      hasInconsistency,
      summary: hasInconsistency
        ? `Potential inconsistency detected across ${differences.filter((d) => !d.match).length} attributes between ${recordIdA} and ${recordIdB}.`
        : 'All core cadastral and title attributes match perfectly.',
      recommendation:
        'AI flag generated for administrative scrutiny. System does not automatically modify statutory revenue titles.',
      notice: 'AI-generated flag. Final verification must be performed by an authorized official.',
    };
  },
};
