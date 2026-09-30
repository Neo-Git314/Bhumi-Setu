import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, AlertTriangle, FileText, ArrowRight, X, Clock, Layers } from 'lucide-react';
import { landRecordService, disputeService, documentService, applicationService } from '../services/dataService';
import { StatusBadge } from './StatusBadge';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ parcels: [], disputes: [], documents: [], applications: [] });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ parcels: [], disputes: [], documents: [], applications: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ parcels: [], disputes: [], documents: [], applications: [] });
      return;
    }

    const q = query.toLowerCase().trim();

    const parcels = landRecordService
      .getAll()
      .filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.khasraNo.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const disputes = disputeService
      .getAll()
      .filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.parcelId.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.applicant.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const documents = documentService
      .getAll()
      .filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.parcelId.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const applications = applicationService
      .getAll()
      .filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.applicantName.toLowerCase().includes(q) ||
          a.khasraNo.toLowerCase().includes(q)
      )
      .slice(0, 4);

    setResults({ parcels, disputes, documents, applications });
  }, [query]);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  const totalResults =
    results.parcels.length + results.disputes.length + results.documents.length + results.applications.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Land Records, Khasra, Disputes, Documents, Applicants..."
            className="flex-1 bg-transparent border-0 focus:outline-hidden text-slate-800 text-sm placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden text-xs text-indigo-600 font-semibold px-2 py-1 hover:bg-indigo-50 rounded"
          >
            Cancel
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center">
              <div className="inline-flex p-3 rounded-full bg-indigo-50 text-indigo-600 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Quick Global Search</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Type any Khasra No (e.g., "142/1"), Parcel ID ("P-10245"), Owner name ("Ramesh"), or Case ID ("DS-2024-001").
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['142/1', 'P-10245', 'Badshahpur', 'Boundary Dispute', 'Balwan Singh'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-full text-slate-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-700">No matching records found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by Khasra number, Tehsil name, or Citizen ID.</p>
            </div>
          )}

          {/* 1. Land Parcels */}
          {results.parcels.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <MapPin className="w-3.5 h-3.5" /> Land Parcels ({results.parcels.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.parcels.map((parcel) => (
                  <button
                    key={parcel.id}
                    onClick={() => handleSelect(`/records/${parcel.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {parcel.id}
                        </span>
                        <span className="text-xs text-slate-600">Khasra {parcel.khasraNo}</span>
                        <StatusBadge status={parcel.status} size="sm" />
                      </div>
                      <p className="text-xs font-medium text-slate-800 mt-1">
                        {parcel.ownerName} • {parcel.village}, {parcel.tehsil} ({parcel.areaHectares} Ha)
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Disputes */}
          {results.disputes.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <span className="flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5" /> Disputes & Cases ({results.disputes.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.disputes.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(`/disputes/${d.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                          {d.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{d.category}</span>
                        <StatusBadge status={d.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {d.title} • Applicant: {d.applicant}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Documents */}
          {results.documents.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <FileText className="w-3.5 h-3.5" /> Documents & Deeds ({results.documents.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelect(`/documents`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {doc.id}
                        </span>
                        <span className="text-xs text-slate-500">{doc.category}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 mt-0.5">{doc.title}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Applications */}
          {results.applications.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Clock className="w-3.5 h-3.5" /> Citizen Applications ({results.applications.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(`/citizen/dashboard`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {app.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{app.type}</span>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Applicant: {app.applicantName} • Khasra {app.khasraNo}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>BHUMI SETU 360° Federated Search Engine</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
