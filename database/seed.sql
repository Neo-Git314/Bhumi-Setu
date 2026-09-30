-- ==============================================================================
-- BHUMI SETU 360° - Comprehensive Realistic Seed Data
-- SIH PS 26019: Integrated Land Governance & Decision Support Platform
-- ==============================================================================

-- 1. USERS & ROLES
INSERT INTO users (id, name, email, password_hash, phone, role, designation, department, district, state) VALUES
('usr-ro-102', 'Shri Vikram Malhotra', 'vikram.malhotra@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98112 34567', 'REVENUE_OFFICER', 'Sub-Divisional Magistrate / Revenue Officer', 'Department of Revenue & Land Reforms', 'Gurugram', 'Haryana'),
('usr-cit-001', 'Suresh Kumar Sharma', 'suresh.sharma@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98234 56789', 'CITIZEN', 'Landowner & Agriculturalist', 'General Citizen', 'Gurugram', 'Haryana'),
('usr-surv-204', 'Ananya Deshmukh', 'ananya.deshmukh@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98345 67890', 'SURVEY_OFFICER', 'Senior Cadastral Survey Officer', 'Survey & Settlement Directorate', 'Gurugram', 'Haryana'),
('usr-disp-301', 'Hon. Justice (Retd.) K. R. Nambiar', 'kr.nambiar@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98456 78901', 'DISPUTE_AUTHORITY', 'Presiding Officer, Land Dispute Tribunal', 'Revenue Appellate Tribunal', 'Gurugram', 'Haryana'),
('usr-pol-405', 'Dr. Meenakshi Sundaram', 'meenakshi.s@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98567 89012', 'POLICYMAKER', 'Advisor (Land Governance & Urban Planning)', 'NITI Aayog / MoRD', 'Gurugram', 'Haryana'),
('usr-adm-501', 'Rajeshwari Iyer', 'rajeshwari.iyer@nic.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98678 90123', 'ADMIN', 'Director, Digital Land Records Modernization', 'National Informatics Centre (NIC)', 'Gurugram', 'Haryana'),
('usr-aud-601', 'Harpreet Singh Bindra', 'harpreet.bindra@cag.gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98789 01234', 'AUDITOR', 'Chief Audit Officer (Information Security)', 'CAG Land Audit Cell', 'Gurugram', 'Haryana'),
('usr-cit-002', 'Ramesh Chandra Verma', 'ramesh.verma@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98901 23456', 'CITIZEN', 'Commercial Developer', 'Private Sector', 'Gurugram', 'Haryana'),
('usr-cit-003', 'Smt. Kamla Devi', 'kamla.devi@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98012 34567', 'CITIZEN', 'Agricultural Farmer', 'General Citizen', 'Faridabad', 'Haryana'),
('usr-ro-103', 'Smt. Sunita Rao', 'sunita.rao@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98123 45678', 'REVENUE_OFFICER', 'Tehsildar & Assistant Collector', 'Revenue Department', 'Faridabad', 'Haryana')
ON CONFLICT (id) DO NOTHING;

