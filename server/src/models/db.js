import { getDbPool } from '../config/database.js';
import { calculateHaversineDistance, isPointInPolygon, calculatePolygonAreaSqMeters } from '../utils/spatial.js';

// Pre-seeded Indian Land Governance Data
const INITIAL_USERS = [
  {
    id: 'usr-ro-102',
    name: 'Shri Vikram Malhotra',
    email: 'vikram.malhotra@gov.in',
    passwordHash: 'password123', // In demo accepted
    role: 'REVENUE_OFFICER',
    designation: 'Sub-Divisional Magistrate / Revenue Officer',
    department: 'Department of Revenue & Land Reforms',
    district: 'Gurugram',
    state: 'Haryana',
    phone: '+91 98112 34567',
  },
  {
    id: 'usr-cit-001',
    name: 'Suresh Kumar Sharma',
    email: 'suresh.sharma@example.com',
    passwordHash: 'password123',
    role: 'CITIZEN',
    designation: 'Landowner & Agriculturalist',
    department: 'General Citizen',
    district: 'Gurugram',
    state: 'Haryana',
    phone: '+91 98234 56789',
  },
  {
    id: 'usr-surv-204',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@gov.in',
    passwordHash: 'password123',
    role: 'SURVEY_OFFICER',
    designation: 'Senior Cadastral Survey Officer',
    department: 'Survey & Settlement Directorate',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '+91 98345 67890',
  },
  {
    id: 'usr-disp-301',
    name: 'Hon. Justice (Retd.) K. R. Nambiar',
    email: 'kr.nambiar@gov.in',
    passwordHash: 'password123',
    role: 'DISPUTE_AUTHORITY',
    designation: 'Presiding Officer, Land Dispute Tribunal',
    department: 'Revenue Appellate Tribunal',
    district: 'Gurugram',
    state: 'Haryana',
    phone: '+91 98456 78901',
  },
  {
    id: 'usr-pol-405',
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.s@gov.in',
    passwordHash: 'password123',
    role: 'POLICYMAKER',
    designation: 'Advisor (Land Governance & Urban Planning)',
    department: 'NITI Aayog / MoRD',
    district: 'National Capital Region',
    state: 'Central',
    phone: '+91 98567 89012',
  },
  {
    id: 'usr-adm-501',
    name: 'Rajeshwari Iyer',
    email: 'rajeshwari.iyer@nic.in',
    passwordHash: 'password123',
    role: 'ADMIN',
    designation: 'Director, Digital Land Records Modernization (DILRMP)',
    department: 'National Informatics Centre (NIC)',
    district: 'HQ New Delhi',
    state: 'Central',
    phone: '+91 98678 90123',
  },
  {
    id: 'usr-aud-601',
    name: 'Harpreet Singh Bindra',
    email: 'harpreet.bindra@cag.gov.in',
    passwordHash: 'password123',
    role: 'AUDITOR',
    designation: 'Chief Audit Officer (Information Security)',
    department: 'Comptroller & Auditor General (CAG) Cell',
    district: 'HQ New Delhi',
    state: 'Central',
    phone: '+91 98789 01234',
  },
];

