# BHUMI SETU 360° — REST API SPECIFICATION
**SIH PS 26019: AI-Powered Integrated Land Governance & Decision Support Platform**

## 1. Overview & Architecture
The Bhumi Setu 360° platform provides secure, role-authorized REST APIs following government standards (DILRMP and Digital India guidelines).

- **Base URL (Local Dev)**: `http://localhost:5000/api`
- **Authentication**: JWT Bearer Token passed via `Authorization: Bearer <token>`
- **Response Format**: Standard JSON `{ "success": boolean, "data": ... , "message": ... }`
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Error).

---

## 2. Authentication APIs

### `POST /api/auth/login`
Authenticates a registered official or citizen.
- **Request Body**:
  ```json
  {
    "email": "vikram.malhotra@gov.in",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "usr-ro-102",
        "name": "Shri Vikram Malhotra",
        "role": "REVENUE_OFFICER",
        "district": "Gurugram"
      }
    }
  }
  ```

### `GET /api/auth/me`
Retrieves currently logged in user profile based on Bearer token.
- **Headers**: `Authorization: Bearer <token>`

---

## 3. Land Records APIs

### `GET /api/land-records`
Filter and paginate through land parcels.
- **Query Params**:
  - `query`: String (search by Khasra, Owner, Village, Parcel ID)
  - `district`: Filter by district (e.g. `Gurugram`, `Faridabad`)
  - `tehsil`: Filter by tehsil
  - `village`: Filter by village name
  - `landUse`: Filter by category (`Agricultural`, `Commercial`, `Residential`, `Industrial`, `Forest`)
  - `status`: Filter by status (`Verified`, `Under Dispute`, `Pending Survey`, etc.)

### `GET /api/land-records/:id`
Retrieves full details of a specific parcel including boundaries, owner metadata, and dispute links.

### `GET /api/land-records/:id/history`
Returns chronological mutation audit trail for the parcel.

### `POST /api/land-records`
Creates a new land record. *(Requires `REVENUE_OFFICER` or `ADMIN` role)*.

### `PUT /api/land-records/:id`
Updates land record attributes or verification status. *(Requires `REVENUE_OFFICER` or `ADMIN` role)*.

---

## 4. GIS & Spatial APIs

### `GET /api/gis/parcels`
Returns a GeoJSON `FeatureCollection` of all cadastral parcels with geometric polygon boundaries and revenue properties.

### `GET /api/gis/parcels/:id`
Returns a single GeoJSON `Feature`.

### `GET /api/gis/layers`
Returns available statutory map overlays (Cadastral, Revenue village boundaries, Dispute hotspots, Master plan zoning).

### `GET /api/gis/nearby`
Returns parcels within a geographic radius.
- **Query Params**: `lat`, `lng`, `radius` (in meters, default 5000).

### `POST /api/gis/check-overlap`
Calculates spatial collision and intersection area between two cadastral geometries.
- **Request Body**:
  ```json
  {
    "parcelA": "P-10245",
    "parcelB": "P-10246"
  }
  ```

### `POST /api/gis/calculate-area`
Calculates geodesic area in Square Meters, Hectares, and Acres from polygon coordinates.

---

## 5. Dispute Case Management APIs

### `GET /api/disputes`
Retrieves all dispute cases. Supports filtering by `status`, `priority`, and `parcelId`.

### `GET /api/disputes/:id`
Retrieves complete dispute dossier: case header, applicant/respondent, parcel links, timeline stages, evidence documents, and conflicting fields.

### `POST /api/disputes`
Registers a new land grievance/dispute case. Automatically updates the linked parcel status to `Under Dispute` and logs an audit trail.

### `PUT /api/disputes/:id/status`
Advances dispute lifecycle (`Complaint` → `Verification` → `Evidence Collection` → `Review` → `Resolution` → `Closed`).
*(Requires `REVENUE_OFFICER`, `DISPUTE_AUTHORITY`, or `ADMIN`)*.

### `POST /api/disputes/:id/evidence`
Attaches supporting evidence documents to an ongoing dispute.

---

## 6. Document & Evidence AI APIs

### `POST /api/documents/upload`
Uploads evidence document (PDF, PNG, JPG). Computes SHA-256 hash and creates indexed metadata.

### `GET /api/documents`
Lists documents with filters (`parcelId`, `caseId`, `category`).

### `GET /api/documents/:id/versions`
Retrieves version history and audit stamps.

### `GET /api/documents/:id/extract-fields`
Runs OCR and NLP pipeline to extract structured fields (Owner, Khasra, Area, Village, Registration No) with confidence ratings.

---

## 7. AI Anomaly & Validation APIs

> **Statutory Notice**: All AI endpoints return advisory decision-support signals. Final legal verification must be performed by an authorized revenue official.

### `GET /api/ai/flags`
Returns all detected anomalies (Duplicate entries, Spatial overlaps, Area discrepancies, Title conflicts).

### `PUT /api/ai/flags/:id`
Official verification of an AI flag (`Verified`, `Dismissed`, `Investigating`).

### `POST /api/ai/validate-record`
Validates a land record against existing database to detect duplicates, missing fields, or geometric errors.

### `POST /api/ai/compare-records`
Performs side-by-side comparison between two contested land records, highlighting conflicting attributes and confidence metrics.

---

## 8. Analytics & Policy APIs

### `GET /api/analytics/overview`
High-level KPIs calculated dynamically from database records.

### `GET /api/analytics/disputes`
Breakdown of disputes by category.

### `GET /api/analytics/land-use`
Distribution of land parcels across functional land uses.

### `GET /api/analytics/regional`
Regional district-level performance and dispute concentration.

---

## 9. Government Compliance & Audit Logs

### `GET /api/audit-logs`
Returns tamper-evident audit logs including timestamp, user, role, action, module, record ID, IP session, and execution status.
*(Requires `AUDITOR`, `ADMIN`, or `REVENUE_OFFICER`)*.