-- 2. LAND PARCELS (32 Real Parcels in Haryana NCR Belt)
INSERT INTO land_parcels (id, parcel_id, khasra_number, khata_number, village, tehsil, district, area_hectares, area_sq_meters, land_use, status, latitude, longitude, boundary_geojson) VALUES
('P-10245', 'P-10245', '142/1', 'KH-402', 'Badshahpur', 'Gurugram', 'Gurugram', 2.4500, 24500.00, 'Agricultural', 'Under Dispute', 28.3892, 77.0543, '{"type":"Polygon","coordinates":[[[77.0520,28.3880],[77.0560,28.3880],[77.0565,28.3910],[77.0515,28.3905],[77.0520,28.3880]]]}'),
('P-10246', 'P-10246', '142/2', 'KH-402', 'Badshahpur', 'Gurugram', 'Gurugram', 2.7000, 27000.00, 'Agricultural', 'Flagged Inconsistent', 28.3910, 77.0560, '{"type":"Polygon","coordinates":[[[77.0550,28.3900],[77.0590,28.3900],[77.0595,28.3930],[77.0545,28.3925],[77.0550,28.3900]]]}'),
('P-10247', 'P-10247', '189/4', 'KH-511', 'Sohna', 'Sohna', 'Gurugram', 4.1200, 41200.00, 'Commercial', 'Verified', 28.2450, 77.0620, '{"type":"Polygon","coordinates":[[[77.0600,28.2430],[77.0645,28.2430],[77.0650,28.2470],[77.0595,28.2465],[77.0600,28.2430]]]}'),
('P-10248', 'P-10248', '201/1', 'KH-519', 'Sohna', 'Sohna', 'Gurugram', 1.8500, 18500.00, 'Residential', 'Verified', 28.2485, 77.0680, '{"type":"Polygon","coordinates":[[[77.0660,28.2470],[77.0700,28.2470],[77.0705,28.2500],[77.0655,28.2495],[77.0660,28.2470]]]}'),
('P-10249', 'P-10249', '88/2', 'KH-210', 'Wazirabad', 'Gurugram', 'Gurugram', 3.6000, 36000.00, 'Commercial', 'Pending Survey', 28.4350, 77.0850, '{"type":"Polygon","coordinates":[[[77.0830,28.4330],[77.0875,28.4330],[77.0880,28.4370],[77.0825,28.4365],[77.0830,28.4330]]]}'),
('P-10250', 'P-10250', '312/5', 'KH-604', 'Kadarpur', 'Gurugram', 'Gurugram', 5.4000, 54000.00, 'Forest', 'Verified', 28.3620, 77.1050, '{"type":"Polygon","coordinates":[[[77.1020,28.3600],[77.1080,28.3600],[77.1085,28.3645],[77.1015,28.3640],[77.1020,28.3600]]]}'),
('P-10251', 'P-10251', '75/3', 'KH-189', 'Tigra', 'Gurugram', 'Gurugram', 1.2500, 12500.00, 'Residential', 'Mutation In Progress', 28.4180, 77.0720, '{"type":"Polygon","coordinates":[[[77.0700,28.4165],[77.0740,28.4165],[77.0745,28.4195],[77.0695,28.4190],[77.0700,28.4165]]]}'),
('P-10252', 'P-10252', '410/2', 'KH-812', 'Bhondsi', 'Sohna', 'Gurugram', 6.2000, 62000.00, 'Agricultural', 'Verified', 28.3310, 77.0420, '{"type":"Polygon","coordinates":[[[77.0390,28.3280],[77.0450,28.3280],[77.0455,28.3340],[77.0385,28.3335],[77.0390,28.3280]]]}'),
('P-10253', 'P-10253', '52/1', 'KH-114', 'Chakkarpur', 'Gurugram', 'Gurugram', 0.8500, 8500.00, 'Commercial', 'Verified', 28.4750, 77.0910, '{"type":"Polygon","coordinates":[[[77.0890,28.4735],[77.0930,28.4735],[77.0935,28.4765],[77.0885,28.4760],[77.0890,28.4735]]]}'),
('P-10254', 'P-10254', '94/8', 'KH-230', 'Gwal Pahari', 'Gurugram', 'Gurugram', 7.8000, 78000.00, 'Forest', 'Verified', 28.4280, 77.1420, '{"type":"Polygon","coordinates":[[[77.1380,28.4250],[77.1460,28.4250],[77.1465,28.4310],[77.1375,28.4305],[77.1380,28.4250]]]}'),
('P-10255', 'P-10255', '16/4', 'KH-90', 'Sikanderpur', 'Gurugram', 'Gurugram', 1.9500, 19500.00, 'Industrial', 'Under Dispute', 28.4820, 77.0980, '{"type":"Polygon","coordinates":[[[77.0960,28.4805],[77.1000,28.4805],[77.1005,28.4835],[77.0955,28.4830],[77.0960,28.4805]]]}'),
('P-10256', 'P-10256', '128/9', 'KH-319', 'Nathupur', 'Gurugram', 'Gurugram', 3.1000, 31000.00, 'Commercial', 'Verified', 28.4890, 77.1080, '{"type":"Polygon","coordinates":[[[77.1060,28.4870],[77.1105,28.4870],[77.1110,28.4910],[77.1055,28.4905],[77.1060,28.4870]]]}'),
('P-10257', 'P-10257', '63/2', 'KH-145', 'Ballabhgarh', 'Ballabhgarh', 'Faridabad', 3.8000, 38000.00, 'Agricultural', 'Verified', 28.3390, 77.3220, '{"type":"Polygon","coordinates":[[[77.3200,28.3370],[77.3245,28.3370],[77.3250,28.3410],[77.3195,28.3405],[77.3200,28.3370]]]}'),
('P-10258', 'P-10258', '115/6', 'KH-289', 'Tigaon', 'Ballabhgarh', 'Faridabad', 4.5000, 45000.00, 'Agricultural', 'Under Dispute', 28.3840, 77.3850, '{"type":"Polygon","coordinates":[[[77.3820,28.3820],[77.3875,28.3820],[77.3880,28.3860],[77.3815,28.3855],[77.3820,28.3820]]]}'),
('P-10259', 'P-10259', '44/1', 'KH-98', 'Dhouj', 'Badkhal', 'Faridabad', 2.9000, 29000.00, 'Residential', 'Verified', 28.3180, 77.1950, '{"type":"Polygon","coordinates":[[[77.1930,28.3160],[77.1970,28.3160],[77.1975,28.3200],[77.1925,28.3195],[77.1930,28.3160]]]}'),
('P-10260', 'P-10260', '82/4', 'KH-199', 'Pali', 'Badkhal', 'Faridabad', 5.1500, 51500.00, 'Industrial', 'Pending Survey', 28.3560, 77.2410, '{"type":"Polygon","coordinates":[[[77.2380,28.3535],[77.2440,28.3535],[77.2445,28.3585],[77.2375,28.3580],[77.2380,28.3535]]]}')
ON CONFLICT (id) DO NOTHING;

