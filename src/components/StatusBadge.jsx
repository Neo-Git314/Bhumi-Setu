import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, XCircle, ShieldAlert, Sparkles, FileCheck2, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const s = status || 'Unknown';
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const config = {
    Verified: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />,
    },
    'Under Dispute': {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
      icon: <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600 inline" />,
    },
    'AI Flagged': {
      bg: 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-500/20',
      icon: <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />,
    },
    'Mutation Pending': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-indigo-600 inline" />,
    },
    'Pending Review': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />,
    },
    Dismissed: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20',
      icon: <XCircle className="w-3.5 h-3.5 mr-1 text-slate-500 inline" />,
    },
    Approved: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      icon: <FileCheck2 className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />,
    },
    Rejected: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
      icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600 inline" />,
    },
    'In Review': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-blue-600 inline" />,
    },
    'Under Verification': {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-cyan-600 inline" />,
    },
    Submitted: {
      bg: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-slate-600 inline" />,
    },
    'Survey Scheduled': {
      bg: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-purple-600 inline" />,
    },
    Complaint: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />,
    },
    Verification: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-blue-600 inline" />,
    },
    'Evidence Collection': {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200 ring-indigo-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-indigo-600 inline" />,
    },
    Review: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />,
    },
    Resolution: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />,
    },
    Closed: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-slate-600 inline" />,
    },
    Flagged: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
      icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600 inline" />,
    },
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />,
    },
  };

  const style = config[s] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    icon: <Clock className="w-3.5 h-3.5 mr-1 text-slate-500 inline" />,
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ring-1 ring-inset ${style.bg} ${sizeClasses}`}
    >
      {style.icon}
      {s}
    </span>
  );
};
