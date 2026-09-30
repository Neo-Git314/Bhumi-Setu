import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  AlertTriangle,
  Compass,
  Building,
  Scale,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Download,
  Filter,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { useToast } from '../context/ToastContext';

export const PolicyInsightsPage = () => {
  const toast = useToast();
  const [selectedRegion, setSelectedRegion] = useState('All NCR');

  const landConversionData = [
    { year: '2020', agriToResHa: 420, agriToCommHa: 180 },
    { year: '2021', agriToResHa: 510, agriToCommHa: 240 },
    { year: '2022', agriToResHa: 680, agriToCommHa: 310 },
    { year: '2023', agriToResHa: 890, agriToCommHa: 450 },
    { year: '2024 (YTD)', agriToResHa: 1040, agriToCommHa: 590 },
  ];

  const handleExportBrief = () => {
    toast.success('Policy Brief Generated', 'Confidential NITI Aayog/MoRD Policy Executive Brief downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
              Macro Policy Decision Support
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Aggregated Policy Insights & Urban Transformation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strategic governance patterns, peri-urban land-use transition velocity, and dispute concentration corridors.
          </p>
        </div>

        <button
          onClick={handleExportBrief}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Policy Brief (PDF)</span>
        </button>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200/90 flex items-start gap-3 text-indigo-900">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-extrabold uppercase tracking-wide">Methodology Note — Aggregated Insights:</span> All
          projections and trends presented herein reflect aggregated statistical observations across anonymized district
          registries. These macro indicators support urban zoning and agrarian preservation policies and do not
          prejudge individual title rights.
        </div>
      </div>

      {/* 4 High-Impact Policy Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insight 1 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md uppercase">
                Dispute Concentration
              </span>
              <span className="text-xs text-slate-400 font-mono">Corridor 12</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              High Dispute Concentration in Gurugram-Sohna Peri-Urban Fringe
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              42% of active boundary disputes originate within a 5 km buffer of major expressway expansions, primarily
              due to rapid conversion of un-demarcated agricultural parcels into plotting layouts.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
              <ArrowUpRight className="w-4 h-4" /> +18% dispute velocity in un-demarcated zones
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                Data Quality Velocity
              </span>
              <span className="text-xs text-slate-400 font-mono">DILRMP Scan</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              AI Pre-Screening Cut Registry Inconsistencies by 34%
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Automated cross-referencing between Sub-Registrar deed writers and digital Jamabandi prevented 2,410
              erroneous mutation filings prior to deed execution over the preceding 6 months.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
              <ArrowDownRight className="w-4 h-4" /> 34% decrease in post-registration boundary litigation
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                Zoning Velocity
              </span>
              <span className="text-xs text-slate-400 font-mono">CLU Trends</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Agricultural to Commercial Conversion Surged by 28%
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Industrial warehousing and commercial logistics hubs are driving rapid CLU applications in Pataudi and
              Farrukhnagar, requiring expedited environmental buffer enforcement for Aravalli ridges.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
              <ArrowUpRight className="w-4 h-4" /> 590 Hectares converted to commercial in FY 2024
            </div>
          </div>
        </div>

        {/* Insight 4 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                Judicial Turnaround
              </span>
              <span className="text-xs text-slate-400 font-mono">SDM Tribunals</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Average Processing Turnaround Dropped from 45 to 14 Days
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Pre-populated digital evidence packages and side-by-side DGPS cadastral overlays reduced the number of
              court adjournments from an average of 4.8 hearings to 1.6 hearings per dispute.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
              <ArrowDownRight className="w-4 h-4" /> 67% reduction in pendency time per contested case
            </div>
          </div>
        </div>
      </div>

      {/* Land Use Transition Trend Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              5-Year Land Conversion Velocity (Agricultural to Urban/Commercial)
            </h2>
            <p className="text-xs text-slate-500">Recorded acreage sanctioned under formal Change of Land Use (CLU)</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Area in Hectares
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={landConversionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit=" Ha" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="agriToResHa" name="Agri to Residential" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="agriToCommHa" name="Agri to Commercial / Logistics" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategic Policy Recommendations Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-3">
          Evidence-Based Policy Recommendations for Department of Revenue
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-bold text-slate-900">Mandate DGPS Survey Pre-Requisite for Urban Peripheral Deeds</p>
              <p className="text-slate-600 mt-0.5">
                Sub-Registrars should require differential GPS geo-coordinates before registering deeds along high-growth
                expressway corridors to eliminate 0.35 Ha boundary overlap patterns at the source.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <div>
              <p className="font-bold text-slate-900">Expand Common Village Land (Shamlat Deh) Satellite Geo-Fencing</p>
              <p className="text-slate-600 mt-0.5">
                Deploy automated bi-weekly Sentinel-2 NDVI change alerts across all 240 Gram Panchayats to intercept
                unauthorized commercial construction on common grazing lands within 72 hours.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="font-bold text-slate-900">Digital Fard Badar Token Signing for Clerical Corrections</p>
              <p className="text-slate-600 mt-0.5">
                Enable Tehsildars to sanction non-contested clerical spelling typos and marla-to-kanal conversion errors
                via Jan-Parichay digital signatures within 48 hours without court summons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