const INITIAL_PARCELS = [
  {
    id: 'P-10245',
    khasraNo: '142/1',
    khataNo: 'KH-402',
    village: 'Badshahpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    area: '2.45 Hectares (6.05 Acres)',
    areaHectares: 2.45,
    areaSqMeters: 24500,
    landUse: 'Agricultural',
    soilType: 'Alluvial Loam',
    status: 'Under Dispute',
    ownerName: 'Suresh Kumar Sharma',
    ownerAadhaar: 'XXXX-XXXX-4912',
    ownershipType: 'Sole Ownership',
    ownershipShare: '100%',
    surveyNo: 'SRV-8821',
    registrationNo: 'REG-2018-0912',
    mutationNo: 'MUT-2018-883',
    lastUpdated: '2024-02-14',
    coordinates: [28.3892, 77.0543],
    polygon: [
      [28.388, 77.052],
      [28.388, 77.056],
      [28.391, 77.0565],
      [28.3905, 77.0515],
      [28.388, 77.052],
    ],
    disputeId: 'DS-2024-001',
    history: [
      { date: '2024-01-14', event: 'Dispute filed by Suresh Kumar Sharma', by: 'Revenue Tribunal' },
      { date: '2021-09-22', event: 'Contested mutation recorded for 142/2', by: 'Tehsildar Gurugram' },
      { date: '2018-05-14', event: 'Registered deed mutation approved', by: 'SDM Gurugram' },
    ],
  },
  {
    id: 'P-10246',
    khasraNo: '142/2',
    khataNo: 'KH-402',
    village: 'Badshahpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    area: '2.70 Hectares (6.67 Acres)',
    areaHectares: 2.7,
    areaSqMeters: 27000,
    landUse: 'Agricultural',
    soilType: 'Alluvial Loam',
    status: 'Flagged Inconsistent',
    ownerName: 'Rakesh Kumar Sharma',
    ownerAadhaar: 'XXXX-XXXX-9914',
    ownershipType: 'Sole Ownership',
    ownershipShare: '100%',
    surveyNo: 'SRV-8822',
    registrationNo: 'REG-2021-7731',
    mutationNo: 'MUT-2021-419',
    lastUpdated: '2024-01-20',
    coordinates: [28.391, 77.056],
    polygon: [
      [28.39, 77.055],
      [28.39, 77.059],
      [28.393, 77.0595],
      [28.3925, 77.0545],
      [28.39, 77.055],
    ],
    disputeId: 'DS-2024-001',
    history: [
      { date: '2024-01-16', event: 'AI Boundary Overlap Alert Triggered', by: 'AI Engine' },
      { date: '2021-09-22', event: 'Mutation 419 sanctioned', by: 'Tehsildar Gurugram' },
    ],
  },
  {
    id: 'P-10247',
    khasraNo: '189/4',
    khataNo: 'KH-511',
    village: 'Sohna',
    tehsil: 'Sohna',
    district: 'Gurugram',
    state: 'Haryana',
    area: '4.12 Hectares (10.18 Acres)',
    areaHectares: 4.12,
    areaSqMeters: 41200,
    landUse: 'Commercial',
    soilType: 'Sandy Loam',
    status: 'Verified',
    ownerName: 'DLF Commercial Assets Ltd',
    ownerAadhaar: 'N/A (Corporate CIN: L70101HR)',
    ownershipType: 'Corporate Ownership',
    ownershipShare: '100%',
    surveyNo: 'SRV-9014',
    registrationNo: 'REG-2016-5541',
    mutationNo: 'MUT-2016-102',
    lastUpdated: '2023-11-10',
    coordinates: [28.245, 77.062],
    polygon: [
      [28.243, 77.06],
      [28.243, 77.0645],
      [28.247, 77.065],
      [28.2465, 77.0595],
      [28.243, 77.06],
    ],
    history: [
      { date: '2023-11-10', event: 'Periodic cadastral verification completed', by: 'Survey Dept' },
    ],
  },
  {
    id: 'P-10248',
    khasraNo: '201/1',
    khataNo: 'KH-519',
    village: 'Sohna',
    tehsil: 'Sohna',
    district: 'Gurugram',
    state: 'Haryana',
    area: '1.85 Hectares (4.57 Acres)',
    areaHectares: 1.85,
    areaSqMeters: 18500,
    landUse: 'Residential',
    soilType: 'Clayey Loam',
    status: 'Verified',
    ownerName: 'Kamal Kishor Aggarwal',
    ownerAadhaar: 'XXXX-XXXX-8012',
    ownershipType: 'Sole Ownership',
    ownershipShare: '100%',
    surveyNo: 'SRV-9022',
    registrationNo: 'REG-2019-1823',
    mutationNo: 'MUT-2019-331',
    lastUpdated: '2023-08-19',
    coordinates: [28.2485, 77.068],
    polygon: [
      [28.247, 77.066],
      [28.247, 77.07],
      [28.25, 77.0705],
      [28.2495, 77.0655],
      [28.247, 77.066],
    ],
    history: [{ date: '2019-03-29', event: 'Mutation finalized', by: 'Sohna Tehsil' }],
  },
  {
    id: 'P-10249',
    khasraNo: '88/2',
    khataNo: 'KH-210',
    village: 'Wazirabad',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    area: '3.60 Hectares (8.89 Acres)',
    areaHectares: 3.6,
    areaSqMeters: 36000,
    landUse: 'Commercial',
    soilType: 'Loamy Sand',
    status: 'Pending Survey',
    ownerName: 'Emaar Landmark Estates',
    ownerAadhaar: 'N/A (Corporate CIN: U45201DL)',
    ownershipType: 'Corporate Ownership',
    ownershipShare: '100%',
    surveyNo: 'SRV-7719',
    registrationNo: 'REG-2020-3392',
    mutationNo: 'MUT-2020-554',
    lastUpdated: '2024-02-01',
    coordinates: [28.435, 77.085],
    polygon: [
      [28.433, 77.083],
      [28.433, 77.0875],
      [28.437, 77.088],
      [28.4365, 77.0825],
      [28.433, 77.083],
    ],
    history: [{ date: '2024-02-01', event: 'Area discrepancy flagged by AI engine', by: 'System' }],
  },
  {
    id: 'P-10250',
    khasraNo: '312/5',
    khataNo: 'KH-604',
    village: 'Kadarpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    area: '5.40 Hectares (13.34 Acres)',
    areaHectares: 5.4,
    areaSqMeters: 54000,
    landUse: 'Forest',
    soilType: 'Rocky Gravelly',
    status: 'Verified',
    ownerName: 'Haryana Forest Department',
    ownerAadhaar: 'Govt Department',
    ownershipType: 'State Government',
    ownershipShare: '100%',
    surveyNo: 'SRV-6002',
    registrationNo: 'GAZ-1985-8821',
    mutationNo: 'MUT-1985-001',
    lastUpdated: '2023-06-15',
    coordinates: [28.362, 77.105],
    polygon: [
      [28.36, 77.102],
      [28.36, 77.108],
      [28.3645, 77.1085],
      [28.364, 77.1015],
      [28.36, 77.102],
    ],
    history: [{ date: '1985-04-01', event: 'Gazette notification under PLPA Act', by: 'Govt of Haryana' }],
  },
  {
    id: 'P-10251',
    khasraNo: '75/3',
    khataNo: 'KH-189',
    village: 'Tigra',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    area: '1.25 Hectares (3.08 Acres)',
    areaHectares: 1.25,
    areaSqMeters: 12500,
    landUse: 'Residential',
    soilType: 'Sandy Loam',
    status: 'Mutation In Progress',
    ownerName: 'Smt. Saroj Yadav',
    ownerAadhaar: 'XXXX-XXXX-3341',
    ownershipType: 'Joint Ownership',
    ownershipShare: '50%',
    surveyNo: 'SRV-8109',
    registrationNo: 'REG-2023-9014',
    mutationNo: 'MUT-2023-712',
    lastUpdated: '2024-02-18',
    coordinates: [28.418, 77.072],
    polygon: [
      [28.4165, 77.07],
      [28.4165, 77.074],
      [28.4195, 77.0745],
      [28.419, 77.0695],
      [28.4165, 77.07],
    ],
    history: [{ date: '2023-11-10', event: 'Sale deed submitted for mutation', by: 'Citizen Portal' }],
  },
  {
    id: 'P-10252',
    khasraNo: '410/2',
    khataNo: 'KH-812',
    village: 'Bhondsi',
    tehsil: 'Sohna',
    district: 'Gurugram',
    state: 'Haryana',
    area: '6.20 Hectares (15.32 Acres)',
    areaHectares: 6.2,
    areaSqMeters: 62000,
    landUse: 'Agricultural',
    soilType: 'Alluvial Loam',
    status: 'Verified',
    ownerName: 'Harbans Lal & Brothers',
    ownerAadhaar: 'XXXX-XXXX-1992',
    ownershipType: 'Joint/Ancestral',
    ownershipShare: '33.33%',
    surveyNo: 'SRV-5421',
    registrationNo: 'REG-1994-1142',
    mutationNo: 'MUT-1994-082',
    lastUpdated: '2023-10-05',
    coordinates: [28.331, 77.042],
    polygon: [
      [28.328, 77.039],
      [28.328, 77.045],
      [28.334, 77.0455],
      [28.3335, 77.0385],
      [28.328, 77.039],
    ],
    history: [{ date: '1994-02-18', event: 'Ancestral partition sanctioned', by: 'Sohna Court' }],
  },
  {
    id: 'P-10255',
    khasraNo: '16/4',
    khataNo: 'KH-90',
    village: 'Sikanderpur',
    tehsil: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    area: '1.95 Hectares (4.82 Acres)',
    areaHectares: 1.95,
    areaSqMeters: 19500,
    landUse: 'Industrial',
    soilType: 'Industrial Filled Ground',
    status: 'Under Dispute',
    ownerName: 'Apex Fabcon Logistics Pvt Ltd',
    ownerAadhaar: 'Corporate CIN: U60200HR',
    ownershipType: 'Corporate Ownership',
    ownershipShare: '100%',
    surveyNo: 'SRV-9931',
    registrationNo: 'REG-2015-8812',
    mutationNo: 'MUT-2015-401',
    lastUpdated: '2024-02-02',
    coordinates: [28.482, 77.098],
    polygon: [
      [28.4805, 77.096],
      [28.4805, 77.1],
      [28.4835, 77.1005],
      [28.483, 77.0955],
      [28.4805, 77.096],
    ],
    disputeId: 'DS-2024-002',
    history: [{ date: '2024-02-02', event: 'HSIIDC filed encroachment dispute', by: 'HSIIDC Legal' }],
  },
];

