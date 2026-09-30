import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Filter,
  BarChart2,
  FileCheck2,
  Scale,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  statsService,
  aiValidationService,
  disputeService,
  applicationService,
} from '../services/dataService';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

export const OfficerDashboard = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(statsService.getOverviewStats());
  const [aiAlerts, setAiAlerts] = useState([]);
  const [disputesList, setDisputesList] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [disputeCategories, setDisputeCategories] = useState([]);

  const loadData = () => {
    setStats(statsService.getOverviewStats());
    const allAlerts = aiValidationService.getAll();
    setAiAlerts(allAlerts.filter((a) => a.status === 'Pending Review').slice(0, 4));
    setDisputesList(disputeService.getAll().slice(0, 5));
    setDistrictData(statsService.getDistrictAnalytics());
    setMonthlyTrends(statsService.getMonthlyTrends());
    setDisputeCategories(statsService.getDisputeCategories());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('bhumi_data_changed', loadData);
    return () => window.removeEventListener('bhumi_data_changed', loadData);
  }, []);

  return (
    <div className="space-y-8">
      {/* Officer Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Department of Revenue & Land Reforms
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Revenue Administration Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jurisdiction: <span className="font-semibold text-slate-700">Gurugram Division (NCR)</span> • Logged in as:{' '}
            <span className="font-semibold text-indigo-700">{currentUser?.name} ({currentUser?.role})</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/ai-validation"
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Anomaly Queue</span>
          </Link>
          <Link
            to="/gis-map"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Cadastral GIS</span>
          </Link>
        </div>
      </div>

      {/* Mandatory Human-in-the-Loop AI Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-amber-900">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-amber-950 uppercase tracking-wide">
            Statutory AI Protocol — Human Verification Required:
          </span>{' '}
          In accordance with National Land Governance Directives, AI models only flag potential inconsistencies, spatial
          overlaps, and duplicate deeds. AI does <strong>NOT</strong> make ownership, mutation, or legal decisions. Final
          orders must be passed by authorized Revenue Officers and Tribunals.
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Land Records"
          value={stats.totalRecords.toLocaleString()}
          change="+1,240 this month"
          icon={Layers}
          color="indigo"
          subtitle="DILRMP Synchronized"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          change="-12% vs last week"
          icon={Clock}
          color="blue"
          subtitle="Avg TAT: 6.2 Days"
        />
        <StatCard
          title="Active Disputes"
          value={stats.activeDisputes}
          change="14 in Hearing Stage"
          isPositive={false}
          icon={ShieldAlert}
          color="rose"
          subtitle="Tribunal & SDM Court"
        />
        <StatCard
          title="Data Quality Alerts"
          value={stats.dataQualityIssues}
          change="AI Flagged"
          isPositive={false}
          icon={AlertTriangle}
          color="amber"
          subtitle="Human Review Pending"
          onClick={() => navigate('/ai-validation')}
        />
        <StatCard
          title="Records Verified"
          value={stats.recordsVerified.toLocaleString()}
          change="98.4% Accuracy"
          icon={CheckCircle2}
          color="emerald"
          subtitle="Audited & Geo-Tagged"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Application Processing & AI Anomaly Velocity</h2>
              <p className="text-xs text-slate-500">Monthly throughput of mutations and automated error detection</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              FY 2024-25
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications Received"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorApps)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Cases Resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disputes by Category Donut Chart (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Disputes by Category</h2>
              <p className="text-xs text-slate-500">Distribution across active legal grounds</p>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disputeCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {disputeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">38%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Boundary</span>
            </div>
          </div>

          {/* Legend items */}
          <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {disputeCategories.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-bold text-slate-800">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Land Records Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Regional District Comparison (Records & Latency)</h2>
            <p className="text-xs text-slate-500">Total digitized parcels vs average dispute resolution days</p>
          </div>
          <Link to="/analytics" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Advanced Analytics →
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="district" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="records" name="Digitized Parcels" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolvedDisputes" name="Disputes Settled" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Quality Alerts Section ("AI Flag — Human Verification Required") */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Data Quality & Anomaly Alerts</h2>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  AI Flag — Human Verification Required
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Inconsistencies pre-screened by AI: duplicates, spatial overlaps, missing stamps, and conflicting deeds.
              </p>
            </div>
          </div>
          <Link
            to="/ai-validation"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            View All AI Alerts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-3">Alert ID</th>
                <th className="py-3 px-3">Parcel ID</th>
                <th className="py-3 px-3">Issue Type</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aiAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-900">{alert.id}</td>
                  <td className="py-3 px-3">
                    <Link
                      to={`/records/${alert.parcelId}`}
                      className="font-mono text-indigo-600 hover:underline font-semibold"
                    >
                      {alert.parcelId}
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {alert.issueType}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {alert.confidence}% match
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-sm text-slate-600 truncate">{alert.description}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={alert.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/ai-validation`}
                      className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors inline-block"
                    >
                      Review & Compare
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Disputes Quick Roster */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Priority Disputes Awaiting Officer Action</h2>
          </div>
          <Link to="/disputes" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            View All Disputes ({disputesList.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disputesList.slice(0, 3).map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-300 bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {d.id}
                  </span>
                  <StatusBadge status={d.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{d.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Parcel: <span className="font-mono font-medium text-slate-700">{d.parcelId}</span> • Category:{' '}
                  {d.category}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">Applicant: {d.applicant}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Updated: {d.lastUpdated}</span>
                <Link
                  to={`/disputes/${d.id}`}
                  className="text-indigo-600 font-bold hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  Case File <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
