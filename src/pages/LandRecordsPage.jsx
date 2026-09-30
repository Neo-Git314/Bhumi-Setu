import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  MapPin,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Download,
  Building,
  RotateCcw,
} from 'lucide-react';
import { landRecordService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';

export const LandRecordsPage = () => {
  const [searchParams] = useSearchParams();
  const [parcels, setParcels] = useState([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [tehsil, setTehsil] = useState('');
  const [village, setVillage] = useState('');
  const [landUse, setLandUse] = useState('');
  const [status, setStatus] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const loadParcels = () => {
    const list = landRecordService.search({
      query,
      district,
      tehsil,
      village,
      landUse,
      status,
    });
    setParcels(list);
  };

  useEffect(() => {
    loadParcels();
  }, [query, district, tehsil, village, landUse, status]);

  const handleResetFilters = () => {
    setQuery('');
    setDistrict('');
    setTehsil('');
    setVillage('');
    setLandUse('');
    setStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">DILRMP Central Repository</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Unified Land Record Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interoperable cadastral database harmonizing textual Jamabandi, SVAMITVA, and spatial surveys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Card View
            </button>
          </div>
          <Link
            to="/gis-map"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>View All on GIS</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Global Search query */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Khasra, Owner, Parcel ID..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
            >
              <option value="">All Districts</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Faridabad">Faridabad</option>
              <option value="Pune">Pune</option>
              <option value="Jaipur">Jaipur</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Land Use</label>
            <select
              value={landUse}
              onChange={(e) => setLandUse(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
            >
              <option value="">All Land Uses</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Grazing/Forest">Grazing / Forest</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Under Dispute">Under Dispute</option>
              <option value="AI Flagged">AI Flagged</option>
              <option value="Mutation Pending">Mutation Pending</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Quick Filters:</span>
          {['Agricultural', 'Residential', 'Commercial', 'Under Dispute', 'AI Flagged'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (['Agricultural', 'Residential', 'Commercial'].includes(tag)) setLandUse(tag);
                else setStatus(tag);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
          <span className="ml-auto text-slate-400 font-semibold text-[11px]">
            Showing {parcels.length} authenticated parcels
          </span>
        </div>
      </div>

      {/* Main Records Display */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Parcel ID</th>
                  <th className="py-3.5 px-4">Khasra / Khata</th>
                  <th className="py-3.5 px-4">Primary Title Holder</th>
                  <th className="py-3.5 px-4">Location (Village / Tehsil)</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Land Use</th>
                  <th className="py-3.5 px-4">Governance Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/records/${parcel.id}`}
                        className="font-mono font-bold text-indigo-700 hover:underline"
                      >
                        {parcel.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{parcel.khasraNo}</span>
                      <span className="text-slate-400 block text-[10px]">{parcel.khataNo}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{parcel.ownerName}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                        {parcel.fatherName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="block font-medium">{parcel.village}</span>
                      <span className="text-[10px] text-slate-400">{parcel.tehsil}, {parcel.district}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {parcel.areaHectares} Ha
                      <span className="text-[10px] text-slate-400 block">({parcel.areaSqMeters.toLocaleString()} m²)</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-medium text-slate-700 bg-slate-100">
                        {parcel.landUse}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={parcel.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/records/${parcel.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1 hover:bg-indigo-50 rounded"
                      >
                        View
                      </Link>
                      <Link
                        to={`/gis-map?parcel=${parcel.id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-bold px-2 py-1 hover:bg-emerald-50 rounded"
                        title="View on Map"
                      >
                        Map
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                    {parcel.id}
                  </span>
                  <StatusBadge status={parcel.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900">{parcel.ownerName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{parcel.fatherName}</p>

                <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khasra / Khata:</span>
                    <span className="font-semibold text-slate-800">{parcel.khasraNo} ({parcel.khataNo})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Village & Tehsil:</span>
                    <span className="font-semibold text-slate-800">{parcel.village}, {parcel.tehsil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Area:</span>
                    <span className="font-semibold text-slate-800">{parcel.areaHectares} Ha ({parcel.areaSqMeters} m²)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Land Use:</span>
                    <span className="font-semibold text-slate-800">{parcel.landUse}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/records/${parcel.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/gis-map?parcel=${parcel.id}`}
                  className="text-slate-600 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> GIS View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