const INITIAL_DISPUTES = [
  {
    id: 'DS-2024-001',
    parcelId: 'P-10245',
    secondaryParcelId: 'P-10246',
    title: 'Boundary Overlap & Ownership Rights on Khasra 142/1 and 142/2',
    category: 'Ownership Conflict',
    applicant: 'Suresh Kumar Sharma',
    applicantPhone: '+91 98234 56789',
    respondent: 'Rakesh Kumar Sharma',
    respondentPhone: '+91 98111 22334',
    assignedOfficer: 'Shri Vikram Malhotra',
    officerDesignation: 'SDM Gurugram',
    priority: 'High',
    status: 'Review',
    filingDate: '2024-01-14',
    lastUpdated: '2024-02-28',
    description:
      'Applicant claims 2.45 hectares of inherited ancestral parcel. Adjoining landowner Rakesh Kumar obtained mutation 142/2 asserting overlapping 0.25 hectares with boundary distortion.',
    location: 'Badshahpur, Gurugram (Near Sohna Road)',
    conflictingFields: [
      { field: 'Owner Name', recordA: 'Suresh Kumar Sharma', recordB: 'Rakesh Kumar Sharma' },
      { field: 'Parcel Area', recordA: '2.45 Hectares', recordB: '2.70 Hectares' },
      { field: 'Registered Khasra', recordA: '142/1', recordB: '142/2 Overlap' },
      { field: 'Mutation Deed No.', recordA: 'MUT-2018-883', recordB: 'MUT-2021-419' },
    ],
    timeline: [
      { step: 'Complaint Submitted', date: '2024-01-14', completed: true, remark: 'Grievance filed via portal with deed.' },
      { step: 'Verification', date: '2024-01-22', completed: true, remark: 'Spot inspection completed by Patwari.' },
      { step: 'Evidence Collection', date: '2024-02-05', completed: true, remark: 'Parties submitted Jamabandi fards.' },
      { step: 'Officer Review', date: '2024-02-28', completed: true, remark: 'Hearing held before SDM.' },
      { step: 'Resolution', date: '', completed: false, remark: 'Judicial order under drafting.' },
      { step: 'Closure', date: '', completed: false, remark: 'Pending final record sync.' },
    ],
    evidenceIds: ['DOC-801', 'DOC-802', 'DOC-803', 'DOC-804'],
  },
  {
    id: 'DS-2024-002',
    parcelId: 'P-10255',
    secondaryParcelId: '',
    title: 'Industrial Buffer Encroachment & Mutation Contest',
    category: 'Boundary Dispute',
    applicant: 'Haryana State Industrial Dev Corp (HSIIDC)',
    applicantPhone: '+91 98765 43210',
    respondent: 'Apex Fabcon Logistics Pvt Ltd',
    respondentPhone: '+91 98222 33445',
    assignedOfficer: 'Shri Vikram Malhotra',
    officerDesignation: 'SDM Gurugram',
    priority: 'Critical',
    status: 'Evidence Collection',
    filingDate: '2024-02-02',
    lastUpdated: '2024-03-01',
    description: 'Encroachment detected on road widening reserve adjacent to parcel P-10255.',
    location: 'Sikanderpur Industrial Belt',
    conflictingFields: [
      { field: 'Buffer Width', recordA: '15.0 Meters Sanctioned', recordB: '11.8 Meters Existing' },
    ],
    timeline: [
      { step: 'Complaint Submitted', date: '2024-02-02', completed: true, remark: 'Official HSIIDC notice served.' },
      { step: 'Verification', date: '2024-02-15', completed: true, remark: 'Joint physical survey completed.' },
      { step: 'Evidence Collection', date: '', completed: false, remark: 'Awaiting architectural drawings.' },
      { step: 'Officer Review', date: '', completed: false, remark: 'Pending evidence.' },
      { step: 'Resolution', date: '', completed: false, remark: 'Pending hearing.' },
      { step: 'Closure', date: '', completed: false, remark: 'Pending compliance.' },
    ],
    evidenceIds: ['DOC-805'],
  },
];

