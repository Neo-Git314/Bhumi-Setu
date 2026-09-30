import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  PlusCircle,
  Clock,
  ArrowRight,
  Scale,
  FileText,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';
import { disputeService, landRecordService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const DisputeManagementPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { currentUser, isCitizen } = useAuth();

  const [disputes, setDisputes] = useState([]);
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Registration Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Boundary Dispute',
    parcelId: 'P-10245',
    applicant: currentUser?.name || 'Citizen Applicant',
    applicantPhone: '+91 98101 23456',
    respondent: '',
    respondentPhone: '',
    priority: 'High',
    description: '',
    location: 'Badshahpur, Gurugram',
  });

  const loadDisputes = () => {
    setDisputes(disputeService.getAll());
  };

  useEffect(() => {
    loadDisputes();
    window.addEventListener('bhumi_data_changed', loadDisputes);
    return () => window.removeEventListener('bhumi_data_changed', loadDisputes);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Missing Fields', 'Please complete title and description');
      return;
    }
    const created = disputeService.create({
      ...form,
      applicant: currentUser?.name || form.applicant,
    });
    toast.success('Dispute Case Registered', `Case ${created.id} initiated in revenue grievance registry.`);
    setIsRegisterOpen(false);
    navigate(`/disputes/${created.id}`);
  };

  const filteredDisputes = disputes.filter((d) => {
    if (filterCategory && d.category !== filterCategory) return false;
    if (filterStatus && d.status !== filterStatus) return false;
    if (query) {
      const q = query.toLowerCase().trim();
      return (
        d.id.toLowerCase().includes(q) ||
        d.parcelId.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.applicant.toLowerCase().includes(q) ||
        d.respondent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stages = [
    { title: 'Complaint', desc: 'Filing & Token Generation' },
    { title: 'Verification', desc: 'Patwari Ground Inspection' },
    { title: 'Evidence Collection', desc: 'DGPS Maps & Historical Deeds' },
    { title: 'Review', desc: 'Tribunal Bench Examination' },
    { title: 'Resolution', desc: 'Quasi-Judicial Sanction Order' },
    { title: 'Closure', desc: 'Digital Record-of-Rights Updated' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              Quasi-Judicial Dispute Resolution Framework
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Land Dispute Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent end-to-end case tracking from initial grievance to spatial reconciliation and judicial closure.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Dispute</span>
        </button>
      </div>

      {/* 6-Stage Dispute Lifecycle Visual Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Statutory 6-Stage Dispute Resolution Workflow
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={stage.title}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-600 font-mono">STEP 0{idx + 1}</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{stage.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[280px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Case ID (DS-2024-001), Parcel, Applicant..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="">All Categories</option>
            <option value="Boundary Dispute">Boundary Dispute</option>
            <option value="Ownership Conflict">Ownership Conflict</option>
            <option value="Mutation Issue">Mutation Issue</option>
            <option value="Registration Issue">Registration Issue</option>
            <option value="Land Use Conflict">Land Use Conflict</option>
            <option value="Record Inconsistency">Record Inconsistency</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="">All Stages</option>
            <option value="Complaint">Complaint</option>
            <option value="Verification">Verification</option>
            <option value="Evidence Collection">Evidence Collection</option>
            <option value="Review">Review</option>
            <option value="Resolution">Resolution</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Disputes Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Parcel ID</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Parties (Applicant / Respondent)</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisputes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/disputes/${d.id}`}
                      className="font-mono font-bold text-rose-700 hover:underline"
                    >
                      {d.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    <Link to={`/records/${d.parcelId}`} className="hover:underline text-indigo-600">
                      {d.parcelId}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{d.category}</td>
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <span className="font-bold text-slate-900 block truncate">{d.applicant}</span>
                    <span className="text-[10px] text-slate-500 block truncate">vs {d.respondent}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px] truncate max-w-[150px]">
                    {d.assignedOfficer}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        d.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : d.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {d.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{d.lastUpdated}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/disputes/${d.id}`}
                      className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1"
                    >
                      <span>Open Case</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Dispute */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Register New Land Dispute Case</h3>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dispute Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Boundary Dispute">Boundary Dispute (Spatial Encroachment)</option>
                  <option value="Ownership Conflict">Ownership Conflict (Conflicting Titles / GPA)</option>
                  <option value="Mutation Issue">Mutation Issue (Contested Succession / Wirasat)</option>
                  <option value="Registration Issue">Registration Issue (Fraudulent Registry Deed)</option>
                  <option value="Land Use Conflict">Land Use Conflict (Encroachment on Common Land)</option>
                  <option value="Record Inconsistency">Record Inconsistency (Typo / Area Shortfall)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grievance Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boundary Encroachment on Western Boundary of Khasra 142/1"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parcel ID</label>
                  <input
                    type="text"
                    required
                    value={form.parcelId}
                    onChange={(e) => setForm({ ...form, parcelId: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Applicant Name</label>
                  <input
                    type="text"
                    required
                    value={form.applicant}
                    onChange={(e) => setForm({ ...form, applicant: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Respondent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Opposing party"
                    value={form.respondent}
                    onChange={(e) => setForm({ ...form, respondent: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dispute Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the conflicting claims, dates, and evidence..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Register Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
