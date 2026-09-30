# BHUMI SETU 360° (भूमि सेतु ३६०°)
### AI-Powered Integrated Land Governance & Decision Support Platform
**Smart India Hackathon 2024 — Problem Statement PS 26019**

---

## 🏛️ System Overview

**Bhumi Setu 360°** is a production-grade, human-designed land governance, cadastral GIS, and administrative decision-support platform designed for India's Digital India Land Records Modernization Programme (DILRMP). 

It unifies:
1. **Cadastral GIS Mapping**: Interactive GeoJSON polygon parcel boundaries, land-use zoning, and live spatial overlap collision detection.
2. **Statutory Title Registry & Mutation**: Comprehensive Jamabandi, Khasra/Khata tracking, and mutation audit history.
3. **Dispute Case Management (Grievance Redressal)**: Multi-stage quasi-judicial tribunal lifecycle from complaint to resolution.
4. **AI Decision Support Microservice**: Anomaly detection, phonetic soundex duplicate title matching, area reconciliation, and document OCR.
5. **Tamper-Evident Audit Trails**: Comprehensive government action logging for CAG and administrative accountability.

> **Statutory Notice**: All AI capabilities serve as advisory decision-support mechanisms. Statutory title modifications and quasi-judicial determinations require authorized officer concurrence.

---

## 🏗️ Architecture & Monorepo Structure

```
bhumi/
├── client/                 # Client documentation and module linkage
├── src/                    # React 19 Frontend
│   ├── components/         # Professional UI tables, badges, skeletons, modals
│   ├── pages/              # 16 Full Governance Application Pages
│   ├── layouts/            # DashboardLayout & Navigation
│   ├── services/           # API Client & Unified Data Service
│   ├── context/            # Authentication & Role State
│   └── data/               # Realistic Indian cadastral seed data
├── server/                 # Node.js + Express.js REST API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # Express REST routes
│   │   ├── services/       # Core business logic
│   │   ├── middleware/     # JWT Auth, Role checking, Audit logging
│   │   ├── models/         # Database pool & in-memory spatial engine
│   │   ├── utils/          # Pure spatial geometric algorithms & JWT
│   │   └── config/         # Postgres & JWT config
├── ai-service/             # Python FastAPI Anomaly & OCR Microservice
│   ├── app/
│   │   ├── routes/         # Validation, Comparison, OCR, NLP
│   │   ├── services/       # Levenshtein/Soundex matching, Spatial overlap
│   │   ├── models/         # Pydantic schemas
│   │   └── utils/          # Fuzzy matching & geometric algorithms
│   └── requirements.txt
├── database/               # Relational & Spatial Database Schemas
│   ├── schema.sql          # PostgreSQL + PostGIS schema with spatial indexes
│   └── seed.sql            # 32+ Land parcels, disputes, documents, audit logs
└── docs/                   # Complete System Documentation
    ├── API.md              # REST API documentation & payload examples
    └── DATABASE.md         # Database schema, PostGIS queries & ER Diagram
```

---

## 🚀 Running the System Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL 14+ with PostGIS *(Optional; system includes instant zero-config spatial in-memory store)*

### 1. Start the React Frontend
```bash
npm install
npm run dev
```
> Running on `http://localhost:5173`

### 2. Start the Node.js / Express Backend
```bash
npm run server
```
> Running on `http://localhost:5000`  
> Health endpoint: `http://localhost:5000/api/health`

### 3. Start the Python AI Microservice (Optional)
```bash
npm run ai
```
> Running on `http://localhost:8000`  
> Swagger Docs: `http://localhost:8000/docs`

---

## 🎯 SIH 2024 Presentation Demonstration Flow

For the evaluation jury, follow this synchronized end-to-end operational flow:

1. **Login & Role Authorization**:
   - Navigate to `/login`
   - Select **Shri Vikram Malhotra (Revenue Officer)** or **Suresh Kumar Sharma (Citizen)**.
2. **Officer Dashboard**:
   - Access `/officer/dashboard` to view pending verification queues, live spatial anomalies, and dispute cases.
3. **Land Record Search & Detail**:
   - Navigate to `/records` and open **Parcel P-10245** (Khasra 142/1, Badshahpur).
   - View the cadastral map, title deeds, owner history, and AI anomaly warning.
4. **Interactive GIS Map**:
   - Open `/gis-map`. Click on parcel **P-10245** and its adjacent contested plot **P-10246**.
   - Notice the visual boundary overlap warning and spatial parameters.
5. **AI Validation & Side-by-Side Comparison**:
   - Visit `/ai-validation`.
   - Inspect Alert **AI-2024-8901** (Confidence: 94.5%).
   - Open Side-by-Side Comparison between **LR-10245** and **LR-10246** to observe conflicting area and owner claims.
6. **Dispute Case Redressal**:
   - Open `/disputes/DS-2024-001`.
   - Review uploaded evidence documents (**DOC-801**, **DOC-803 Aks Shajra**, **DOC-804 DGPS Report**).
   - Advance the quasi-judicial timeline stage from `Review` to `Resolution`.
7. **Audit & Compliance Verification**:
   - Open `/audit-logs` as Revenue Officer or Auditor to verify the cryptographic record of actions.
8. **Policy & Macro Analytics**:
   - Open `/policy-insights` to review district-level dispute concentrations and land-use balance.

---

## 🔐 Security & Access Control

| Role | Access Permissions |
| :--- | :--- |
| **Citizen** | Personal applications, registered disputes, certified copy downloads, public parcel search |
| **Revenue Officer** | Title verification, mutation orders, AI anomaly reviews, dispute case hearings |
| **Survey Officer** | DGPS/Drone cadastral survey uploads, Aks Shajra digitizations, boundary verification |
| **Dispute Authority**| Quasi-judicial hearing schedule, evidence appraisal, statutory dispute resolution orders |
| **Administrator** | User role administration, system health monitoring, infrastructure configs |
| **Policymaker** | Macro district-level aggregates, land-use trends, administrative efficiency KPIs |
| **Auditor** | Immutable audit logs, session telemetry, compliance inspection |

---

## 📄 License
Government of India / Smart India Hackathon 2024 Prototype. Built for academic and demonstration purposes.
