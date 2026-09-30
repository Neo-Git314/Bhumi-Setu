import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, ArrowRight, CheckCheck, Trash2 } from 'lucide-react';
import { notificationService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

export const NotificationsPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const loadNotifs = () => {
    setNotifications(notificationService.getAll());
  };

  useEffect(() => {
    loadNotifs();
    window.addEventListener('bhumi_data_changed', loadNotifs);
    return () => window.removeEventListener('bhumi_data_changed', loadNotifs);
  }, []);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    toast.success('Notifications Updated', 'All alerts marked as read.');
  };

  const handleItemClick = (n) => {
    notificationService.markAsRead(n.id);
    if (n.link) navigate(n.link);
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Real-time Alert Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Notification Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System event alerts, tribunal hearing notices, AI anomaly flags, and application progress updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'unread' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No notifications in this view</h3>
            <p className="text-xs text-slate-400 mt-1">You are all caught up with government notifications.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-white border-indigo-200/90 shadow-xs hover:border-indigo-400'
                  : 'bg-white/70 border-slate-200/80 hover:bg-white'
              }`}
            >
              <div className="mt-1 shrink-0">
                {n.type === 'warning' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {n.type === 'error' && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
                {n.type === 'success' && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {(!n.type || n.type === 'info') && (
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                {n.link && (
                  <span className="text-xs font-bold text-indigo-600 hover:underline mt-2 inline-flex items-center gap-1">
                    Open related case or record <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>

              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-2" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
