import { db } from '../models/db.js';

export const landRecordService = {
  getAll: async (filters = {}) => {
    return db.getParcels(filters);
  },

  getById: async (id) => {
    const parcel = db.getParcelById(id);
    if (!parcel) {
      const err = new Error(`Land record for ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }
    return parcel;
  },

  getHistory: async (id) => {
    const parcel = await landRecordService.getById(id);
    return parcel.history || [];
  },

  create: async (parcelData) => {
    const newParcel = {
      id: parcelData.id || `P-${Math.floor(10000 + Math.random() * 90000)}`,
      khasraNo: parcelData.khasraNo || '101/1',
      khataNo: parcelData.khataNo || 'KH-101',
      village: parcelData.village || 'Badshahpur',
      tehsil: parcelData.tehsil || 'Gurugram',
      district: parcelData.district || 'Gurugram',
      state: parcelData.state || 'Haryana',
      area: parcelData.area || '2.00 Hectares',
      landUse: parcelData.landUse || 'Agricultural',
      status: parcelData.status || 'Verified',
      ownerName: parcelData.ownerName || 'Citizen Landowner',
      coordinates: parcelData.coordinates || [28.3892, 77.0543],
      polygon: parcelData.polygon || [],
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          event: 'Initial Record Registration in Bhumi Setu',
          by: 'Revenue Authority',
        },
      ],
    };
    db.parcels.unshift(newParcel);
    return newParcel;
  },

  update: async (id, updateData) => {
    const updated = db.updateParcel(id, updateData);
    if (!updated) {
      const err = new Error(`Cannot update: Land record for ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }
    return updated;
  },
};
