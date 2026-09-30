import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Popup, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Search,
  MapPin,
  ShieldAlert,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import { landRecordService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';

// Fix default marker icon issues if needed
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle pan to selected parcel
const MapFlyTo = ({ selectedParcel }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedParcel && selectedParcel.coordinates && selectedParcel.coordinates.length > 0) {
      const center = selectedParcel.coordinates[0];
      map.flyTo(center, 15, { duration: 1.2 });
    }
  }, [selectedParcel, map]);
  return null;
};

export const GisMapPage = () => {
  const [searchParams] = useSearchParams();
  const targetParcelId = searchParams.get('parcel');

  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tileLayer, setTileLayer] = useState('osm'); // 'osm' | 'topo'

  // Layer toggles
  const [showParcels, setShowParcels] = useState(true);
  const [showDisputedOnly, setShowDisputedOnly] = useState(false);
  const [showSurveyNodes, setShowSurveyNodes] = useState(true);
  const [activeLandUseFilter, setActiveLandUseFilter] = useState('');

  // Default center around Gurugram / Sohna cluster
  const defaultCenter = [28.4215, 77.0345];
  const defaultZoom = 13;

  useEffect(() => {
    const list = landRecordService.getAll();
    setParcels(list);

    if (targetParcelId) {
      const found = list.find((p) => p.id === targetParcelId);
      if (found) {
        setSelectedParcel(found);
      }
    } else if (list.length > 0) {
      setSelectedParcel(list[0]);
    }
  }, [targetParcelId]);

  // Color generator based on Land Use & Dispute
  const getParcelStyle = (parcel) => {
    const isSelected = selectedParcel?.id === parcel.id;
    const isDisputed = parcel.status === 'Under Dispute' || parcel.status === 'AI Flagged';

    let fillColor = '#10b981'; // Agricultural default
    if (parcel.landUse === 'Residential') fillColor = '#3b82f6';
    if (parcel.landUse === 'Commercial') fillColor = '#8b5cf6';
    if (parcel.landUse === 'Industrial') fillColor = '#f97316';
    if (parcel.landUse === 'Grazing/Forest') fillColor = '#0d9488';

    if (isDisputed) {
      return {
        color: '#ef4444',
        weight: isSelected ? 4 : 2.5,
        fillColor: '#ef4444',
        fillOpacity: isSelected ? 0.6 : 0.35,
        dashArray: '5, 5',
      };
    }

    return {
      color: isSelected ? '#1e1b4b' : fillColor,
      weight: isSelected ? 3.5 : 1.5,
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.55 : 0.3,
    };
  };

  const filteredParcels = parcels.filter((p) => {
    if (showDisputedOnly && p.status !== 'Under Dispute' && p.status !== 'AI Flagged') {
      return false;
    }
    if (activeLandUseFilter && p.landUse !== activeLandUseFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.id.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Cadastral GIS & Spatial Decision Support
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              OpenStreetMap / GeoServer
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Interactive Land Parcel Spatial Viewer
          </h1>
        </div>

        {/* Search on Map */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parcel or Khasra..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Layer toggles */}
          <button
            onClick={() => setShowDisputedOnly(!showDisputedOnly)}
            className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
              showDisputedOnly
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Disputed Parcels Only</span>
          </button>

          <select
            value={activeLandUseFilter}
            onChange={(e) => setActiveLandUseFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="">All Land Uses</option>
            <option value="Agricultural">Agricultural (Green)</option>
            <option value="Residential">Residential (Blue)</option>
            <option value="Commercial">Commercial (Purple)</option>
            <option value="Industrial">Industrial (Orange)</option>
            <option value="Grazing/Forest">Grazing / Forest (Teal)</option>
          </select>
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px] relative">
        {/* Leaflet Map Container (8 or 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-slate-100 rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs relative">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                tileLayer === 'osm'
                  ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
              }
            />

            <MapFlyTo selectedParcel={selectedParcel} />

            {/* Render Land Parcel Polygons */}
            {showParcels &&
              filteredParcels.map((parcel) => (
                <Polygon
                  key={parcel.id}
                  positions={parcel.coordinates}
                  pathOptions={getParcelStyle(parcel)}
                  eventHandlers={{
                    click: () => {
                      setSelectedParcel(parcel);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <span className="font-mono font-bold text-indigo-700">{parcel.id}</span>
                        <span className="font-semibold text-slate-700">Khasra {parcel.khasraNo}</span>
                      </div>
                      <p className="font-bold text-slate-900">{parcel.ownerName}</p>
                      <p className="text-slate-500 text-[11px]">
                        {parcel.village}, {parcel.tehsil}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-medium text-slate-600">{parcel.areaHectares} Ha</span>
                        <span className="font-semibold text-indigo-600">{parcel.landUse}</span>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              ))}
          </MapContainer>

          {/* Floating Map Legend & Base Switcher */}
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 text-xs space-y-2 max-w-[200px]">
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Map Legend</p>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>Agricultural</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-blue-500" />
                <span>Residential</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-purple-500" />
                <span>Commercial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-orange-500" />
                <span>Industrial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm border-2 border-dashed border-red-500 bg-red-200" />
                <span className="text-red-700 font-semibold">Disputed / Overlap</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Base Map:</span>
              <button
                onClick={() => setTileLayer(tileLayer === 'osm' ? 'topo' : 'osm')}
                className="font-bold text-indigo-600 hover:underline uppercase"
              >
                {tileLayer === 'osm' ? 'Topo Map' : 'Standard'}
              </button>
            </div>
          </div>
        </div>

        {/* Selected Parcel Detail Side Panel (4 or 3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between overflow-y-auto">
          {selectedParcel ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-extrabold text-xs text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                    {selectedParcel.id}
                  </span>
                  <StatusBadge status={selectedParcel.status} size="sm" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{selectedParcel.ownerName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedParcel.fatherName}</p>
              </div>

              {/* Conflict banner if flagged */}
              {(selectedParcel.status === 'Under Dispute' || selectedParcel.status === 'AI Flagged') && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Spatial Boundary Inconsistency</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Overlaps with adjacent parcel {selectedParcel.conflictWith || 'P-10246'} by 0.35 Ha along Eastern coordinate boundary.
                  </p>
                </div>
              )}

              {/* Attributes Table */}
              <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khasra Number:</span>
                  <span className="font-bold text-slate-800">{selectedParcel.khasraNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Khata / Khatoni:</span>
                  <span className="font-semibold text-slate-800">{selectedParcel.khataNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Survey No:</span>
                  <span className="font-semibold text-slate-800">{selectedParcel.surveyNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Area:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.areaHectares} Ha ({selectedParcel.areaSqMeters} m²)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Land Use:</span>
                  <span className="font-bold text-indigo-700">{selectedParcel.landUse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {selectedParcel.village}, {selectedParcel.tehsil}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Market Value:</span>
                  <span className="font-bold text-slate-900">₹{(selectedParcel.marketValue / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Encumbrance:</span>
                  <span className="font-medium text-slate-700 text-right truncate max-w-[140px]" title={selectedParcel.encumbranceStatus}>
                    {selectedParcel.encumbranceStatus}
                  </span>
                </div>
              </div>

              {/* Polygon Coordinates Box */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cadastral Polygon Nodes ({selectedParcel.coordinates.length})
                </p>
                <div className="space-y-1 font-mono text-[10px] max-h-28 overflow-y-auto">
                  {selectedParcel.coordinates.map((c, i) => (
                    <div key={i} className="flex justify-between p-1.5 rounded-lg bg-slate-50 text-slate-600">
                      <span>Node {i + 1}:</span>
                      <span>{c[0].toFixed(5)}, {c[1].toFixed(5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Click any parcel polygon on the map to inspect ownership & boundary attributes.</p>
            </div>
          )}

          {/* Action CTAs */}
          {selectedParcel && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                to={`/records/${selectedParcel.id}`}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open Full Record of Rights (RoR)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {selectedParcel.status === 'AI Flagged' && (
                <Link
                  to={`/ai-validation`}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Inspect AI Anomaly Alert</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
