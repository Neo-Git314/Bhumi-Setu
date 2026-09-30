-- ==============================================================================
-- BHUMI SETU 360° - SIH PS 26019: Integrated Land Governance Platform
-- PostgreSQL 14+ with PostGIS Extension Schema Definition
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'CITIZEN',
        'REVENUE_OFFICER',
        'SURVEY_OFFICER',
        'DISPUTE_AUTHORITY',
        'ADMIN',
        'POLICYMAKER',
        'AUDITOR'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_status_enum AS ENUM (
        'Complaint',
        'Verification',
        'Evidence Collection',
        'Review',
        'Resolution',
        'Closed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_priority_enum AS ENUM (
        'High',
        'Medium',
        'Low',
        'Critical'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parcel_status_enum AS ENUM (
        'Verified',
        'Under Dispute',
        'Pending Survey',
        'Mutation In Progress',
        'Flagged Inconsistent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ai_flag_status_enum AS ENUM (
        'Pending Review',
        'Verified',
        'Dismissed',
        'Investigating'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS & ROLES
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name user_role_enum NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    role user_role_enum NOT NULL,
    designation VARCHAR(255),
    department VARCHAR(255),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Haryana',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. LAND PARCELS & GIS
CREATE TABLE IF NOT EXISTS land_parcels (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'P-10245'
    parcel_id VARCHAR(64) NOT NULL UNIQUE,
    khasra_number VARCHAR(64) NOT NULL,
    khata_number VARCHAR(64),
    village VARCHAR(100) NOT NULL,
    tehsil VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Haryana',
    area_hectares NUMERIC(10, 4) NOT NULL,
    area_sq_meters NUMERIC(12, 2) NOT NULL,
    land_use VARCHAR(100) NOT NULL, -- 'Agricultural', 'Commercial', 'Residential', 'Industrial', 'Forest'
    soil_type VARCHAR(100),
    status parcel_status_enum DEFAULT 'Verified',
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    boundary_geojson JSONB NOT NULL,
    geometry GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_land_parcels_khasra ON land_parcels(khasra_number);
CREATE INDEX IF NOT EXISTS idx_land_parcels_district ON land_parcels(district);
CREATE INDEX IF NOT EXISTS idx_land_parcels_village ON land_parcels(village);
CREATE INDEX IF NOT EXISTS idx_land_parcels_status ON land_parcels(status);
CREATE INDEX IF NOT EXISTS idx_land_parcels_geom ON land_parcels USING GIST(geometry);

-- 5. LAND OWNERS
CREATE TABLE IF NOT EXISTS land_owners (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aadhaar_masked VARCHAR(32),
    father_or_husband_name VARCHAR(255),
    contact_number VARCHAR(32),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. LAND RECORDS (CURRENT TITLE/MUTATION RECORD)
CREATE TABLE IF NOT EXISTS land_records (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'LR-10245'
    parcel_id VARCHAR(64) NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    owner_id VARCHAR(64) REFERENCES land_owners(id) ON DELETE SET NULL,
    owner_name VARCHAR(255) NOT NULL,
    co_owners JSONB DEFAULT '[]'::jsonb,
    ownership_type VARCHAR(64) DEFAULT 'Sole Ownership', -- 'Sole Ownership', 'Joint/Ancestral', 'Leasehold'
    ownership_share VARCHAR(32) DEFAULT '100%',
    mutation_number VARCHAR(64),
    mutation_date DATE,
    registration_number VARCHAR(64),
    registration_date DATE,
    sub_registrar_office VARCHAR(255),
    encumbrance_status VARCHAR(100) DEFAULT 'Nil (Clean Title)',
    tax_assessment_status VARCHAR(64) DEFAULT 'Paid Up to Date',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_land_records_parcel ON land_records(parcel_id);
CREATE INDEX IF NOT EXISTS idx_land_records_owner ON land_records(owner_name);

-- 7. LAND RECORD HISTORY (MUTATION AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS land_record_history (
    id SERIAL PRIMARY KEY,
    record_id VARCHAR(64) NOT NULL REFERENCES land_records(id) ON DELETE CASCADE,
    parcel_id VARCHAR(64) NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'Initial Settlement', 'Inheritance Mutation', 'Sale Deed Registration', 'Boundary Re-survey'
    description TEXT NOT NULL,
    authorized_by VARCHAR(255) NOT NULL,
    mutation_reference VARCHAR(64),
    previous_state JSONB,
    new_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_record_history_parcel ON land_record_history(parcel_id);

-- 8. SURVEY RECORDS
CREATE TABLE IF NOT EXISTS survey_records (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'SRV-8821'
    parcel_id VARCHAR(64) NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    survey_number VARCHAR(64) NOT NULL,
    cadastral_sheet_number VARCHAR(64),
    survey_type VARCHAR(64) DEFAULT 'DGPS / Drone Cadastral', -- 'DGPS', 'ETS', 'Drone Photogrammetry'
    surveyor_name VARCHAR(255) NOT NULL,
    survey_date DATE NOT NULL,
    accuracy_tolerance_meters NUMERIC(6, 3) DEFAULT 0.050,
    control_points JSONB DEFAULT '[]'::jsonb,
    survey_status VARCHAR(64) DEFAULT 'Approved & Geo-Referenced',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. GIS LAYERS
CREATE TABLE IF NOT EXISTS gis_layers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    layer_type VARCHAR(64) NOT NULL, -- 'vector', 'raster', 'wms'
    description TEXT,
    opacity NUMERIC(3, 2) DEFAULT 0.75,
    visible_by_default BOOLEAN DEFAULT TRUE,
    attribution VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. DISPUTES (CASE MANAGEMENT)
CREATE TABLE IF NOT EXISTS disputes (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'DS-2024-001'
    parcel_id VARCHAR(64) NOT NULL REFERENCES land_parcels(id) ON DELETE CASCADE,
    secondary_parcel_id VARCHAR(64) REFERENCES land_parcels(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Ownership Conflict', 'Boundary Dispute', 'Mutation Issue', 'Land Use Conflict', 'Survey Discrepancy'
    applicant_name VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(32),
    applicant_aadhaar_ref VARCHAR(64),
    respondent_name VARCHAR(255),
    respondent_phone VARCHAR(32),
    assigned_officer VARCHAR(255) NOT NULL,
    officer_designation VARCHAR(255),
    priority dispute_priority_enum DEFAULT 'Medium',
    status dispute_status_enum DEFAULT 'Complaint',
    filing_date DATE NOT NULL,
    last_updated DATE NOT NULL,
    description TEXT NOT NULL,
    location_summary VARCHAR(255),
    conflicting_fields JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_disputes_parcel ON disputes(parcel_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_priority ON disputes(priority);

-- 11. DISPUTE TIMELINE
CREATE TABLE IF NOT EXISTS dispute_timeline (
    id SERIAL PRIMARY KEY,
    dispute_id VARCHAR(64) NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    step_name VARCHAR(128) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    action_date DATE,
    action_by VARCHAR(255),
    remark TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timeline_dispute ON dispute_timeline(dispute_id);

-- 12. DOCUMENTS & EVIDENCE
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'DOC-801'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Dispute Evidence', 'Sale Deed / Registry', 'Mutation Fard (Jamabandi)', 'Aks Shajra (Cadastral Map)', 'Survey Report'
    parcel_id VARCHAR(64) REFERENCES land_parcels(id) ON DELETE SET NULL,
    dispute_id VARCHAR(64) REFERENCES disputes(id) ON DELETE SET NULL,
    file_type VARCHAR(16) NOT NULL, -- 'PDF', 'PNG', 'JPG'
    file_size VARCHAR(32) NOT NULL,
    file_path TEXT,
    upload_date DATE NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    verification_status VARCHAR(64) DEFAULT 'Pending', -- 'Pending', 'Verified', 'Rejected'
    version VARCHAR(16) DEFAULT '1.0',
    sha256_hash VARCHAR(128) NOT NULL,
    summary TEXT,
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_parcel ON documents(parcel_id);
CREATE INDEX IF NOT EXISTS idx_documents_dispute ON documents(dispute_id);

-- 13. APPLICATIONS (CITIZEN SERVICES)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'APP-2024-101'
    application_type VARCHAR(100) NOT NULL, -- 'Boundary Demarcation (Nishandehi)', 'Mutation Request', 'Record Correction', 'Certified Copy (Fard) Request'
    parcel_id VARCHAR(64) REFERENCES land_parcels(id) ON DELETE SET NULL,
    khasra_number VARCHAR(64),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(32),
    submission_date DATE NOT NULL,
    status VARCHAR(64) DEFAULT 'Submitted', -- 'Submitted', 'Under Verification', 'Field Inspection', 'Approved', 'Rejected'
    assigned_officer VARCHAR(255),
    fees_paid NUMERIC(10, 2) DEFAULT 0.00,
    village VARCHAR(100),
    district VARCHAR(100),
    stage_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_name);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- 14. AI FLAGS & ANOMALY ALERTS
CREATE TABLE IF NOT EXISTS ai_flags (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'AI-2024-8901'
    parcel_id VARCHAR(64) REFERENCES land_parcels(id) ON DELETE SET NULL,
    issue_type VARCHAR(100) NOT NULL, -- 'Ownership Conflict', 'Spatial Boundary Overlap', 'Area Discrepancy', 'Document Inconsistency', 'Duplicate Registry'
    severity VARCHAR(32) NOT NULL, -- 'Critical', 'High', 'Medium', 'Low'
    confidence_percentage NUMERIC(5, 2) NOT NULL,
    detected_date DATE NOT NULL,
    status ai_flag_status_enum DEFAULT 'Pending Review',
    reason TEXT NOT NULL,
    evidence_primary TEXT NOT NULL,
    evidence_secondary TEXT NOT NULL,
    recommended_action TEXT,
    officer_notes TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_flags_parcel ON ai_flags(parcel_id);
CREATE INDEX IF NOT EXISTS idx_ai_flags_status ON ai_flags(status);

-- 15. AUDIT LOGS (GOVERNMENT COMPLIANCE)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'AUD-9901'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(128) NOT NULL,
    record_id VARCHAR(64),
    ip_session VARCHAR(128),
    status VARCHAR(32) DEFAULT 'Success',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(record_id);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(32) DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
    target_role VARCHAR(64)[],
    target_user_id VARCHAR(64),
    link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger: Automatically update geometry column from boundary_geojson if available
CREATE OR REPLACE FUNCTION update_parcel_geometry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.boundary_geojson IS NOT NULL THEN
        NEW.geometry := ST_SetSRID(ST_GeomFromGeoJSON(NEW.boundary_geojson::text), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_parcel_geom_update ON land_parcels;
CREATE TRIGGER trg_parcel_geom_update
BEFORE INSERT OR UPDATE OF boundary_geojson ON land_parcels
FOR EACH ROW EXECUTE FUNCTION update_parcel_geometry();
