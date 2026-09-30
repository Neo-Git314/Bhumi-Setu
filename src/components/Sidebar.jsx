import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Map,
  Sparkles,
  ShieldAlert,
  FolderOpen,
  BarChart3,
  TrendingUp,
  Bell,
  ScrollText,
  SlidersHorizontal,
  Home,
  UserCheck,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiValidationService, disputeService } from '../services/dataService';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, isCitizen, isAdmin, isSystemAuditor, isPolicymaker } = useAuth();
  const [pendingAlertsCount, setPendingAlertsCount] = useState(0);
  const [activeDisputesCount, setActiveDisputesCount] = useState(0);

  useEffect(() => {
    const updateBadges = () => {
      const alerts = aiValidationService.getAll();
      setPendingAlertsCount(alerts.filter((a) => a.status === 'Pending Review').length);

      const disputes = disputeService.getAll();
      setActiveDisputesCount(disputes.filter((d) => d.status !== 'Closed').length);
    };

    updateBadges();
    window.addEventListener('bhumi_data_changed', updateBadges);
    return () => window.removeEventListener('bhumi_data_changed', updateBadges);
  }, []);

  const navItems = [
    {
      label: isCitizen ? 'Citizen Dashboard' : 'Officer Dashboard',
      path: isCitizen ? '/citizen/dashboard' : '/officer/dashboard',
      icon: LayoutDashboard,
      roles: ['all'],
    },
    {
      label: 'Land Records',
      path: '/records',
      icon: Layers,
      roles: ['all'],
    },
    {
      label: 'GIS Map & Parcels',
      path: '/gis-map',
      icon: Map,
      roles: ['all'],
    },
    {
      label: 'AI Data Validation',
      path: '/ai-validation',
      icon: Sparkles,
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      roles: ['Revenue Officer', 'Survey Officer', 'Dispute Authority', 'Administrator', 'Policymaker'],
    },
    {
      label: 'Dispute Management',
      path: '/disputes',
      icon: ShieldAlert,
      badge: activeDisputesCount > 0 ? activeDisputesCount : null,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      roles: ['all'],
    },
    {
      label: 'Documents & Evidence',
      path: '/documents',
      icon: FolderOpen,
      roles: ['all'],
    },
    {
      label: 'Analytics Dashboard',
      path: '/analytics',
      icon: BarChart3,
      roles: ['Revenue Officer', 'Survey Officer', 'Dispute Authority', 'Administrator', 'Policymaker', 'System Auditor'],
    },
    {
      label: 'Policy Insights',
      path: '/policy-insights',
      icon: TrendingUp,
      roles: ['Revenue Officer', 'Policymaker', 'Administrator', 'Dispute Authority'],
    },
    {
      label: 'Audit Trail',
      path: '/audit-logs',
      icon: ScrollText,
      roles: ['Revenue Officer', 'Administrator', 'System Auditor'],
    },
    {
      label: 'Admin & Integrations',
      path: '/admin',
      icon: SlidersHorizontal,
      roles: ['Administrator', 'System Auditor'],
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      roles: ['all'],
    },
  ];

  // Filter items by role
  const visibleItems = navItems.filter((item) => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(currentUser?.role);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-2xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isCitizen ? 'Citizen Services' : 'Governance & Analysis'}
          </div>

          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Info & SIH Demo Badge */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-indigo-700 font-semibold truncate">{currentUser?.role}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>SIH PS 26019</span>
              <span className="font-semibold text-emerald-600">v1.0 Demo</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