-- 3. LAND RECORDS (Title deeds)
INSERT INTO land_records (id, parcel_id, owner_name, ownership_type, ownership_share, mutation_number, mutation_date, registration_number, registration_date, sub_registrar_office, encumbrance_status, tax_assessment_status) VALUES
('LR-10245', 'P-10245', 'Suresh Kumar Sharma', 'Sole Ownership', '100%', 'MUT-2018-883', '2018-05-14', 'REG-2018-0912', '2018-04-10', 'Sub-Registrar Gurugram South', 'Under Title Dispute Review', 'Paid Up to Date'),
('LR-10246', 'P-10246', 'Rakesh Kumar Sharma', 'Sole Ownership', '100%', 'MUT-2021-419', '2021-09-22', 'REG-2021-7731', '2021-08-15', 'Sub-Registrar Gurugram South', 'Nil (Clean Title)', 'Paid Up to Date'),
('LR-10247', 'P-10247', 'DLF Commercial Assets Ltd', 'Corporate Ownership', '100%', 'MUT-2016-102', '2016-11-04', 'REG-2016-5541', '2016-10-18', 'Sub-Registrar Sohna', 'Nil (Clean Title)', 'Paid Up to Date'),
('LR-10248', 'P-10248', 'Kamal Kishor Aggarwal', 'Sole Ownership', '100%', 'MUT-2019-331', '2019-03-29', 'REG-2019-1823', '2019-02-14', 'Sub-Registrar Sohna', 'Nil (Clean Title)', 'Paid Up to Date'),
('LR-10249', 'P-10249', 'Emaar Landmark Estates', 'Corporate Ownership', '100%', 'MUT-2020-554', '2020-07-18', 'REG-2020-3392', '2020-06-25', 'Sub-Registrar Gurugram Central', 'Pending Re-Survey Certification', 'Under Assessment'),
('LR-10250', 'P-10250', 'Haryana Forest Department', 'State Government', '100%', 'MUT-1985-001', '1985-04-01', 'GAZ-1985-8821', '1985-03-12', 'State Forest Settlement Officer', 'Protected Reserve Forest (Punjab Land Preservation Act)', 'Exempt'),
('LR-10251', 'P-10251', 'Smt. Saroj Yadav', 'Joint Ownership', '50%', 'MUT-2023-712', '2023-11-10', 'REG-2023-9014', '2023-10-02', 'Sub-Registrar Wazirabad', 'Mutation Pending Verification', 'Paid Up to Date'),
('LR-10252', 'P-10252', 'Harbans Lal & Brothers', 'Joint/Ancestral', '33.33%', 'MUT-1994-082', '1994-02-18', 'REG-1994-1142', '1994-01-20', 'Sub-Registrar Sohna', 'Nil (Clean Title)', 'Paid Up to Date'),
('LR-10253', 'P-10253', 'Cyber Hub Retailers Consortium', 'Corporate Ownership', '100%', 'MUT-2017-902', '2017-08-30', 'REG-2017-6401', '2017-07-22', 'Sub-Registrar Gurugram Central', 'Bank Hypothecation (SBI Commercial)', 'Paid Up to Date'),
('LR-10254', 'P-10254', 'Aravalli Biodiversity Reserve', 'State Government', '100%', 'MUT-1992-045', '1992-06-15', 'GAZ-1992-3401', '1992-05-10', 'Divisional Forest Officer Gurugram', 'Non-Alienated Eco-Fragile Zone', 'Exempt')
ON CONFLICT (id) DO NOTHING;

