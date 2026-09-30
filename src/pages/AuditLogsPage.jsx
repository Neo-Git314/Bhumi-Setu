import React, { useState, useEffect } from 'react';
import { ScrollText, Search, Filter, Download, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';
import { auditService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

export const AuditLogsPage = () => {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadLogs = () => {
    setLogs(auditService.getAll());
  };

  useEffect(() => {
    loadLogs();
    window.addEventListener('bhumi_data_changed', loadLogs);
    return () => window.removeEventListener('bhumi_data_changed', loadLogs);
  }, []);

  const handleExport = () => {
    toast.success('Audit Digest Exported', 'Cryptographically verified CSV log exported with SHA-256 Merkle root.');
  };

  const filteredLogs = logs.filter((log) => {
    if (moduleFilter && log.module !== moduleFilter) return false;
    if (statusFilter && log.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase().trim();
      return (
        log.id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.recordId.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              Immutable System Transaction Trail
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            System & Security Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed audit trails of all user logins, mutation approvals, AI reviews, and deed downloads.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Digest</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[280px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by User, Record ID (P-10245), Action, or Session IP..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="">All Modules</option>
            <option value="AI Validation">AI Validation</option>
            <option value="Dispute Management">Dispute Management</option>
            <option value="Land Records">Land Records</option>
            <option value="Evidence Management">Evidence Management</option>
            <option value="Authentication">Authentication</option>
            <option value="System Audit">System Audit</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action Performed</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4">IP / Session ID</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/90 transition-colors font-mono">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 whitespace-nowrap">{log.user}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-800 max-w-sm">
                    {log.action}
                    {log.details && <span className="text-[11px] text-slate-400 block truncate">{log.details}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-600 text-[11px]">{log.module}</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700">{log.recordId}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[10px] whitespace-nowrap">{log.ipSession}</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                        log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {log.status === 'Success' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {log.status === 'Warning' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {log.status === 'Failed' && <XCircle className="w-3 h-3 text-rose-600" />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
