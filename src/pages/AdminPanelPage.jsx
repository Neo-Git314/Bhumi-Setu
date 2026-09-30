import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Users,
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  Shield,
  Layers,
  Map,
  FileCheck2,
  Lock,
  ArrowRight,
  Database,
  Radio,
  Cpu,
} from 'lucide-react';
import { DEMO_USERS, USER_ROLES } from '../data/mockData';
import { useToast } from '../context/ToastContext';

export const AdminPanelPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('integrations'); // 'integrations' | 'users' | 'health'
  const [users, setUsers] = useState(DEMO_USERS);
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock Integrations Status
  const [integrations, setIntegrations] = useState([
    {
      id: 'DILRMP-STATE',
      name: 'State Land Records (Haryana Jamabandi / DILRMP)',
      category: 'Land Records',
      status: 'Operational',
      latency: '42 ms',
      lastSync: '10 mins ago',
      recordsSynced: '48,520 Parcels',
      protocol: 'REST / e-Gov XML 2.0',
    },
    {
      id: 'BHUNAKSHA-GIS',
      name: 'Bhunaksha Cadastral GeoServer (NIC)',
      category: 'GIS & Spatial Data',
      status: 'Operational',
      latency: '68 ms',
      lastSync: '25 mins ago',
      recordsSynced: '312 Cadastral Sheets',
      protocol: 'WMS / WFS GeoJSON',
    },
    {
      id: 'SVAMITVA-SOI',
      name: 'Survey of India CORS Drone Network (SVAMITVA)',
      category: 'Survey Data',
      status: 'Operational',
      latency: '85 ms',
      lastSync: '1 hour ago',
      recordsSynced: '1,420 Drone Ortho-Mosaics',
      protocol: 'DGPS Shapefile Sync',
    },
    {
      id: 'NGDRS-REG',
      name: 'National Generic Document Registration (NGDRS)',
      category: 'Registration Data',
      status: 'Operational',
      latency: '54 ms',
      lastSync: '5 mins ago',
      recordsSynced: '12,980 Registry Deeds',
      protocol: 'DigiLocker / e-Sign HMAC',
    },
    {
      id: 'CGRS-TRIBUNAL',
      name: 'Centralized Public Grievance Redressal (CPGRAMS/CGRS)',
      category: 'Dispute Management',
      status: 'Operational',
      latency: '61 ms',
      lastSync: '45 mins ago',
      recordsSynced: '142 Active Disputes',
      protocol: 'Tribunal Webhook',
    },
  ]);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Sync Completed', 'All 5 federated government data sources synchronized.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              National Informatics Centre (NIC) Console
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            System Administration & API Gateway
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interoperability connectors, federated databases, role-based access control, and telemetry health.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing API Feeds...' : 'Sync Federated Data'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'integrations'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Data Sources & API Integrations</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Role Governance</span>
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'health'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Architecture & Health</span>
        </button>
      </div>

      {/* Tab 1: Data Sources & Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {integrations.map((int) => (
              <div
                key={int.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{int.id}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {int.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{int.name}</h3>
                  <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {int.category}
                  </span>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ping Latency:</span>
                      <span className="font-mono font-bold text-slate-800">{int.latency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Volume Synced:</span>
                      <span className="font-semibold text-slate-800">{int.recordsSynced}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Protocol:</span>
                      <span className="font-mono text-[11px] text-slate-600">{int.protocol}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Last sync: {int.lastSync}</span>
                  <button
                    onClick={() => toast.info('Sync Ping', `Handshake ping verified for ${int.id}`)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    Ping Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: User & Role Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Provisioned Governance Personas</h2>
              <p className="text-xs text-slate-500">Role-based access matrix and verified official credentials</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{users.length} Active System Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Designated Role</th>
                  <th className="py-3.5 px-4">Official Designation</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">District / Jurisdiction</th>
                  <th className="py-3.5 px-4 text-right">Access Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{u.designation}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.department}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{u.district}, {u.state}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {u.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Architecture & Health */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400">Database Cluster</span>
            <h3 className="text-lg font-black text-slate-900">PostgreSQL 16 + PostGIS</h3>
            <p className="text-xs text-slate-500">Active read/write master with 2 read-replicas in Delhi NCR zone.</p>
            <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 99.98% Service Uptime
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400">GIS Map Engine</span>
            <h3 className="text-lg font-black text-slate-900">Leaflet / OpenStreetMap</h3>
            <p className="text-xs text-slate-500">Vector tile renderer with sub-second polygon triangulation.</p>
            <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Fast Layer Rendering
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400">AI Validation Stack</span>
            <h3 className="text-lg font-black text-slate-900">NLP & GIS Intersection</h3>
            <p className="text-xs text-slate-500">Transformer-based OCR matching + Cadastral coordinate bounding checks.</p>
            <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 42ms Inference Latency
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400">Cryptographic Ledger</span>
            <h3 className="text-lg font-black text-slate-900">SHA-256 Merkle Audit</h3>
            <p className="text-xs text-slate-500">Immutable ledger log ensuring verifiable chain-of-custody.</p>
            <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Zero Integrity Drifts
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