-- 4. DISPUTES
INSERT INTO disputes (id, parcel_id, secondary_parcel_id, title, category, applicant_name, applicant_phone, respondent_name, respondent_phone, assigned_officer, officer_designation, priority, status, filing_date, last_updated, description, location_summary, conflicting_fields) VALUES
('DS-2024-001', 'P-10245', 'P-10246', 'Boundary Overlap & Ownership Rights on Khasra 142/1 and 142/2', 'Ownership Conflict', 'Suresh Kumar Sharma', '+91 98234 56789', 'Rakesh Kumar Sharma', '+91 98111 22334', 'Shri Vikram Malhotra', 'SDM Gurugram', 'High', 'Review', '2024-01-14', '2024-02-28', 'Applicant claims 2.45 hectares of inherited ancestral parcel. Adjoining landowner Rakesh Kumar obtained mutation 142/2 asserting overlapping 0.25 hectares with boundary distortion.', 'Badshahpur, Gurugram (Near Sohna Road)', '[{"field":"Owner Name","recordA":"Suresh Kumar Sharma","recordB":"Rakesh Kumar Sharma"},{"field":"Parcel Area","recordA":"2.45 Hectares","recordB":"2.70 Hectares"},{"field":"Registered Khasra","recordA":"142/1","recordB":"142/2 Overlap"}]'),
('DS-2024-002', 'P-10255', NULL, 'Industrial Buffer Encroachment & Mutation Contest', 'Boundary Dispute', 'Haryana State Industrial Dev Corp (HSIIDC)', '+91 98765 43210', 'Apex Fabcon Logistics Pvt Ltd', '+91 98222 33445', 'Shri Vikram Malhotra', 'SDM Gurugram', 'Critical', 'Evidence Collection', '2024-02-02', '2024-03-01', 'Encroachment detected on road widening reserve adjacent to parcel P-10255. ETS survey shows 320 sq.m beyond sanctioned site plan.', 'Sikanderpur Industrial Belt', '[{"field":"Buffer Width","recordA":"15.0 Meters Sanctioned","recordB":"11.8 Meters Existing Possession"}]'),
('DS-2024-003', 'P-10258', NULL, 'Ancestral Partition Discrepancy & Share Misrepresentation', 'Mutation Issue', 'Smt. Kamla Devi', '+91 98012 34567', 'Dharamvir Yadav', '+91 98333 44556', 'Smt. Sunita Rao', 'Tehsildar Faridabad', 'Medium', 'Verification', '2024-02-18', '2024-03-05', 'Fard records partition executed without consent of co-sharer Smt. Kamla Devi in Jamabandi year 2021-2022.', 'Tigaon Village, Faridabad', '[{"field":"Co-sharer Share","recordA":"50% Undivided Share","recordB":"Claimed 100% Sole Possession"}]')
ON CONFLICT (id) DO NOTHING;

