import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  MapPin,
  FileText,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Clock,
  Printer,
  ChevronRight,
  X,
  Scale,
} from 'lucide-react';
import { landRecordService, documentService, disputeService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const LandRecordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();

  const [parcel, setParcel] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'documents'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    category: 'Boundary Dispute',
    description: '',
  });

  useEffect(() => {
    const p = landRecordService.getById(id);
    if (p) {
      setParcel(p);
      const docs = documentService.getByParcel(p.id);
      setDocuments(docs);
    }
  }, [id]);

  if (!parcel) {
    return (
      <div className="py-20 text-center">
        <p className="text-base font-semibold text-slate-700">Land Record not found</p>
        <Link to="/records" className="text-xs text-indigo-600 font-bold hover:underline mt-2 inline-block">
          Return to Records Repository
        </Link>
      </div>
    );
  }

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.description) {
      toast.error('Fields Missing', 'Please fill in title and description');
      return;
    }

    const created = disputeService.create({
      parcelId: parcel.id,
      title: reportForm.title,
      category: reportForm.category,
      applicant: currentUser?.name || 'Citizen Applicant',
      description: reportForm.description,
      location: `${parcel.village}, ${parcel.tehsil}, ${parcel.district}`,
    });

    toast.success('Dispute Logged', `Case ${created.id} registered for parcel ${parcel.id}`);
    setIsReportModalOpen(false);
    navigate(`/disputes/${created.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/records" className="hover:text-indigo-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Records
          </Link>
          <span>/</span>
          <span className="text-slate-400">{parcel.district}</span>
          <span>/</span>
          <span className="text-slate-400">{parcel.village}</span>
          <span>/</span>
          <span className="font-mono font-bold text-slate-800">{parcel.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            title="Print Certified RoR Copy"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print RoR</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-mono font-black text-sm text-indigo-900 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                {parcel.id}
              </span>
              <StatusBadge status={parcel.status} />
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                Survey No: {parcel.surveyNo}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {parcel.ownerName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Lineage / S/o: <span className="font-medium text-slate-700">{parcel.fatherName}</span>
              {parcel.coOwners.length > 0 && (
                <span> • Co-Holders: {parcel.coOwners.join(', ')}</span>
              )}
            </p>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>
                Khasra <strong>{parcel.khasraNo}</strong>, Khata <strong>{parcel.khataNo}</strong>, Mauza{' '}
                <strong>{parcel.village}</strong>, Tehsil {parcel.tehsil}, District {parcel.district}, Haryana
              </span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to={`/gis-map?parcel=${parcel.id}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>View on GIS Map</span>
            </Link>

            <button
              onClick={() => setActiveTab('documents')}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Deeds & Documents ({documents.length})</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Report Issue / Dispute</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-100 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            RoR Overview & Metadata
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Record History & Mutation Chain ({parcel.history.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Evidence & Verified Documents ({documents.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2 Cols: Main Attributes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Attributes Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Statutory Cadastral Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Total Recorded Area</span>
                  <span className="text-base font-extrabold text-slate-900 mt-1 block">
                    {parcel.areaHectares} Hectares
                  </span>
                  <span className="text-slate-500 text-[11px]">({parcel.areaSqMeters.toLocaleString()} Sq. Meters)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Classified Land Use</span>
                  <span className="text-base font-extrabold text-indigo-900 mt-1 block">{parcel.landUse}</span>
                  <span className="text-slate-500 text-[11px]">Soil: {parcel.soilType}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Registration Status</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{parcel.registrationStatus}</span>
                  <span className="text-slate-500 text-[11px]">DILRMP Certified Electronic Register</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Mutation (Intiqal) Status</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{parcel.mutationStatus}</span>
                  <span className="text-slate-500 text-[11px]">Last Audited: {parcel.lastUpdated}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Irrigation Source</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{parcel.irrigationSource}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Encumbrance Status</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">{parcel.encumbranceStatus}</span>
                </div>
              </div>
            </div>

            {/* Valuation Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Revenue Valuation & Circle Rates
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-[11px] font-semibold text-indigo-700 uppercase">Estimated Market Value</span>
                  <p className="text-xl font-black text-indigo-950 mt-1">₹{(parcel.marketValue / 10000000).toFixed(2)} Cr</p>
                  <p className="text-[11px] text-indigo-600">Based on recent tehsil circle benchmarks</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Statutory Circle Rate</span>
                  <p className="text-xl font-bold text-slate-800 mt-1">₹{(parcel.circleRate / 10000000).toFixed(2)} Cr/Ha</p>
                  <p className="text-[11px] text-slate-400">Gazetted Collector Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* 1 Col: AI Summary & GIS Polygon Coordinates */}
          <div className="space-y-6">
            {/* AI Analysis Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">AI Integrity Scan Summary</h3>
              </div>

              {parcel.status === 'AI Flagged' ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span>Boundary Inconsistency Flagged</span>
                    <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">94% Confidence</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    AI GIS Engine identified coordinate divergence along the Eastern boundary overlapping with adjacent
                    parcel {parcel.conflictWith || 'P-10246'}.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to="/ai-validation"
                      className="text-xs font-bold text-amber-900 underline hover:text-amber-700"
                    >
                      Open Anomaly Diff →
                    </Link>
                  </div>
                </div>
              ) : parcel.status === 'Under Dispute' ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                  <span className="font-bold text-rose-900 block">Active Dispute Registered</span>
                  <p className="text-rose-700 leading-relaxed">
                    Case DS-2024-001 is pending hearing before SDM Revenue Court. Mutation transfers remain stayed.
                  </p>
                  <Link
                    to="/disputes/DS-2024-001"
                    className="text-xs font-bold text-rose-800 underline hover:text-rose-900 block"
                  >
                    View Court Proceedings →
                  </Link>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clean Record — No Anomalies</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed">
                    Cross-referenced against digitized Khatoni, Sub-Registrar Book 1, and SVAMITVA survey coordinates. 0
                    overlaps detected.
                  </p>
                </div>
              )}
            </div>

            {/* Spatial Coordinates Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Cadastral Boundary Nodes</span>
                <span className="text-[10px] text-slate-400 font-mono">EPSG:4326 (WGS84)</span>
              </h3>
              <div className="space-y-1.5 font-mono text-xs">
                {parcel.coordinates.map((coord, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700"
                  >
                    <span className="text-indigo-600 font-bold">Node #{idx + 1}</span>
                    <span>{coord[0].toFixed(4)}° N, {coord[1].toFixed(4)}° E</span>
                  </div>
                ))}
              </div>
              <Link
                to={`/gis-map?parcel=${parcel.id}`}
                className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Inspect Polygon on GIS</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: History & Mutation Chain */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-6">Chronological Ownership & Mutation Chain</h2>
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
            {parcel.history.map((event, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-900">{event.date}</span>
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Officer: {event.by}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Linked Certified Documents & Evidence</h2>
              <p className="text-xs text-slate-500">Digitized records linked to Parcel {parcel.id}</p>
            </div>
            <Link
              to="/documents"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Open Full Repository →
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-xs font-semibold text-slate-600">No standalone documents attached to this parcel yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {doc.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                        {doc.fileType} • {doc.fileSize}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{doc.summary}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-mono truncate">
                      SHA256: {doc.hash}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Uploaded {doc.uploadDate}</span>
                    <button
                      onClick={() => toast.info('Document Download', `Downloading certified copy of ${doc.id}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Report Issue / Dispute */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Report Inconsistency or Grievance</h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Issue Category</label>
                <select
                  value={reportForm.category}
                  onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Boundary Dispute">Boundary Dispute / Encroachment</option>
                  <option value="Ownership Conflict">Ownership Conflict / Dual Claim</option>
                  <option value="Mutation Issue">Mutation Issue / Incomplete Wirasat</option>
                  <option value="Land Use Conflict">Land Use Conflict / Buffer Breach</option>
                  <option value="Record Inconsistency">Typo / Area Shortfall in Digitization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title of Grievance</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overlapping fence constructed on East corner"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe conflicting facts, survey markers, or deeds..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  File Official Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
