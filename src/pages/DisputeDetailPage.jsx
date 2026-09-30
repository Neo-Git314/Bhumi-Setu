import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Columns,
  Scale,
  FileText,
  User,
  AlertTriangle,
  UploadCloud,
  ChevronRight,
  Download,
  Calendar,
  X,
  Check,
} from 'lucide-react';
import { disputeService, landRecordService, documentService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const DisputeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, isCitizen } = useAuth();

  const [dispute, setDispute] = useState(null);
  const [parcel, setParcel] = useState(null);
  const [evidenceDocs, setEvidenceDocs] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [nextStage, setNextStage] = useState('');
  const [officerRemark, setOfficerRemark] = useState('');

  const loadData = () => {
    const d = disputeService.getById(id);
    if (d) {
      setDispute(d);
      const p = landRecordService.getById(d.parcelId);
      setParcel(p);

      // Load attached evidence
      const allDocs = documentService.getAll();
      const matched = allDocs.filter(
        (doc) => (d.evidenceIds && d.evidenceIds.includes(doc.id)) || doc.caseId === d.id || doc.parcelId === d.parcelId
      );
      setEvidenceDocs(matched);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('bhumi_data_changed', loadData);
    return () => window.removeEventListener('bhumi_data_changed', loadData);
  }, [id]);

  if (!dispute) {
    return (
      <div className="py-20 text-center">
        <p className="text-base font-semibold text-slate-700">Dispute case not found</p>
        <Link to="/disputes" className="text-xs text-indigo-600 font-bold hover:underline mt-2 inline-block">
          Return to Disputes Roster
        </Link>
      </div>
    );
  }

  const allStages = ['Complaint', 'Verification', 'Evidence Collection', 'Review', 'Resolution', 'Closed'];

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!nextStage) return;

    disputeService.updateStatus(dispute.id, nextStage, officerRemark);
    toast.success('Dispute Stage Updated', `Case ${dispute.id} advanced to ${nextStage}`);
    setIsStatusModalOpen(false);
    setOfficerRemark('');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/disputes" className="hover:text-indigo-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Disputes
          </Link>
          <span>/</span>
          <span className="font-mono font-bold text-slate-800">{dispute.id}</span>
          <span>/</span>
          <span className="text-slate-400">{dispute.category}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Columns className="w-4 h-4" />
            <span>Compare Records Side-by-Side</span>
          </button>

          {!isCitizen && (
            <button
              onClick={() => {
                setNextStage(dispute.status === 'Complaint' ? 'Verification' : 'Review');
                setIsStatusModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4 text-amber-300" />
              <span>Update Case Proceeding</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Case Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-mono font-extrabold text-xs text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                {dispute.id}
              </span>
              <StatusBadge status={dispute.status} />
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                {dispute.category}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                  dispute.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {dispute.priority} Priority
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{dispute.title}</h1>
            <p className="text-xs text-slate-600 mt-2 max-w-3xl leading-relaxed">{dispute.description}</p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{dispute.location}</span>
            </p>
          </div>

          {/* Quick Parcel Link Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 lg:w-72 shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Target Land Parcel</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-indigo-700 text-sm">{dispute.parcelId}</span>
              <Link
                to={`/gis-map?parcel=${dispute.parcelId}`}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" /> GIS Map
              </Link>
            </div>
            {parcel && (
              <p className="text-xs text-slate-600 mt-1">
                Owner: <strong>{parcel.ownerName}</strong> ({parcel.areaHectares} Ha)
              </p>
            )}
            <Link
              to={`/records/${dispute.parcelId}`}
              className="text-[11px] text-indigo-600 hover:underline font-semibold block mt-2"
            >
              View Full Jamabandi Record →
            </Link>
          </div>
        </div>
      </div>

      {/* Case Parties Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Applicant / Complainant</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{dispute.applicant}</p>
          <p className="text-xs text-slate-500 mt-0.5">Phone: {dispute.applicantPhone}</p>
          <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Aadhaar Verified Title Claimant
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase">
            <User className="w-4 h-4 text-rose-600" />
            <span>Respondent / Contesting Party</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{dispute.respondent || 'Adjacent Plot Owner'}</p>
          <p className="text-xs text-slate-500 mt-0.5">Phone: {dispute.respondentPhone || 'Summons Served via Notice'}</p>
          <span className="inline-block mt-2 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Show Cause Notice Issued
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Assigned Adjudicating Authority</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{dispute.assignedOfficer}</p>
          <p className="text-xs text-slate-500 mt-0.5">{dispute.officerDesignation}</p>
          <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Revenue Court Jurisdiction
          </span>
        </div>
      </div>

      {/* Visual Case Lifecycle Stepper (Timeline) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-6">Case Proceeding Timeline & Evidence Audit</h2>

        <div className="space-y-6 relative pl-6 sm:pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {dispute.timeline.map((step, idx) => (
            <div key={idx} className="relative group">
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  step.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300 text-slate-300'
                }`}
              >
                {step.completed ? <Check className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-3xl">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900">{step.step}</h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {step.date ? step.date : 'Pending Stage'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.remark || 'Proceeding scheduled following preliminary revenue notice.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflicting Fields Side-by-Side Snapshot */}
      {dispute.conflictingFields && dispute.conflictingFields.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Conflicting Information Comparison</h2>
            </div>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Full Screen Diff →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Field / Attribute</th>
                  <th className="py-2.5 px-3 text-indigo-900">Applicant Record ({dispute.applicant})</th>
                  <th className="py-2.5 px-3 text-rose-900">Contested Record ({dispute.respondent})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispute.conflictingFields.map((cf, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-700">{cf.field}</td>
                    <td className="py-3 px-3 text-slate-800 bg-indigo-50/30 font-medium">{cf.recordA}</td>
                    <td className="py-3 px-3 text-rose-900 bg-rose-50/30 font-medium">{cf.recordB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence & Case Documents */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Evidence & Supporting Documents ({evidenceDocs.length})</h2>
          </div>
          <Link to="/documents" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
            Upload More Evidence →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-700">{doc.id}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border">
                    {doc.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doc.summary}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-mono truncate">Hash: {doc.hash}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{doc.fileType} • {doc.fileSize}</span>
                <button
                  onClick={() => toast.info('Evidence Download', `Downloading verified copy of ${doc.id}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Update Case Proceeding Stage */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Update Case Proceeding Stage</h3>
              </div>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Stage</label>
                <select
                  value={nextStage}
                  onChange={(e) => setNextStage(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300"
                >
                  {allStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Officer Order / Proceeding Remark
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record judicial observations, field survey instructions, or final orders..."
                  value={officerRemark}
                  onChange={(e) => setOfficerRemark(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Sign & Advance Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Compare Records Side-by-Side */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Side-by-Side Disputed Record Examination</h3>
                <p className="text-xs text-slate-500">Case ID: {dispute.id} • Khasra 142/1 vs 142/2</p>
              </div>
              <button onClick={() => setIsCompareOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-xs space-y-3">
                <span className="font-bold text-indigo-950 block text-sm border-b pb-1">
                  Applicant: {dispute.applicant}
                </span>
                <div>
                  <span className="text-slate-400 block text-[10px]">Registered Parcel:</span>
                  <span className="font-bold text-slate-800">P-10245 (Khasra 142/1)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Title Deed Date:</span>
                  <span className="font-bold text-slate-800">12-March-1984 (Deed No. 412)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Recorded Area:</span>
                  <span className="font-bold text-slate-800">1.84 Hectares</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Eastern Demarcation Peg:</span>
                  <span className="font-bold text-slate-800">Irrigation Canal Distributary 4 Boundary</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Patwari Field Report:</span>
                  <span className="font-medium text-emerald-800 bg-emerald-50 p-1.5 rounded block mt-1">
                    Continuous crop cultivation verified on 1.84 Ha since 1984.
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs space-y-3">
                <span className="font-bold text-rose-950 block text-sm border-b pb-1">
                  Respondent: {dispute.respondent}
                </span>
                <div>
                  <span className="text-slate-400 block text-[10px]">Registered Parcel:</span>
                  <span className="font-bold text-slate-800">P-10246 (Khasra 142/2)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Title Deed Date:</span>
                  <span className="font-bold text-slate-800">05-November-2019 (Deed No. 891)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Recorded Area:</span>
                  <span className="font-bold text-rose-900 bg-rose-100 p-0.5 rounded">
                    1.45 Hectares (Includes 0.35 Ha Overlap)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Western Demarcation Peg:</span>
                  <span className="font-bold text-slate-800">Private Surveyor Iron Peg 2019</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Patwari Field Report:</span>
                  <span className="font-medium text-rose-800 bg-rose-100/60 p-1.5 rounded block mt-1">
                    Private iron peg encroaches 12 meters into 1984 Jamabandi boundary.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsCompareOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
