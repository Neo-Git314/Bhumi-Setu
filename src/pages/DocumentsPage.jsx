import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Search,
  UploadCloud,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Filter,
  FileCheck,
  X,
  Sparkles,
} from 'lucide-react';
import { documentService } from '../services/dataService';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const DocumentsPage = () => {
  const toast = useToast();
  const { currentUser } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form
  const [form, setForm] = useState({
    title: '',
    category: 'Dispute Evidence',
    parcelId: 'P-10245',
    caseId: 'DS-2024-001',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    summary: '',
  });

  const loadDocuments = () => {
    setDocuments(documentService.getAll());
  };

  useEffect(() => {
    loadDocuments();
    window.addEventListener('bhumi_data_changed', loadDocuments);
    return () => window.removeEventListener('bhumi_data_changed', loadDocuments);
  }, []);

  const categories = [
    'All',
    'Land Record',
    'Survey Document',
    'Registration',
    'Mutation',
    'Map',
    'Notice',
    'Dispute Evidence',
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Title Required', 'Please enter a title for the document');
      return;
    }
    const created = documentService.upload({
      ...form,
      uploadedBy: currentUser?.name || 'Authorized User',
    });
    toast.success('Document Ingested & Hashed', `Document ${created.id} uploaded with SHA-256 stamp.`);
    setIsUploadOpen(false);
    setForm({
      title: '',
      category: 'Dispute Evidence',
      parcelId: 'P-10245',
      caseId: 'DS-2024-001',
      fileType: 'PDF',
      fileSize: '3.2 MB',
      summary: '',
    });
  };

  const filteredDocs = documents.filter((d) => {
    if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
    if (query) {
      const q = query.toLowerCase().trim();
      return (
        d.id.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.parcelId.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q)
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
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              DigiLocker & State Land Archives Integration
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Evidence & Document Management System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-proof digitized deeds, cadastral Mussavi cloth maps, DGPS surveys, and judicial orders.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document / Evidence</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents by title, ID (DOC-801), parcel, or uploader..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                  {doc.id}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl uppercase">
                  {doc.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{doc.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{doc.summary}</p>

              {/* Metadata strip */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Parcel Link:</span>
                  <span className="font-mono font-bold text-indigo-700">{doc.parcelId || 'General'}</span>
                </div>
                {doc.caseId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Case Link:</span>
                    <span className="font-mono font-bold text-rose-700">{doc.caseId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded By:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{doc.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Version:</span>
                  <span className="font-medium text-slate-700">{doc.uploadDate} (v{doc.version})</span>
                </div>
                <div className="pt-1 border-t border-slate-200 flex justify-between font-mono text-[10px] text-slate-400 truncate">
                  <span className="truncate">SHA256: {doc.hash}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedDocForPreview(doc)}
                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Preview Document
              </button>
              <button
                onClick={() => toast.info('Download Initiated', `Downloading certified file for ${doc.id}`)}
                className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>{doc.fileType} ({doc.fileSize})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Preview Document */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedDocForPreview.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDocForPreview.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Certified Government Certificate View */}
            <div className="my-6 p-6 rounded-2xl bg-amber-50/30 border-2 border-slate-200 space-y-4">
              <div className="text-center pb-4 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Government of Haryana • Department of Land Revenue
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mt-0.5">
                  Certified Electronic Record of Rights & Conveyance Deed
                </h4>
                <p className="text-[10px] text-slate-500">Issued under Section 31 of Haryana Land Revenue Act</p>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <p>
                  <strong>Document Title:</strong> {selectedDocForPreview.title}
                </p>
                <p>
                  <strong>Category:</strong> {selectedDocForPreview.category}
                </p>
                <p>
                  <strong>Referenced Parcel ID:</strong> {selectedDocForPreview.parcelId || 'N/A'}
                </p>
                {selectedDocForPreview.caseId && (
                  <p>
                    <strong>Referenced Dispute Case ID:</strong> {selectedDocForPreview.caseId}
                  </p>
                )}
                <p>
                  <strong>Summary of Document:</strong> {selectedDocForPreview.summary}
                </p>
                <p>
                  <strong>Attesting Officer:</strong> {selectedDocForPreview.uploadedBy}
                </p>
                <p>
                  <strong>Date of Electronic Recording:</strong> {selectedDocForPreview.uploadDate}
                </p>
              </div>

              {/* Cryptographic Proof Footer */}
              <div className="pt-3 border-t border-slate-200 bg-white p-3 rounded-xl border text-[10px] space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-Proof Electronic Seal Verified (National Digital Locker Protocol)</span>
                </div>
                <p className="font-mono text-slate-500 break-all">
                  SHA-256 Digest: {selectedDocForPreview.hash}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Download Complete', `Downloaded ${selectedDocForPreview.id}`);
                  setSelectedDocForPreview(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload New Land Governance Document</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Dispute Evidence">Dispute Evidence</option>
                  <option value="Land Record">Land Record (Jamabandi / Khatoni)</option>
                  <option value="Registration">Sale Deed / Conveyance</option>
                  <option value="Survey Document">Survey Document (DGPS / Cadastral)</option>
                  <option value="Mutation">Mutation Order (Intiqal)</option>
                  <option value="Map">Cadastral Mussavi Map</option>
                  <option value="Notice">Legal Notice / Order</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Partition Deed No. 1024/2023"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parcel ID (Optional)</label>
                  <input
                    type="text"
                    value={form.parcelId}
                    onChange={(e) => setForm({ ...form, parcelId: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Case ID (Optional)</label>
                  <input
                    type="text"
                    value={form.caseId}
                    onChange={(e) => setForm({ ...form, caseId: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Summary / Context</label>
                <textarea
                  rows={2}
                  placeholder="Briefly state contents or parties referenced..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">Click to upload file or drop scan image</p>
                <p className="text-[10px] text-slate-400">PDF, GeoJSON, TIFF, JPG (Max 25MB)</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Upload & Sign SHA-256
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