const INITIAL_AI_ALERTS = [
  {
    id: 'AI-2024-8901',
    parcelId: 'P-10245',
    issueType: 'Ownership Conflict',
    severity: 'Critical',
    confidence: '94.5%',
    confidenceNum: 94.5,
    detectedDate: '2024-01-15',
    status: 'Pending Review',
    reason:
      'Phonetic and cadastral matching detected competing title registries on overlapping khasra numbers 142/1 and 142/2 with discordant area declarations.',
    evidencePrimary: 'Record LR-10245 (Reg: 2018-0912) claims 2.45 Hectares in sole title of Suresh Kumar Sharma.',
    evidenceSecondary: 'Record LR-10246 (Reg: 2021-7731) claims 2.70 Hectares including disputed western boundary margin.',
    recommendedAction: 'Summon parties for joint digital DGPS demarcation and freeze pending mutation requests.',
  },
  {
    id: 'AI-2024-8902',
    parcelId: 'P-10246',
    issueType: 'Spatial Boundary Overlap',
    severity: 'High',
    confidence: '91.2%',
    confidenceNum: 91.2,
    detectedDate: '2024-01-16',
    status: 'Pending Review',
    reason: 'GeoJSON polygon intersection calculation indicates 2,500 sq.m spatial overlap between P-10245 and P-10246.',
    evidencePrimary: 'Cadastral polygon P-10245 coordinates (Badshahpur sheet 14).',
    evidenceSecondary: 'Cadastral polygon P-10246 digitized geometry.',
    recommendedAction: 'Dispatch drone survey squad for geo-referenced boundary re-establishment.',
  },
  {
    id: 'AI-2024-8903',
    parcelId: 'P-10249',
    issueType: 'Area Discrepancy',
    severity: 'Medium',
    confidence: '88.0%',
    confidenceNum: 88.0,
    detectedDate: '2024-02-01',
    status: 'Verified',
    reason: 'Textual area declared in Jamabandi fard (3.60 Hectares) exceeds digitized GIS polygon area (3.42 Hectares) by 5.26%.',
    evidencePrimary: 'Jamabandi Record 2020-21 column 4 entry.',
    evidenceSecondary: 'Calculated GIS Polygon Area (34,200 sq.m).',
    recommendedAction: 'Commission cadastral re-measurement to reconcile digital map with physical ground occupation.',
  },
];

