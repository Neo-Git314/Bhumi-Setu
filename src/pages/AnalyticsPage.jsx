import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Clock,
  ShieldAlert,
  CheckCircle2,
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
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { statsService } from '../services/dataService';
import { StatCard } from '../components/StatCard';
import { useToast } from '../context/ToastContext';

export const AnalyticsPage = () => {
  const toast = useToast();

  const [districtFilter, setDistrictFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('6M'); // '1M' | '6M' | '1Y'

  const stats = statsService.getOverviewStats();
  const districtData = statsService.getDistrictAnalytics();
  const monthlyTrends = statsService.getMonthlyTrends();
  const disputeCategories = statsService.getDisputeCategories();
  const landUseData = statsService.getLandUseDistribution();

  // Resolution Turnaround Time Before vs After AI (Line chart data)
  const turnaroundData = [
    { period: 'Jan 2024', beforeAiDays: 48, withAiDays: 22, efficiencyGain: '+54%' },
    { period: 'Mar 2024', beforeAiDays: 45, withAiDays: 19, efficiencyGain: '+57%' },
    { period: 'May 2024', beforeAiDays: 47, withAiDays: 17, efficiencyGain: '+63%' },
    { period: 'Jul 2024', beforeAiDays: 44, withAiDays: 15, efficiencyGain: '+65%' },
    { period: 'Sep 2024', beforeAiDays: 42, withAiDays: 14, efficiencyGain: '+67%' },
  ];

  // Application Pipeline Funnel data
  const applicationStatusData = [
    { status: 'Submitted', count: 480, fill: '#94a3b8' },
    { status: 'Verification', count: 340, fill: '#38bdf8' },
    { status: 'Survey Done', count: 260, fill: '#818cf8' },
    { status: 'In Review', count: 190, fill: '#fbbf24' },
    { status: 'Approved', count: 820, fill: '#34d399' },
    { status: 'Rejected', count: 65, fill: '#f87171' },
  ];

  const handleExportCSV = () => {
    toast.success('Analytics Report Exported', 'CSV summary downloaded for regional planning review.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Executive Governance Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Land Governance Analytics & Performance Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro-level throughput, turnaround velocity, anomaly mitigation, and spatial distribution metrics.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="All">All Districts</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Faridabad">Faridabad</option>
            <option value="Pune">Pune</option>
            <option value="Gautam B. Nagar">Gautam Buddha Nagar</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="1M">Last 30 Days</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Full Year (FY 2024)</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Land Records"
          value={stats.totalRecords.toLocaleString()}
          change="+4.2% YoY"
          icon={Layers}
          color="indigo"
          subtitle="DILRMP Central Sync"
        />
        <StatCard
          title="Avg. Dispute Resolution"
          value="14 Days"
          change="Down from 48 days"
          icon={Clock}
          color="emerald"
          subtitle="67% Latency Reduction"
        />
        <StatCard
          title="Active Pendency"
          value={stats.activeDisputes}
          change="-18% this quarter"
          icon={ShieldAlert}
          color="rose"
          subtitle="Across 6 Districts"
        />
        <StatCard
          title="AI Accuracy Rate"
          value={stats.accuracyRate}
          change="99.2% Pipeline Health"
          icon={CheckCircle2}
          color="blue"
          subtitle="Human Audited"
        />
      </div>

      {/* Chart Row 1: Turnaround Time Comparison (Line Chart) & Dispute Breakdown (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turnaround Time Comparison (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dispute Resolution Turnaround Time: Pre-AI vs Post-AI Implementation
              </h2>
              <p className="text-xs text-slate-500">Days taken from initial grievance filing to formal quasi-judicial order</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              67% Acceleration
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={turnaroundData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit=" d" />
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
                <Line
                  type="monotone"
                  dataKey="beforeAiDays"
                  name="Manual Process (Before AI)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="withAiDays"
                  name="Bhumi Setu 360° AI-Assisted"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disputes Category Share */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Disputes by Legal Grounds</h2>
            <p className="text-xs text-slate-500">Categorical division of active tribunal hearings</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disputeCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {disputeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
            {disputeCategories.map((c) => (
              <div key={c.name} className="flex justify-between items-center">
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

      {/* Chart Row 2: Applications Pipeline Funnel & Land Use Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Status Funnel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Application Processing Funnel</h2>
              <p className="text-xs text-slate-500">Citizen requests by current verification checkpoint</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Applications" radius={[6, 6, 0, 0]}>
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Land Use Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Zonal Land Use Distribution</h2>
              <p className="text-xs text-slate-500">Proportion of land area under agricultural, urban & common zoning</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={landUseData}
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Coverage']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" name="Area Share" radius={[0, 6, 6, 0]}>
                  {landUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* District Workload Benchmark Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-2">Regional Workload & Risk Index Breakdown</h2>
        <p className="text-xs text-slate-500 mb-4">
          Comparative administrative benchmarking across major administrative collectorates
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Digitized Parcels</th>
                <th className="py-3 px-3">Active Disputes</th>
                <th className="py-3 px-3">Settled Cases</th>
                <th className="py-3 px-3">Avg Resolution Turnaround</th>
                <th className="py-3 px-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtData.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{d.district}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{d.records.toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-rose-700">{d.activeDisputes}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">{d.resolvedDisputes}</td>
                  <td className="py-3 px-3 text-slate-600">{d.avgDays} Days</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        d.riskScore === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : d.riskScore === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.riskScore}
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
