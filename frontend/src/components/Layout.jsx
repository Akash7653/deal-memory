import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  CalendarCheck2,
  Bot,
  PlusCircle,
  Search,
  Sparkles,
  Database,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { fetchHealth } from '../api';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hindsightStatus, setHindsightStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        if (data.hindsight_configured) {
          setHindsightStatus('connected');
        } else {
          setHindsightStatus('unconfigured');
        }
      })
      .catch(() => setHindsightStatus('offline'));
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/deal', label: 'ACME Deal Overview', icon: Building2 },
    { to: '/timeline', label: 'Memory Timeline', icon: GitBranch, badge: 'Hindsight' },
    { to: '/meeting-prep', label: 'Meeting Prep', icon: CalendarCheck2, badge: 'AI Intel' },
    { to: '/agent', label: 'AI Agent', icon: Bot, badge: 'Live Groq' },
    { to: '/add-interaction', label: 'Add Interaction', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <NavLink to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-600/20 text-white font-black text-lg">
              <Database size={19} className="text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  DealMemory
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Hindsight
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Relationship Intelligence for B2B Sales
              </p>
            </div>
          </NavLink>
        </div>

        {/* Global Search & Active Deal indicator */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs text-slate-400">
          <Search size={14} className="text-slate-400" />
          <span>Active Deal:</span>
          <span className="text-white font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            ACME Corp ($120K)
          </span>
        </div>

        {/* Status & User Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs">
            {hindsightStatus === 'connected' ? (
              <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Hindsight Connected</span>
              </span>
            ) : hindsightStatus === 'offline' ? (
              <span className="flex items-center space-x-1.5 text-rose-400 font-medium">
                <span className="w-2 h-2 rounded-full border border-rose-400" />
                <span>Hindsight Offline</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full border border-amber-400 animate-spin" />
                <span>Checking Bank...</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5 border-l border-slate-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-xs text-white">
              AC
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-200">Alex Carter</div>
              <div className="text-[10px] text-slate-400">Enterprise AE</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 hidden md:flex flex-col justify-between p-4">
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Sales Navigation
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={17} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Core Differentiator Callout Card */}
            <div className="bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold text-[11px]">
                <Sparkles size={14} />
                <span>Memory → Outcome → Learning</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                DealMemory doesn't just record calls. It tracks whether previous strategies worked and learns for future interactions.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                <span>Bank: dealmemory-acme</span>
                <span className="text-emerald-400">Live</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-850 rounded-lg text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Hindsight 0.10.1</span>
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              Vectorize persistent cognitive architecture
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur flex">
            <div className="w-72 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="font-bold text-white flex items-center space-x-2">
                    <Database size={18} className="text-sky-400" />
                    <span>DealMemory</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                            isActive
                              ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                DealMemory • Powered by Hindsight
              </div>
            </div>
            <div
              className="flex-1"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
