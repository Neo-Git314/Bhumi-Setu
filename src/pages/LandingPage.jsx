import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Layers,
  MapPin,
  Sparkles,
  ShieldAlert,
  FolderOpen,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileCheck,
  UserCheck,
  TrendingUp,
  Search,
  Scale,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchPersona, USER_ROLES } = useAuth();

  const handleQuickDemo = (role) => {
    switchPersona(role);
    if (role === USER_ROLES.CITIZEN) {
      navigate('/citizen/dashboard');
    } else {
      navigate('/officer/dashboard');
    }
  };

  const workflowSteps = [
    {
      title: 'Land Records',
      desc: 'DILRMP, RoR & Jamabandi ingestion',
      icon: Layers,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'AI Validation',
      desc: 'Anomalies, duplicate & overlap scan',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'GIS Integration',
      desc: 'Cadastral polygons & satellite layers',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Evidence Matching',
      desc: 'Deeds, mutation & drone surveys',
      icon: FolderOpen,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Official Review',
      desc: 'Human-in-the-loop judicial decisions',
      icon: Scale,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Policy Analytics',
      desc: 'Statewide insights & cluster tracking',
      icon: TrendingUp,
      color: 'from-rose-500 to-pink-600',
    },
  ];

  const features = [
    {
      title: 'Unified Land Records',
      desc: 'Standardized digital repository connecting ownership, mutation, survey numbers, and historical bahi khata records in one interoperable format.',
      icon: Layers,
      tag: 'Interoperability',
    },
    {
      title: 'GIS & Spatial Intelligence',
      desc: 'Cadastral parcel polygons overlaid on high-resolution OpenStreetMap and satellite views with dynamic land-use and disputed zone layers.',
      icon: MapPin,
      tag: 'Cadastral GIS',
    },
    {
      title: 'AI Data Validation',
      desc: 'NLP and spatial algorithms that pre-screen records for duplicate registries, conflicting names, missing NOCs, and boundary coordinate overlaps.',
      icon: Sparkles,
      tag: 'AI Anomaly Guard',
    },
    {
      title: 'Dispute Management',
      desc: 'Transparent 6-stage lifecycle from complaint to judicial closure with automated timelines, officer assignment, and dispute categories.',
      icon: ShieldAlert,
      tag: 'Due Process',
    },
    {
      title: 'Evidence Management',
      desc: 'Cryptographically hashed documents, drone surveys, and historical deed repository with side-by-side record diff comparison.',
      icon: FolderOpen,
      tag: 'Tamper-Proof Audit',
    },
    {
      title: 'Governance Analytics',
      desc: 'Multi-dimensional executive dashboards offering real-time visibility into pendency, dispute resolution latency, and regional land use velocity.',
      icon: BarChart3,
      tag: 'Decision Support',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top National Header Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">Smart India Hackathon 2024</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Problem Statement: 26019</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden md:inline">Ministry of Rural Development / Land Resources</span>
          <span className="bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded font-mono text-[10px]">
            PROTOTYPE DEMO v1.0
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/20">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900 font-sans">BHUMI SETU</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  360°
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Integrated Land Governance & Decision Support Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => handleQuickDemo(USER_ROLES.REVENUE_OFFICER)}
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 group"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>SIH 2024 National Finalist Solution • Problem Statement 26019</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Connecting <span className="text-indigo-600">Land, Data & Decisions</span> for Better Governance.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            An AI-powered integrated land governance and decision-support platform that connects{' '}
            <span className="font-semibold text-slate-900">Land Records, GIS, AI, Dispute Management, Evidence Repository, and Policy Insights</span>{' '}
            into a unified, transparent digital ecosystem.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleQuickDemo(USER_ROLES.REVENUE_OFFICER)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2.5"
            >
              <UserCheck className="w-5 h-5 text-amber-300" />
              <span>Launch Officer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleQuickDemo(USER_ROLES.CITIZEN)}
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-300/80 shadow-xs transition-all flex items-center gap-2.5"
            >
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Citizen Portal & Search</span>
            </button>

            <Link
              to="/gis-map"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-5 py-3.5 rounded-2xl border border-slate-200 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Interactive GIS Map</span>
            </Link>
          </div>

          {/* Core Principles Pill */}
          <div className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs font-medium">
            <span className="font-bold text-amber-800 uppercase tracking-wide text-[10px] bg-amber-200/60 px-2 py-0.5 rounded">
              Core Principle
            </span>
            <span>AI assists land governance — it does not replace authorized human decision-making.</span>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section: Land Data -> AI Validation -> GIS -> Evidence -> Review -> Analytics */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Architectural Workflow</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              End-to-End Land Governance Pipeline
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              How Bhumi Setu 360° unifies disparate revenue data into verified, evidence-backed administrative outcomes.
            </p>
          </div>

          {/* Workflow Steps Horizontal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 relative group hover:shadow-md hover:bg-indigo-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 font-mono">0{idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Core Modules</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Complete Land Lifecycle Governance
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto">
              Meeting all functional requirements defined in the Smart India Hackathon problem statement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                        {feat.tag}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group cursor-pointer">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Roles Quick Showcase */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900">Multi-Role Specialized Workspaces</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select any role to instantly experience tailored dashboards and authorization scopes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { role: USER_ROLES.REVENUE_OFFICER, desc: 'Records, Verification, Cases', color: 'indigo' },
              { role: USER_ROLES.CITIZEN, desc: 'Public Land Search & Issues', color: 'emerald' },
              { role: USER_ROLES.SURVEY_OFFICER, desc: 'GIS & Cadastral Layers', color: 'blue' },
              { role: USER_ROLES.DISPUTE_AUTHORITY, desc: 'Hearings & Evidence Review', color: 'rose' },
              { role: USER_ROLES.POLICYMAKER, desc: 'Aggregated Macro Trends', color: 'amber' },
              { role: USER_ROLES.ADMINISTRATOR, desc: 'System & API Integrations', color: 'purple' },
              { role: USER_ROLES.SYSTEM_AUDITOR, desc: 'Audit Logs & Hash Integrity', color: 'slate' },
            ].map((r) => (
              <button
                key={r.role}
                onClick={() => handleQuickDemo(r.role)}
                className="bg-slate-50 hover:bg-indigo-50/60 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-left transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{r.role}</span>
                  <span className="text-[10px] text-slate-500 block mt-1 leading-tight">{r.desc}</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 mt-3 flex items-center gap-1">
                  Launch <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-white text-sm">BHUMI SETU 360°</span>
              <p className="text-[11px] text-slate-500">Smart India Hackathon 2024 Working Prototype</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link to="/officer/dashboard" className="hover:text-white transition-colors">Officer Dashboard</Link>
            <Link to="/citizen/dashboard" className="hover:text-white transition-colors">Citizen Portal</Link>
            <Link to="/gis-map" className="hover:text-white transition-colors">GIS Map</Link>
            <Link to="/ai-validation" className="hover:text-white transition-colors">AI Validation</Link>
            <Link to="/disputes" className="hover:text-white transition-colors">Disputes</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