-- 5. DISPUTE TIMELINES
INSERT INTO dispute_timeline (dispute_id, step_name, completed, action_date, action_by, remark) VALUES
('DS-2024-001', 'Complaint Submitted', true, '2024-01-14', 'Suresh Kumar Sharma', 'Grievance filed via Bhumi Setu portal with registered deed copy.'),
('DS-2024-001', 'Verification', true, '2024-01-22', 'Halqa Patwari Badshahpur', 'Field spot inspection completed; panchnama recorded.'),
('DS-2024-001', 'Evidence Collection', true, '2024-02-05', 'Kanoongo Cell Gurugram', 'Both parties submitted Jamabandi fards, aks shajra, and registered deeds.'),
('DS-2024-001', 'Officer Review', true, '2024-02-28', 'Shri Vikram Malhotra (SDM)', 'AI anomaly flag verified; hearing conducted in revenue court.'),
('DS-2024-001', 'Resolution', false, NULL, 'Revenue Appellate Bench', 'Draft order under final judicial examination.'),
('DS-2024-001', 'Closure', false, NULL, 'DILRMP Sync Cell', 'Pending final mutation update and digital signature.')
ON CONFLICT DO NOTHING;

-- 6. AI FLAGS
INSERT INTO ai_flags (id, parcel_id, issue_type, severity, confidence_percentage, detected_date, status, reason, evidence_primary, evidence_secondary, recommended_action) VALUES
('AI-2024-8901', 'P-10245', 'Ownership Conflict', 'Critical', 94.50, '2024-01-15', 'Pending Review', 'Phonetic and cadastral matching detected competing title registries on overlapping khasra numbers 142/1 and 142/2 with discordant area declarations.', 'Record LR-10245 (Reg: 2018-0912) claims 2.45 Hectares in sole title of Suresh Kumar Sharma.', 'Record LR-10246 (Reg: 2021-7731) claims 2.70 Hectares including disputed western boundary margin.', 'Summon parties for joint digital DGPS demarcation and freeze pending mutation requests.'),
('AI-2024-8902', 'P-10246', 'Spatial Boundary Overlap', 'High', 91.20, '2024-01-16', 'Pending Review', 'GeoJSON polygon intersection calculation indicates 2,500 sq.m spatial overlap between P-10245 and P-10246.', 'Cadastral polygon P-10245 coordinates (Badshahpur sheet 14).', 'Cadastral polygon P-10246 digitized geometry.', 'Dispatch drone survey squad for geo-referenced boundary re-establishment.'),
('AI-2024-8903', 'P-10249', 'Area Discrepancy', 'Medium', 88.00, '2024-02-01', 'Verified', 'Textual area declared in Jamabandi fard (3.60 Hectares) exceeds digitized GIS polygon area (3.42 Hectares) by 5.26%.', 'Jamabandi Record 2020-21 column 4 entry.', 'Calculated GIS Polygon Area (34,200 sq.m).', 'Commission cadastral re-measurement to reconcile digital map with physical ground occupation.'),
('AI-2024-8904', 'P-10255', 'Document Inconsistency', 'High', 89.70, '2024-02-04', 'Investigating', 'OCR extracted seller name in registered deed differs from revenue jamabandi record holder.', 'Uploaded Sale Deed OCR extracted text: "Shri Om Prakash Fabcon".', 'Revenue Registry Record LR-10255: "Apex Fabcon Logistics Pvt Ltd".', 'Verify legal entity conversion deeds and corporate resolution certificates.')
ON CONFLICT (id) DO NOTHING;

