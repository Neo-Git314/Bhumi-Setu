import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Columns,
  MapPin,
  ArrowRight,
  ShieldAlert,
  FileText,
  Filter,
  Layers,
  Scale,
  X,
  Check,
} from 'lucide-react';
import { aiValidationService, landRecordService, disputeService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { useToast } from '../context/ToastContext';

export const AiValidationPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [selectedAlertForCompare, setSelectedAlertForCompare] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadAlerts = () => {
    setAlerts(aiValidationService.getAll());
  };

  useEffect(() => {
    loadAlerts();
    window.addEventListener('bhumi_data_changed', loadAlerts);
    return () => window.removeEventListener('bhumi_data_changed', loadAlerts);
  }, []);

  const handleMarkVerified = (alert) => {
    aiValidationService.updateStatus(alert.id, 'Verified', 'Verified by Revenue Officer after inspecting deeds');
    toast.success('AI Flag Verified & Cleared', `Alert ${alert.id} resolved. Parcel record updated.`);
    if (selectedAlertForCompare?.id === alert.id) setSelectedAlertForCompare(null);
  };

  const handleDismiss = (alert) => {
    aiValidationService.updateStatus(alert.id, 'Dismissed', 'Dismissed by Revenue Officer as permissible variance');
    toast.info('Alert Dismissed', `Alert ${alert.id} marked as dismissed.`);
    if (selectedAlertForCompare?.id === alert.id) setSelectedAlertForCompare(null);
  };

  const handleOpenDisputeFromAi = (alert) => {
    const created = disputeService.create({
      parcelId: alert.parcelId,
      title: `${alert.issueType}: ${alert.description.slice(0, 60)}...`,
      category: alert.issueType.includes('Boundary') ? 'Boundary Dispute' : 'Ownership Conflict',
      applicant: 'Revenue Department Suo Motu',
      description: `Formal inquiry initiated following AI verification flag ${alert.id}. ${alert.details}`,
      priority: 'High',
    });
    toast.success('Dispute Case Registered', `Case ${created.id} initiated for tribunal inquiry.`);
    setSelectedAlertForCompare(null);
    navigate(`/disputes/${created.id}`);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterType && a.issueType !== filterType) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    return true;
  });

  // Calculate summary counts
  const totalAnalyzed = 48536;
  const duplicatesCount = alerts.filter((a) => a.issueType.toLowerCase().includes('duplicate')).length;
  const conflictingCount = alerts.filter((a) => a.issueType.toLowerCase().includes('conflict')).length;
  const overlapsCount = alerts.filter((a) => a.issueType.toLowerCase().includes('overlap')).length;
  const missingCount = alerts.filter((a) => a.issueType.toLowerCase().includes('missing')).length;

  // Retrieve parcels for comparison modal
  const parcelA = selectedAlertForCompare ? landRecordService.getById(selectedAlertForCompare.parcelId) : null;
  const parcelB =
    selectedAlertForCompare && selectedAlertForCompare.conflictingParcelId
      ? landRecordService.getById(selectedAlertForCompare.conflictingParcelId)
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              NLP & Geospatial AI Validation Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Automated Land Data Quality & Inconsistency Detection
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous scanning of digitized Jamabandi, cadastral polygon coordinates, and Sub-Registrar deed transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/officer/dashboard"
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Mandatory Human-in-the-Loop Statutory Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-amber-900 shadow-2xs">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-extrabold text-amber-950 uppercase tracking-wide">
            Statutory AI Protocol — Human In The Loop:
          </span>{' '}
          AI suggestions and confidence scores serve exclusively as decision-support alerts. Under Indian Land Revenue
          Acts, AI models do <strong>NOT</strong> make ownership or boundary determinations. All flagged records
          require mandatory review and digital signing by authorized Revenue Officers.
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Records Analyzed"
          value={totalAnalyzed.toLocaleString()}
          icon={Layers}
          color="indigo"
          subtitle="99.2% Pipeline Health"
        />
        <StatCard
          title="Potential Duplicates"
          value={duplicatesCount}
          icon={Sparkles}
          color="amber"
          subtitle="NLP Deed Matching"
        />
        <StatCard
          title="Conflicting Records"
          value={conflictingCount}
          icon={ShieldAlert}
          color="rose"
          subtitle="Cross-Registry Check"
        />
        <StatCard
          title="Possible Overlaps"
          value={overlapsCount}
          icon={AlertTriangle}
          color="purple"
          subtitle="Cadastral GIS Intersect"
        />
        <StatCard
          title="Missing Data"
          value={missingCount}
          icon={FileText}
          color="blue"
          subtitle="OCR & Metadata Gap"
        />
      </div>

      {/* Filter and Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Alerts Queue ({filteredAlerts.length})</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <option value="">All Issue Types</option>
              <option value="Possible Boundary Overlap">Possible Boundary Overlap</option>
              <option value="Duplicate Record">Duplicate Record</option>
              <option value="Land Use Mismatch">Land Use Mismatch</option>
              <option value="Conflicting Records">Conflicting Records</option>
              <option value="Missing Data">Missing Data</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Verified">Verified</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Alert ID</th>
                <th className="py-3.5 px-4">Parcel ID</th>
                <th className="py-3.5 px-4">Issue Type</th>
                <th className="py-3.5 px-4">AI Confidence</th>
                <th className="py-3.5 px-4">Anomaly Description</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Human Officer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">{alert.id}</td>
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/records/${alert.parcelId}`}
                      className="font-mono text-indigo-600 hover:underline font-semibold"
                    >
                      {alert.parcelId}
                    </Link>
                    {alert.conflictingParcelId && (
                      <span className="text-[10px] text-slate-400 block">
                        vs{' '}
                        <Link to={`/records/${alert.conflictingParcelId}`} className="text-rose-600 hover:underline">
                          {alert.conflictingParcelId}
                        </Link>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {alert.issueType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            alert.confidence > 90
                              ? 'bg-rose-500'
                              : alert.confidence > 80
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${alert.confidence}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700">{alert.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="font-medium text-slate-800">{alert.description}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{alert.details}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={alert.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedAlertForCompare(alert)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                      title="Compare Conflicting Records Side-by-Side"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Compare</span>
                    </button>

                    {alert.status === 'Pending Review' && (
                      <>
                        <button
                          onClick={() => handleMarkVerified(alert)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Verify & Resolve Alert"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() => handleDismiss(alert)}
                          className="px-2 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Dismiss Alert"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Record Comparison Modal */}
      {selectedAlertForCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {selectedAlertForCompare.id}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {selectedAlertForCompare.confidence}% AI Match
                  </span>
                  <StatusBadge status={selectedAlertForCompare.status} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Side-by-Side Record Conflict Reconciliation
                </h3>
                <p className="text-xs text-slate-500">{selectedAlertForCompare.description}</p>
              </div>
              <button
                onClick={() => setSelectedAlertForCompare(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Diff Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Left Record */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-100">
                  <span className="font-mono font-bold text-xs text-indigo-900">
                    Primary Record: {parcelA ? parcelA.id : selectedAlertForCompare.parcelId}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    Current RoR
                  </span>
                </div>

                {parcelA ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Owner Name:</span>
                      <span className="font-bold text-slate-900">{parcelA.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Khasra / Khata:</span>
                      <span className="font-semibold text-slate-800">{parcelA.khasraNo} ({parcelA.khataNo})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Recorded Area:</span>
                      <span className="font-bold text-slate-900">{parcelA.areaHectares} Ha ({parcelA.areaSqMeters} m²)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Land Use:</span>
                      <span className="font-medium text-slate-800">{parcelA.landUse}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Village & Tehsil:</span>
                      <span className="font-medium text-slate-800">{parcelA.village}, {parcelA.tehsil}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Registration Info:</span>
                      <span className="font-mono text-slate-700 text-[11px]">{parcelA.registrationStatus}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Record data unavailable.</p>
                )}
              </div>

              {/* Right Record (Conflicting) */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-100">
                  <span className="font-mono font-bold text-xs text-rose-900">
                    Conflicting Deed / Record: {parcelB ? parcelB.id : selectedAlertForCompare.conflictingParcelId || 'Adjacent Boundary Peg'}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Contested Claim
                  </span>
                </div>

                {parcelB ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Contesting Owner:</span>
                      <span className="font-bold text-slate-900">{parcelB.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Khasra / Khata:</span>
                      <span className="font-semibold text-slate-800">{parcelB.khasraNo} ({parcelB.khataNo})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Registered Area:</span>
                      <span className="font-bold text-rose-900 bg-rose-100/60 px-1 py-0.5 rounded">
                        {parcelB.areaHectares} Ha (0.35 Ha Overlap Claimed)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Land Use:</span>
                      <span className="font-medium text-slate-800">{parcelB.landUse}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Village & Tehsil:</span>
                      <span className="font-medium text-slate-800">{parcelB.village}, {parcelB.tehsil}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Contested Registration:</span>
                      <span className="font-mono text-slate-700 text-[11px]">{parcelB.registrationStatus}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-slate-700">
                    <p className="font-medium text-rose-950">AI Anomaly Details:</p>
                    <p className="text-[11px] leading-relaxed">{selectedAlertForCompare.details}</p>
                    <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-900 text-[11px]">
                      Recommended Action: {selectedAlertForCompare.suggestedAction}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Officer Action Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link
                  to={`/gis-map?parcel=${selectedAlertForCompare.parcelId}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspect on GIS</span>
                </Link>
                <button
                  onClick={() => handleOpenDisputeFromAi(selectedAlertForCompare)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Open Dispute Proceeding</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDismiss(selectedAlertForCompare)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Dismiss as Valid Variance
                </button>
                <button
                  onClick={() => handleMarkVerified(selectedAlertForCompare)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Verified & Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
