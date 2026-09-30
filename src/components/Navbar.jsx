import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  UserCheck,
  ChevronDown,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Menu,
  Shield,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { notificationService, resetDemoData } from '../services/dataService';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, switchPersona, USER_ROLES, DEMO_USERS, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  const personaRef = useRef(null);

  // Load and subscribe to notifications
  useEffect(() => {
    const loadNotifs = () => {
      setNotifications(notificationService.getAll());
    };
    loadNotifs();

    window.addEventListener('bhumi_data_changed', loadNotifs);
    return () => window.removeEventListener('bhumi_data_changed', loadNotifs);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target)) {
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id, link) => {
    notificationService.markAsRead(id);
    setIsNotifOpen(false);
    if (link) navigate(link);
  };

  const handlePersonaSwitch = (role) => {
    switchPersona(role);
    setIsPersonaOpen(false);
    toast.info('Role Persona Switched', `Active view updated to ${role}`);
    if (role === USER_ROLES.CITIZEN) {
      navigate('/citizen/dashboard');
    } else {
      navigate('/officer/dashboard');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to pristine SIH seed values?')) {
      resetDemoData();
      toast.success('Demo Data Reset', 'All records, disputes, and alerts reset to initial state.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">BHUMI SETU</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                    360°
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1 hidden sm:block">
                  Integrated Land Governance Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-100/80 hover:bg-slate-100 hover:text-slate-600 rounded-xl border border-slate-200/80 transition-all shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search land parcels, disputes, Khasra, documents...</span>
              </span>
              <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right: Quick Persona Switcher, Notifications, Reset & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search mobile icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Persona Switcher Dropdown (Crucial for SIH judges) */}
            <div className="relative" ref={personaRef}>
              <button
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200/80 transition-all"
                title="Switch Demo Persona for evaluation"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="hidden sm:inline">Role:</span>
                <span className="max-w-[110px] truncate font-bold text-indigo-800">{currentUser?.role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Switch Demo Persona</p>
                    <p className="text-[11px] text-slate-500">Test different user permissions & workflows</p>
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto space-y-0.5">
                    {DEMO_USERS.map((user) => (
                      <button
                        key={user.role}
                        onClick={() => handlePersonaSwitch(user.role)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          currentUser?.role === user.role
                            ? 'bg-indigo-50 text-indigo-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.role[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{user.role}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.name}</p>
                        </div>
                        {currentUser?.role === user.role && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Notifications</p>
                      <p className="text-[11px] text-slate-500">{unreadCount} unread alerts</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => notificationService.markAllAsRead()}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="py-1 max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id, n.link)}
                        className={`p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800 leading-tight">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      View All Notifications <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo Data Pill */}
            <button
              onClick={handleReset}
              className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors"
              title="Reset mock state back to fresh seed data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-500">{currentUser?.district}, {currentUser?.state}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