const INITIAL_DOCUMENTS = [
  {
    id: 'DOC-801',
    title: 'Registered Sale Deed - Khasra 142/1 (2018)',
    category: 'Sale Deed / Registry',
    parcelId: 'P-10245',
    caseId: 'DS-2024-001',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    uploadDate: '2024-01-14',
    uploadedBy: 'Suresh Kumar Sharma',
    verificationStatus: 'Verified',
    version: '1.0',
    hash: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    summary: 'Original registered sale deed executed before Sub-Registrar Gurugram South for 2.45 hectares.',
  },
  {
    id: 'DOC-802',
    title: 'Contested Mutation Order - Khasra 142/2 (2021)',
    category: 'Mutation Fard (Jamabandi)',
    parcelId: 'P-10246',
    caseId: 'DS-2024-001',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    uploadDate: '2024-01-20',
    uploadedBy: 'Rakesh Kumar Sharma',
    verificationStatus: 'Pending',
    version: '1.0',
    hash: '0x8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    summary: 'Mutation fard certified copy showing sanad takseem contested by applicant.',
  },
  {
    id: 'DOC-803',
    title: 'Aks Shajra Cadastral Sheet Badshahpur (1:4000)',
    category: 'Aks Shajra (Cadastral Map)',
    parcelId: 'P-10245',
    caseId: 'DS-2024-001',
    fileType: 'PNG',
    fileSize: '6.5 MB',
    uploadDate: '2024-01-24',
    uploadedBy: 'Halqa Patwari',
    verificationStatus: 'Verified',
    version: '1.0',
    hash: '0x3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    summary: 'High-resolution scanned revenue village map showing khasra boundaries 142/1 and 142/2.',
  },
  {
    id: 'DOC-804',
    title: 'DGPS Survey & Field Verification Report',
    category: 'Survey Report',
    parcelId: 'P-10245',
    caseId: 'DS-2024-001',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    uploadDate: '2024-02-10',
    uploadedBy: 'Ananya Deshmukh (Surveyor)',
    verificationStatus: 'Verified',
    version: '1.0',
    hash: '0xcca92fb142a638b89f57dd0e73ae3c97d12f54bca8005691d77b6162a29f1ae4',
    summary: 'Field survey establishing boundary points with sub-centimeter accuracy.',
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: 'APP-2024-101',
    type: 'Boundary Demarcation (Nishandehi)',
    parcelId: 'P-10245',
    khasraNo: '142/1',
    applicantName: 'Suresh Kumar Sharma',
    applicantPhone: '+91 98234 56789',
    submissionDate: '2024-01-10',
    status: 'Field Inspection',
    assignedOfficer: 'Kanoongo Circle Badshahpur',
    feesPaid: 500,
    village: 'Badshahpur',
    district: 'Gurugram',
    stage: 'Total Station demarcation scheduled with Halqa Patwari.',
  },
  {
    id: 'APP-2024-102',
    type: 'Record Correction',
    parcelId: 'P-10249',
    khasraNo: '88/2',
    applicantName: 'Emaar Landmark Estates',
    applicantPhone: '+91 98111 88990',
    submissionDate: '2024-01-25',
    status: 'Under Verification',
    assignedOfficer: 'Revenue Officer Sohna',
    feesPaid: 1200,
    village: 'Wazirabad',
    district: 'Gurugram',
    stage: 'Area discrepancy under administrative reconciliation.',
  },
  {
    id: 'APP-2024-103',
    type: 'Certified Copy (Fard) Request',
    parcelId: 'P-10247',
    khasraNo: '189/4',
    applicantName: 'DLF Commercial Assets Ltd',
    applicantPhone: '+91 98111 00223',
    submissionDate: '2024-02-05',
    status: 'Approved',
    assignedOfficer: 'Digital Record Room NIC',
    feesPaid: 150,
    village: 'Sohna',
    district: 'Gurugram',
    stage: 'Digitally signed fard issued with verifiable QR code.',
  },
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-9901',
    timestamp: '2024-02-28 14:32:10',
    user: 'Shri Vikram Malhotra',
    role: 'Revenue Officer',
    action: 'Verified AI Anomaly Flag',
    module: 'AI Validation',
    recordId: 'AI-2024-8901',
    ipSession: '10.14.88.23 [NIC-SECURE-SESSION]',
    status: 'Success',
    details: 'Official accepted AI anomaly recommendation; issued notice for joint demarcation.',
  },
  {
    id: 'AUD-9902',
    timestamp: '2024-02-28 11:15:44',
    user: 'Suresh Kumar Sharma',
    role: 'Citizen',
    action: 'Registered Dispute Grievance',
    module: 'Dispute Management',
    recordId: 'DS-2024-001',
    ipSession: '192.168.1.104 [CITIZEN-PORTAL]',
    status: 'Success',
    details: 'Grievance submitted against Khasra 142/2 mutation.',
  },
  {
    id: 'AUD-9903',
    timestamp: '2024-02-27 16:45:02',
    user: 'Ananya Deshmukh',
    role: 'Survey Officer',
    action: 'Uploaded DGPS Cadastral Survey',
    module: 'GIS & Survey',
    recordId: 'SRV-8821',
    ipSession: '10.14.92.11 [SURVEY-NET]',
    status: 'Success',
    details: 'Uploaded 4-point DGPS polygon coordinates for Badshahpur Sector 66.',
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    title: 'Urgent Anomaly Flagged for Review',
    message: 'AI detected critical ownership conflict on Khasra 142/1 (Badshahpur). Action required.',
    time: '15 mins ago',
    read: false,
    type: 'warning',
    link: '/ai-validation',
  },
  {
    id: 'NOTIF-002',
    title: 'Dispute Hearing Scheduled',
    message: 'Hearing scheduled for Case DS-2024-001 before SDM Gurugram on 15th of next month.',
    time: '2 hours ago',
    read: false,
    type: 'info',
    link: '/disputes/DS-2024-001',
  },
];

