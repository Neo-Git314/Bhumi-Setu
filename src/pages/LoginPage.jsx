import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle,
  Building2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { login, USER_ROLES, DEMO_USERS } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(USER_ROLES.REVENUE_OFFICER);
  const [email, setEmail] = useState('vikram.malhotra@gov.in');
  const [password, setPassword] = useState('GovPass@2024');
  const [captchaInput, setCaptchaInput] = useState('BHUMI360');
  const [captchaCode] = useState('BHUMI360');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
      toast.error('Captcha Mismatch', 'Please enter the exact security code shown.');
      return;
    }

    login(selectedRole);
    toast.success('Authentication Successful', `Welcome, logged in as ${selectedRole}`);

    if (selectedRole === USER_ROLES.CITIZEN) {
      navigate('/citizen/dashboard');
    } else {
      navigate('/officer/dashboard');
    }
  };

  const handleQuickDemoClick = (role) => {
    login(role);
    toast.success('Demo Quick Access', `Signed in as ${role}`);
    if (role === USER_ROLES.CITIZEN) {
      navigate('/citizen/dashboard');
    } else {
      navigate('/officer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-900 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-slate-900 font-sans">BHUMI SETU</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                360°
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              National Land Governance Gateway
            </p>
          </div>
        </Link>
        <h2 className="mt-6 text-xl font-bold text-slate-900">Sign in to BHUMI SETU 360°</h2>
        <p className="text-xs text-slate-500 mt-1">Single Sign-On (SSO) & Jan-Parichay Simulated Access</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          {/* Quick Demo One-Click Personas for SIH Judges */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> SIH Evaluation — 1-Click Fast Login:
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">
                Judges Shortcut
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { label: 'Revenue Officer', role: USER_ROLES.REVENUE_OFFICER },
                { label: 'Citizen', role: USER_ROLES.CITIZEN },
                { label: 'Dispute Authority', role: USER_ROLES.DISPUTE_AUTHORITY },
                { label: 'Survey Officer', role: USER_ROLES.SURVEY_OFFICER },
              ].map((btn) => (
                <button
                  key={btn.role}
                  type="button"
                  onClick={() => handleQuickDemoClick(btn.role)}
                  className="px-2.5 py-1.5 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-xs font-semibold text-slate-700 transition-all text-center shadow-2xs"
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: 'Policymaker', role: USER_ROLES.POLICYMAKER },
                { label: 'Administrator', role: USER_ROLES.ADMINISTRATOR },
                { label: 'System Auditor', role: USER_ROLES.SYSTEM_AUDITOR },
              ].map((btn) => (
                <button
                  key={btn.role}
                  type="button"
                  onClick={() => handleQuickDemoClick(btn.role)}
                  className="px-2 py-1 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-[11px] font-medium text-slate-600 transition-all text-center"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">Or enter credentials</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Authorized Role
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  {Object.values(USER_ROLES).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email / User ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Official Govt ID / Aadhaar
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  placeholder="e.g. officer@gov.in or citizen@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password / Digital Signature Token
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Simulated Captcha */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Security Verification (Captcha)
              </label>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-300 font-mono font-black text-slate-700 tracking-widest select-none line-through text-sm">
                  {captchaCode}
                </div>
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm uppercase focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  placeholder="Type code above"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In as {selectedRole}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Secured via Jan-Parichay & NIC Cyber Security Framework.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