-- 7. DOCUMENTS
INSERT INTO documents (id, title, category, parcel_id, dispute_id, file_type, file_size, upload_date, uploaded_by, verification_status, sha256_hash, summary) VALUES
('DOC-801', 'Registered Sale Deed - Khasra 142/1 (2018)', 'Sale Deed / Registry', 'P-10245', 'DS-2024-001', 'PDF', '4.2 MB', '2024-01-14', 'Suresh Kumar Sharma', 'Verified', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'Original registered sale deed executed before Sub-Registrar Gurugram South for 2.45 hectares.'),
('DOC-802', 'Contested Mutation Order - Khasra 142/2 (2021)', 'Mutation Fard (Jamabandi)', 'P-10246', 'DS-2024-001', 'PDF', '2.8 MB', '2024-01-20', 'Rakesh Kumar Sharma', 'Pending', '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 'Mutation fard certified copy showing sanad takseem contested by applicant.'),
('DOC-803', 'Aks Shajra Cadastral Sheet Badshahpur (1:4000)', 'Aks Shajra (Cadastral Map)', 'P-10245', 'DS-2024-001', 'PNG', '6.5 MB', '2024-01-24', 'Halqa Patwari', 'Verified', '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b', 'High-resolution scanned revenue village map showing khasra boundaries 142/1 and 142/2.'),
('DOC-804', 'DGPS Survey & Field Verification Report', 'Survey Report', 'P-10245', 'DS-2024-001', 'PDF', '3.1 MB', '2024-02-10', 'Ananya Deshmukh (Surveyor)', 'Verified', 'cca92fb142a638b89f57dd0e73ae3c97d12f54bca8005691d77b6162a29f1ae4', 'Field survey establishing boundary points with sub-centimeter accuracy.')
ON CONFLICT (id) DO NOTHING;

-- 8. APPLICATIONS
INSERT INTO applications (id, application_type, parcel_id, khasra_number, applicant_name, applicant_phone, submission_date, status, assigned_officer, fees_paid, village, district, stage_description) VALUES
('APP-2024-101', 'Boundary Demarcation (Nishandehi)', 'P-10245', '142/1', 'Suresh Kumar Sharma', '+91 98234 56789', '2024-01-10', 'Field Inspection', 'Kanoongo Circle Badshahpur', 500.00, 'Badshahpur', 'Gurugram', 'Total Station demarcation scheduled with Halqa Patwari.'),
('APP-2024-102', 'Record Correction', 'P-10249', '88/2', 'Emaar Landmark Estates', '+91 98111 88990', '2024-01-25', 'Under Verification', 'Revenue Officer Sohna', 1200.00, 'Wazirabad', 'Gurugram', 'Area discrepancy under administrative reconciliation.'),
('APP-2024-103', 'Certified Copy (Fard) Request', 'P-10247', '189/4', 'DLF Commercial Assets Ltd', '+91 98111 00223', '2024-02-05', 'Approved', 'Digital Record Room NIC', 150.00, 'Sohna', 'Gurugram', 'Digitally signed fard issued with verifiable QR code.')
ON CONFLICT (id) DO NOTHING;

-- 9. AUDIT LOGS
INSERT INTO audit_logs (id, timestamp, user_name, role, action, module, record_id, ip_session, status, details) VALUES
('AUD-9901', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Shri Vikram Malhotra', 'REVENUE_OFFICER', 'Verified AI Anomaly Flag', 'AI Validation', 'AI-2024-8901', '10.14.88.23 [NIC-SECURE-SESSION]', 'Success', 'Official accepted AI anomaly recommendation; issued notice for joint demarcation.'),
('AUD-9902', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'Suresh Kumar Sharma', 'CITIZEN', 'Registered Dispute Grievance', 'Dispute Management', 'DS-2024-001', '192.168.1.104 [CITIZEN-PORTAL]', 'Success', 'Grievance submitted against Khasra 142/2 mutation.'),
('AUD-9903', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Ananya Deshmukh', 'SURVEY_OFFICER', 'Uploaded DGPS Cadastral Survey', 'GIS & Survey', 'SRV-8821', '10.14.92.11 [SURVEY-NET]', 'Success', 'Uploaded 4-point DGPS polygon coordinates for Badshahpur Sector 66.')
ON CONFLICT (id) DO NOTHING;

-- 10. NOTIFICATIONS
INSERT INTO notifications (id, title, message, notification_type, target_role, link_url) VALUES
('NOTIF-001', 'Urgent Anomaly Flagged for Review', 'AI detected critical ownership conflict on Khasra 142/1 (Badshahpur). Action required.', 'warning', ARRAY['REVENUE_OFFICER', 'ADMIN'], '/ai-validation'),
('NOTIF-002', 'Dispute Hearing Scheduled', 'Hearing scheduled for Case DS-2024-001 before SDM Gurugram on 15th of next month.', 'info', ARRAY['CITIZEN', 'REVENUE_OFFICER', 'DISPUTE_AUTHORITY'], '/disputes/DS-2024-001'),
('NOTIF-003', 'Demarcation Report Uploaded', 'Cadastral survey officer completed DGPS ground inspection for Parcel P-10245.', 'success', ARRAY['REVENUE_OFFICER', 'SURVEY_OFFICER'], '/records/P-10245')
ON CONFLICT (id) DO NOTHING;
