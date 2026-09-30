import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  FileText,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  UploadCloud,
  FileCheck,
  ShieldAlert,
  X,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  landRecordService,
  disputeService,
  applicationService,
  documentService,
  notificationService,
} from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';

export const CitizenDashboard = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Search state
  const [searchDistrict, setSearchDistrict] = useState('Gurugram');
  const [searchTehsil, setSearchTehsil] = useState('');
  const [searchVillage, setSearchVillage] = useState('');
  const [searchKhasra, setSearchKhasra] = useState('');
  const [searchOwner, setSearchOwner] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Data lists
  const [myApplications, setMyApplications] = useState([]);
  const [myDisputes, setMyDisputes] = useState([]);
  const [savedParcels, setSavedParcels] = useState([]);

  // Modals
  const [isSubmitAppOpen, setIsSubmitAppOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isRegisterDisputeOpen, setIsRegisterDisputeOpen] = useState(false);

  // Form states
  const [appForm, setAppForm] = useState({
    type: 'Boundary Demarcation (Nishandehi)',
    khasraNo: '142/1',
    applicantName: currentUser?.name || 'Suresh Kumar Sharma',
    applicantPhone: '+91 98101 23456',
    village: 'Badshahpur',
    district: 'Gurugram',
    feesPaid: 1200,
  });

  const [disputeForm, setDisputeForm] = useState({
    title: '',
    category: 'Boundary Dispute',
    parcelId: 'P-10245',
    applicant: currentUser?.name || 'Suresh Kumar Sharma',
    applicantPhone: '+91 98101 23456',
    respondent: '',
    respondentPhone: '',
    priority: 'High',
    description: '',
    location: 'Badshahpur, Gurugram',
  });

  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Dispute Evidence',
    parcelId: 'P-10245',
    fileType: 'PDF',
    summary: '',
  });

  // Load citizen data
  const loadData = () => {
    const apps = applicationService.getAll();
    setMyApplications(apps.slice(0, 5));

    const disputes = disputeService.getAll();
    setMyDisputes(disputes.slice(0, 4));

    const parcels = landRecordService.getAll();
    setSavedParcels(parcels.slice(0, 3));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('bhumi_data_changed', loadData);
    return () => window.removeEventListener('bhumi_data_changed', loadData);
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    e?.preventDefault();
    setHasSearched(true);
    const results = landRecordService.search({
      district: searchDistrict,
      tehsil: searchTehsil,
      village: searchVillage,
      query: searchKhasra || searchOwner,
    });
    setSearchResults(results);
    if (results.length > 0) {
      toast.success('Records Found', `Found ${results.length} land parcels matching criteria.`);
    } else {
      toast.info('No Exact Match', 'Try broadening search terms or village name.');
    }
  };

  // Submit Application
  const handleAppSubmit = (e) => {
    e.preventDefault();
    const created = applicationService.submit({
      ...appForm,
      applicantName: currentUser?.name || appForm.applicantName,
    });
    toast.success('Application Submitted', `Application ${created.id} registered successfully.`);
    setIsSubmitAppOpen(false);
  };

  // Register Dispute
  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeForm.title || !disputeForm.description) {
      toast.error('Required Fields Missing', 'Please provide a title and dispute description.');
      return;
    }
    const created = disputeService.create({
      ...disputeForm,
      applicant: currentUser?.name || disputeForm.applicant,
    });
    toast.success('Dispute Registered', `Case ${created.id} logged for official revenue scrutiny.`);
    setIsRegisterDisputeOpen(false);
    navigate(`/disputes/${created.id}`);
  };

  // Upload Document
  const handleDocSubmit = (e) => {
    e.preventDefault();
    if (!docForm.title) {
      toast.error('Title Required', 'Please provide a document title.');
      return;
    }
    const created = documentService.upload({
      ...docForm,
      uploadedBy: currentUser?.name || 'Citizen User',
    });
    toast.success('Evidence Uploaded', `Document ${created.id} recorded with tamper-proof SHA-256 hash.`);
    setIsUploadDocOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold mb-3 border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Citizen Land Services • Haryana Jan-Sahayak Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {currentUser?.name || 'Suresh Kumar'}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Welcome to your integrated citizen land portal. View digital RoR (Jamabandi), track mutation status, verify
            cadastral boundaries on GIS maps, and lodge grievances with real-time hearing updates.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSubmitAppOpen(true)}
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>New Land Application</span>
            </button>
            <button
              onClick={() => setIsRegisterDisputeOpen(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Register Dispute / Grievance</span>
            </button>
            <button
              onClick={() => setIsUploadDocOpen(true)}
              className="bg-indigo-950/60 hover:bg-indigo-950/80 text-white font-medium text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4 text-amber-300" />
              <span>Upload Evidence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Land Search Form Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Unified Land Record Search</h2>
              <p className="text-xs text-slate-500">
                Search authenticated cadastral Jamabandi records across districts, tehsils, and Khasra numbers.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hidden sm:inline">
            Direct Revenue Sync
          </span>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">District</label>
              <select
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
              >
                <option value="Gurugram">Gurugram</option>
                <option value="Faridabad">Faridabad</option>
                <option value="Pune">Pune</option>
                <option value="Gautam B. Nagar">Gautam Buddha Nagar</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tehsil</label>
              <input
                type="text"
                value={searchTehsil}
                onChange={(e) => setSearchTehsil(e.target.value)}
                placeholder="e.g. Sohna, Wazirabad"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Village (Mauza)</label>
              <input
                type="text"
                value={searchVillage}
                onChange={(e) => setSearchVillage(e.target.value)}
                placeholder="e.g. Badshahpur, Tigra"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Khasra / Parcel No.</label>
              <input
                type="text"
                value={searchKhasra}
                onChange={(e) => setSearchKhasra(e.target.value)}
                placeholder="e.g. 142/1 or P-10245"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600 font-semibold text-indigo-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Owner Name</label>
              <input
                type="text"
                value={searchOwner}
                onChange={(e) => setSearchOwner(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-indigo-700">Quick Try:</span>{' '}
              <button
                type="button"
                onClick={() => {
                  setSearchKhasra('142/1');
                  setSearchVillage('Badshahpur');
                }}
                className="text-indigo-600 hover:underline font-mono"
              >
                Khasra 142/1 (Badshahpur)
              </button>{' '}
              |{' '}
              <button
                type="button"
                onClick={() => {
                  setSearchKhasra('204/3');
                  setSearchVillage('Tigra');
                }}
                className="text-indigo-600 hover:underline font-mono"
              >
                Khasra 204/3 (Tigra)
              </button>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Land Database</span>
            </button>
          </div>
        </form>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-sm font-semibold text-slate-700">No matching land parcels found</p>
                <p className="text-xs text-slate-400 mt-1">Please verify Khasra number or select another village.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                          {parcel.id}
                        </span>
                        <StatusBadge status={parcel.status} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{parcel.ownerName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Khasra: <span className="font-semibold text-slate-700">{parcel.khasraNo}</span> • Khata:{' '}
                        {parcel.khataNo}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {parcel.village}, {parcel.tehsil}, {parcel.district}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                        <span>Area: <strong>{parcel.areaHectares} Ha</strong></span>
                        <span>•</span>
                        <span>Use: <strong>{parcel.landUse}</strong></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        to={`/records/${parcel.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        View Full RoR <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/gis-map?parcel=${parcel.id}`}
                        className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Map
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Citizen Two Columns: Applications & Disputes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. My Applications */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">My Applications & Requests</h2>
            </div>
            <button
              onClick={() => setIsSubmitAppOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              + New Request
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{app.type}</span>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Application ID: <span className="font-mono font-medium">{app.id}</span> • Khasra: {app.khasraNo}
                  </p>
                  <p className="text-[11px] text-indigo-700 font-medium mt-0.5">Stage: {app.stage}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{app.submissionDate}</span>
                  <span className="text-xs font-semibold text-slate-700">₹{app.feesPaid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. My Disputes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">Tracked Disputes & Grievances</h2>
            </div>
            <button
              onClick={() => setIsRegisterDisputeOpen(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              + Register Grievance
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {myDisputes.map((d) => (
              <Link
                key={d.id}
                to={`/disputes/${d.id}`}
                className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-rose-200 bg-slate-50/50 hover:bg-rose-50/30 transition-all flex items-center justify-between block group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700">{d.id}</span>
                    <span className="text-xs font-semibold text-slate-800">{d.category}</span>
                    <StatusBadge status={d.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1 group-hover:text-rose-950 font-medium">
                    {d.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Assigned to: {d.assignedOfficer}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Land Records Showcase */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Saved Land Records (My Khatoni)</h2>
          </div>
          <Link to="/records" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            View All Records →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedParcels.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-indigo-900 bg-indigo-100/60 px-2 py-0.5 rounded">
                    {p.id}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <p className="text-sm font-bold text-slate-900">{p.ownerName}</p>
                <p className="text-xs text-slate-500">
                  Khasra {p.khasraNo} • {p.village}, {p.tehsil}
                </p>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  Area: {p.areaHectares} Ha ({p.landUse})
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <Link to={`/records/${p.id}`} className="text-indigo-600 font-bold hover:underline">
                  Open Record
                </Link>
                <Link to={`/gis-map?parcel=${p.id}`} className="text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> GIS View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Application */}
      {isSubmitAppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Submit New Land Application</h3>
              <button onClick={() => setIsSubmitAppOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAppSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Application Type</label>
                <select
                  value={appForm.type}
                  onChange={(e) => setAppForm({ ...appForm, type: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Boundary Demarcation (Nishandehi)">Boundary Demarcation (Nishandehi)</option>
                  <option value="Name Mutation (Succession)">Name Mutation (Succession / Wirasat)</option>
                  <option value="Record Correction (Fard Badar)">Record Correction (Fard Badar)</option>
                  <option value="NOC for Sale / Encumbrance Certificate">NOC for Sale / Encumbrance Certificate</option>
                  <option value="Certified Map Copy (Aks Shajra)">Certified Map Copy (Aks Shajra)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Khasra Number</label>
                  <input
                    type="text"
                    required
                    value={appForm.khasraNo}
                    onChange={(e) => setAppForm({ ...appForm, khasraNo: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Village</label>
                  <input
                    type="text"
                    required
                    value={appForm.village}
                    onChange={(e) => setAppForm({ ...appForm, village: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Applicant Phone Number</label>
                <input
                  type="text"
                  required
                  value={appForm.applicantPhone}
                  onChange={(e) => setAppForm({ ...appForm, applicantPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                <span>Govt Statutory Application Fee:</span>
                <span className="font-bold text-slate-900">₹{appForm.feesPaid}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitAppOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Pay & Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Dispute */}
      {isRegisterDisputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Register Land Dispute / Grievance</h3>
              </div>
              <button onClick={() => setIsRegisterDisputeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDisputeSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dispute Category</label>
                <select
                  value={disputeForm.category}
                  onChange={(e) => setDisputeForm({ ...disputeForm, category: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Boundary Dispute">Boundary Dispute (Encroachment / Overlap)</option>
                  <option value="Ownership Conflict">Ownership Conflict (Dual Registry / GPA)</option>
                  <option value="Mutation Issue">Mutation Issue (Takseem / Inheritance)</option>
                  <option value="Registration Issue">Registration Issue (Fraudulent Registry)</option>
                  <option value="Land Use Conflict">Land Use Conflict (Common Land Encroachment)</option>
                  <option value="Record Inconsistency">Record Inconsistency (Typo / Area Shortfall)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grievance Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boundary Encroachment on Western Corner of Khasra 142/1"
                  value={disputeForm.title}
                  onChange={(e) => setDisputeForm({ ...disputeForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parcel ID / Khasra</label>
                  <input
                    type="text"
                    required
                    value={disputeForm.parcelId}
                    onChange={(e) => setDisputeForm({ ...disputeForm, parcelId: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Respondent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Opposing party name"
                    value={disputeForm.respondent}
                    onChange={(e) => setDisputeForm({ ...disputeForm, respondent: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description of Dispute</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe conflicting boundaries, registry dates, or disputed area in detail..."
                  value={disputeForm.description}
                  onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterDisputeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Register Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload Land Deed or Evidence</h3>
              <button onClick={() => setIsUploadDocOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDocSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Category</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Dispute Evidence">Dispute Evidence</option>
                  <option value="Land Record">Land Record (Jamabandi / Khatoni)</option>
                  <option value="Registration">Sale Deed / Conveyance</option>
                  <option value="Survey Document">Survey / Field Sketch (Aks Shajra)</option>
                  <option value="Mutation">Mutation Order</option>
                  <option value="Notice">Legal Notice / Affidavit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Sale Deed 1984 Copy"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">File Upload</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Click or drag simulated PDF/Scan file here</p>
                  <p className="text-[10px] text-slate-400">PDF, JPG, PNG or GEOJSON (Max 15MB)</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDocOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Upload & Sign Hash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
