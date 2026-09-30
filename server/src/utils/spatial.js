// GIS Spatial Utility Functions (pure geometric calculation compatible with PostGIS principles)

// 1. Haversine distance in meters
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// 2. Point in Polygon (Ray-Casting Algorithm)
export function isPointInPolygon(point, polygonCoords) {
  const [x, y] = point; // [lng, lat]
  let inside = false;

  for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
    const xi = polygonCoords[i][0],
      yi = polygonCoords[i][1];
    const xj = polygonCoords[j][0],
      yj = polygonCoords[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

// 3. Polygon Bounding Box
export function getPolygonBBox(polygonCoords) {
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;

  for (const [lng, lat] of polygonCoords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  return { minLng, maxLng, minLat, maxLat };
}

// 4. Check BBox Overlap
export function bboxesOverlap(boxA, boxB) {
  return !(
    boxA.maxLng < boxB.minLng ||
    boxA.minLng > boxB.maxLng ||
    boxA.maxLat < boxB.minLat ||
    boxA.minLat > boxB.maxLat
  );
}

// 5. Calculate approximate Polygon Area in square meters (Geodesic Shoelace projection)
export function calculatePolygonAreaSqMeters(coords) {
  if (!coords || coords.length < 3) return 0;
  let total = 0;
  const numPoints = coords.length;
  const radius = 6378137; // WGS84 major radius

  for (let i = 0; i < numPoints; i++) {
    const lower = coords[i];
    const middle = coords[(i + 1) % numPoints];
    const upper = coords[(i + 2) % numPoints];

    const p1Lat = (lower[1] * Math.PI) / 180;
    const p2Lat = (middle[1] * Math.PI) / 180;
    const p3Lat = (upper[1] * Math.PI) / 180;

    const p1Lng = (lower[0] * Math.PI) / 180;
    const p3Lng = (upper[0] * Math.PI) / 180;

    total += (p3Lng - p1Lng) * Math.sin(p2Lat);
  }

  const area = Math.abs((total * radius * radius) / 2);
  return Math.round(area * 100) / 100;
}