// In-Memory Synchronized Store (Provides immediate fault tolerance and instant query execution)
class DatabaseStore {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.parcels = [...INITIAL_PARCELS];
    this.disputes = [...INITIAL_DISPUTES];
    this.aiAlerts = [...INITIAL_AI_ALERTS];
    this.documents = [...INITIAL_DOCUMENTS];
    this.applications = [...INITIAL_APPLICATIONS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
  }

  // Users
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.users.find((u) => u.id === id);
  }
  getUsers() {
    return this.users;
  }

  // Parcels & GIS
  getParcels({ query = '', district = '', tehsil = '', village = '', landUse = '', status = '' } = {}) {
    let list = this.parcels;
    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.khasraNo.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q)
      );
    }
    if (district) list = list.filter((p) => p.district.toLowerCase() === district.toLowerCase());
    if (tehsil) list = list.filter((p) => p.tehsil.toLowerCase() === tehsil.toLowerCase());
    if (village) list = list.filter((p) => p.village.toLowerCase().includes(village.toLowerCase()));
    if (landUse) list = list.filter((p) => p.landUse.toLowerCase() === landUse.toLowerCase());
    if (status) list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    return list;
  }

  getParcelById(id) {
    return this.parcels.find((p) => p.id === id || p.khasraNo === id);
  }

  updateParcel(id, updates) {
    const idx = this.parcels.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.parcels[idx] = { ...this.parcels[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
      return this.parcels[idx];
    }
    return null;
  }

  getNearbyParcels(lat, lng, radiusMeters = 5000) {
    return this.parcels.filter((p) => {
      if (!p.coordinates) return false;
      const dist = calculateHaversineDistance(lat, lng, p.coordinates[0], p.coordinates[1]);
      return dist <= radiusMeters;
    });
  }

  // Disputes
  getDisputes() {
    return this.disputes;
  }

  getDisputeById(id) {
    return this.disputes.find((d) => d.id === id);
  }

  createDispute(disputeData) {
    const newId = `DS-2024-${String(this.disputes.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newDispute = {
      id: newId,
      parcelId: disputeData.parcelId || 'P-10245',
      secondaryParcelId: disputeData.secondaryParcelId || '',
      title: disputeData.title || 'New Land Grievance',
      category: disputeData.category || 'Boundary Dispute',
      applicant: disputeData.applicant || 'Citizen Applicant',
      applicantPhone: disputeData.applicantPhone || '+91 98000 00000',
      respondent: disputeData.respondent || 'Concerned Party',
      respondentPhone: disputeData.respondentPhone || '+91 98000 00001',
      assignedOfficer: disputeData.assignedOfficer || 'Shri Vikram Malhotra',
      officerDesignation: 'SDM Gurugram',
      priority: disputeData.priority || 'Medium',
      status: 'Complaint',
      filingDate: today,
      lastUpdated: today,
      description: disputeData.description || 'Grievance submitted via Bhumi Setu portal.',
      location: disputeData.location || 'Gurugram District',
      conflictingFields: disputeData.conflictingFields || [],
      timeline: [
        { step: 'Complaint Submitted', date: today, completed: true, remark: 'Initial complaint filed.' },
        { step: 'Verification', date: '', completed: false, remark: 'Awaiting field revenue inspection.' },
        { step: 'Evidence Collection', date: '', completed: false, remark: 'Records submission pending.' },
        { step: 'Officer Review', date: '', completed: false, remark: 'Tribunal examination.' },
        { step: 'Resolution', date: '', completed: false, remark: 'Judicial order.' },
        { step: 'Closure', date: '', completed: false, remark: 'Record update.' },
      ],
      evidenceIds: disputeData.evidenceIds || ['DOC-801'],
    };
    this.disputes.unshift(newDispute);

    // Update parcel status
    if (newDispute.parcelId) {
      this.updateParcel(newDispute.parcelId, { status: 'Under Dispute' });
    }

    return newDispute;
  }

  updateDisputeStatus(id, newStatus, remark = '') {
    const dispute = this.getDisputeById(id);
    if (!dispute) return null;

    const stages = ['Complaint', 'Verification', 'Evidence Collection', 'Review', 'Resolution', 'Closed'];
    const currentStageIndex = stages.indexOf(newStatus);
    const today = new Date().toISOString().split('T')[0];

    dispute.status = newStatus;
    dispute.lastUpdated = today;
    dispute.timeline = dispute.timeline.map((step) => {
      const stepIdx = stages.findIndex((s) => s.toLowerCase().includes(step.step.toLowerCase().slice(0, 4)));
      if (stepIdx <= currentStageIndex) {
        return {
          ...step,
          completed: true,
          date: step.date || today,
          remark: step.remark || (remark && stepIdx === currentStageIndex ? remark : 'Completed by authority'),
        };
      }
      return step;
    });

    return dispute;
  }

  // Documents
  getDocuments() {
    return this.documents;
  }

  getDocumentById(id) {
    return this.documents.find((d) => d.id === id);
  }

  createDocument(doc) {
    const newId = `DOC-${800 + this.documents.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const newDoc = {
      id: newId,
      title: doc.title || 'Uploaded Document',
      category: doc.category || 'Dispute Evidence',
      parcelId: doc.parcelId || 'P-10245',
      caseId: doc.caseId || '',
      fileType: doc.fileType || 'PDF',
      fileSize: doc.fileSize || '2.5 MB',
      uploadDate: today,
      uploadedBy: doc.uploadedBy || 'Official',
      verificationStatus: 'Pending',
      version: '1.0',
      hash: '0x' + Math.random().toString(16).substr(2) + 'a1b2c3d4',
      summary: doc.summary || 'Supporting document uploaded to repository.',
    };
    this.documents.unshift(newDoc);
    return newDoc;
  }

  // AI Flags
  getAiFlags() {
    return this.aiAlerts;
  }

  getAiFlagById(id) {
    return this.aiAlerts.find((a) => a.id === id);
  }

  updateAiFlagStatus(id, status, officerNotes = '') {
    const flag = this.getAiFlagById(id);
    if (!flag) return null;
    flag.status = status;
    flag.officerNotes = officerNotes;
    flag.reviewedAt = new Date().toISOString();
    return flag;
  }

  // Applications
  getApplications() {
    return this.applications;
  }

  createApplication(app) {
    const newId = `APP-2024-${100 + this.applications.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const newApp = {
      id: newId,
      type: app.type || 'Boundary Demarcation (Nishandehi)',
      parcelId: app.parcelId || 'P-10245',
      khasraNo: app.khasraNo || '142/1',
      applicantName: app.applicantName || 'Citizen Applicant',
      applicantPhone: app.applicantPhone || '+91 98000 00000',
      submissionDate: today,
      status: 'Submitted',
      assignedOfficer: 'Revenue Inspection Cell',
      feesPaid: app.feesPaid || 500,
      village: app.village || 'Badshahpur',
      district: app.district || 'Gurugram',
      stage: 'Application Acknowledged & In Queue',
    };
    this.applications.unshift(newApp);
    return newApp;
  }

  // Audit Logs
  getAuditLogs() {
    return this.auditLogs;
  }

  createAuditLog(entry) {
    const newId = `AUD-${9900 + this.auditLogs.length + 1}`;
    const log = {
      id: newId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: entry.user || 'System',
      role: entry.role || 'CITIZEN',
      action: entry.action,
      module: entry.module,
      recordId: entry.recordId,
      ipSession: entry.ipSession || '10.14.88.23',
      status: entry.status || 'Success',
      details: entry.details || '',
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // Notifications
  getNotifications() {
    return this.notifications;
  }

  createNotification(notif) {
    const newId = `NOTIF-${this.notifications.length + 1}`;
    const item = {
      id: newId,
      time: 'Just now',
      read: false,
      ...notif,
    };
    this.notifications.unshift(item);
    return item;
  }
}

export const db = new DatabaseStore();
