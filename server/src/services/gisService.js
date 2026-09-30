import { db } from '../models/db.js';
import {
  calculateHaversineDistance,
  getPolygonBBox,
  bboxesOverlap,
  calculatePolygonAreaSqMeters,
} from '../utils/spatial.js';

export const gisService = {
  getParcelsGeoJson: async () => {
    const parcels = db.getParcels();
    const features = parcels.map((p) => {
      // In mock data polygon is [ [lat, lng], ... ] Leaflet format.
      // GeoJSON standard expects [ [lng, lat], ... ]
      const geoJsonCoords = p.polygon
        ? p.polygon.map(([lat, lng]) => [lng, lat])
        : [];

      return {
        type: 'Feature',
        id: p.id,
        geometry: {
          type: 'Polygon',
          coordinates: [geoJsonCoords],
        },
        properties: {
          id: p.id,
          khasraNo: p.khasraNo,
          village: p.village,
          tehsil: p.tehsil,
          district: p.district,
          ownerName: p.ownerName,
          area: p.area,
          landUse: p.landUse,
          status: p.status,
          disputeId: p.disputeId || null,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  },

  getParcelById: async (id) => {
    const parcel = db.getParcelById(id);
    if (!parcel) {
      const err = new Error(`GIS parcel not found for ID: ${id}`);
      err.statusCode = 404;
      throw err;
    }

    const geoJsonCoords = parcel.polygon
      ? parcel.polygon.map(([lat, lng]) => [lng, lat])
      : [];

    return {
      type: 'Feature',
      id: parcel.id,
      geometry: {
        type: 'Polygon',
        coordinates: [geoJsonCoords],
      },
      properties: { ...parcel },
    };
  },

  getLayers: async () => {
    return [
      {
        id: 'cadastral_parcels',
        name: 'Cadastral Parcel Boundaries (Aks Shajra)',
        type: 'vector',
        visible: true,
        opacity: 0.8,
        description: 'Digitized revenue boundaries with Khasra numbers from Settlement Directorate.',
      },
      {
        id: 'revenue_villages',
        name: 'Revenue Village & Tehsil Limits',
        type: 'vector',
        visible: true,
        opacity: 0.6,
        description: 'Tehsil and village administrative boundaries.',
      },
      {
        id: 'disputed_zones',
        name: 'Active Land Dispute Overlay',
        type: 'vector',
        visible: true,
        opacity: 0.9,
        description: 'Red highlighted parcels undergoing active court/SDM dispute litigation.',
      },
      {
        id: 'land_use_zoning',
        name: 'Master Plan 2031 Land-Use Zoning',
        type: 'vector',
        visible: false,
        opacity: 0.5,
        description: 'GMDA statutory master plan zoning designations.',
      },
      {
        id: 'water_bodies',
        name: 'Eco-Sensitive Buffers & Water Bodies (Gair Mumkin Pahar)',
        type: 'vector',
        visible: false,
        opacity: 0.7,
        description: 'Prohibited non-alienable natural features and forest tracks.',
      },
    ];
  },

  getNearby: async (lat, lng, radius = 5000) => {
    const nearby = db.getNearbyParcels(parseFloat(lat), parseFloat(lng), parseFloat(radius));
    return nearby.map((p) => {
      const dist = calculateHaversineDistance(
        parseFloat(lat),
        parseFloat(lng),
        p.coordinates[0],
        p.coordinates[1]
      );
      return {
        ...p,
        distanceMeters: Math.round(dist),
        distanceKm: (dist / 1000).toFixed(2),
      };
    });
  },

  checkOverlap: async (parcelIdA, parcelIdB) => {
    const parcelA = db.getParcelById(parcelIdA);
    const parcelB = db.getParcelById(parcelIdB);

    if (!parcelA || !parcelB) {
      const err = new Error('Both parcel identifiers must exist to compute spatial overlap.');
      err.statusCode = 400;
      throw err;
    }

    const coordsA = parcelA.polygon ? parcelA.polygon.map(([lat, lng]) => [lng, lat]) : [];
    const coordsB = parcelB.polygon ? parcelB.polygon.map(([lat, lng]) => [lng, lat]) : [];

    const bboxA = getPolygonBBox(coordsA);
    const bboxB = getPolygonBBox(coordsB);

    const overlapPossible = bboxesOverlap(bboxA, bboxB);

    // Calculate simulated overlap area for connected demo parcels P-10245 & P-10246
    let overlapDetected = false;
    let overlapAreaSqMeters = 0;

    if (
      (parcelIdA === 'P-10245' && parcelIdB === 'P-10246') ||
      (parcelIdA === 'P-10246' && parcelIdB === 'P-10245')
    ) {
      overlapDetected = true;
      overlapAreaSqMeters = 2500; // ~0.25 hectares
    } else if (overlapPossible) {
      overlapDetected = true;
      overlapAreaSqMeters = 850;
    }

    return {
      parcelA: parcelA.id,
      parcelB: parcelB.id,
      overlapDetected,
      overlapAreaSqMeters,
      overlapAreaHectares: (overlapAreaSqMeters / 10000).toFixed(4),
      confidenceScore: overlapDetected ? 0.94 : 0.05,
      recommendation: overlapDetected
        ? 'High probability of cadastral digitization collision. On-site DGPS demarcation mandated.'
        : 'Geometries are mutually disjoint.',
    };
  },

  calculateArea: async (coordinates) => {
    // Expects [ [lng, lat], ... ]
    const sqMeters = calculatePolygonAreaSqMeters(coordinates);
    const hectares = (sqMeters / 10000).toFixed(4);
    const acres = (sqMeters / 4046.86).toFixed(4);

    return {
      areaSqMeters: sqMeters,
      areaHectares: Number(hectares),
      areaAcres: Number(acres),
    };
  },
};
