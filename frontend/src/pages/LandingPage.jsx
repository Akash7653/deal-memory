import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Database,
  ArrowRight,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Building2,
  Calendar,
  Lock,
  Sun,
  Moon,
  Home,
  HelpCircle,
  Layers,
  Zap,
  LogIn,
  LayoutDashboard,
  Target,
  ArrowDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 76;
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - navOffset;
      window.scrollTo({
        top: Math.max(0, targetY),
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-24 md:pb-0 transition-colors duration-200">
      {/* Top Floating Island Header */}
      <div className="pt-2 sm:pt-4 px-2.5 sm:px-8 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <header className="h-14 sm:h-16 max-w-7xl mx-auto border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl px-3 sm:px-8 flex items-center justify-between shadow-sm dark:shadow-xl dark:shadow-black/5">
          <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-600/30 text-white font-black text-base sm:text-xl flex-shrink-0">
              <Database size={18} className="text-white sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  DealMemory
                </span>
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Hindsight
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden lg:block">AI Relationship Intelligence for B2B Sales</p>
            </div>
          </NavLink>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-xs flex-shrink-0"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <NavLink
                to="/dashboard"
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 whitespace-nowrap flex-shrink-0"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Sign In
                </NavLink>

                {/* Completely hidden on mobile to avoid overflow at 375px/390px/414px */}
                <NavLink
                  to="/register"
                  className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap flex-shrink-0"
                >
                  Explore Deal
                </NavLink>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-12 sm:pt-14 pb-16 overflow-hidden max-w-7xl mx-auto flex flex-col items-center text-center animate-fade-in">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-indigo-600 dark:text-indigo-400 mb-8 shadow-xs">
          <Brain size={14} className="text-indigo-500 dark:text-indigo-400" />
          <span>Powered by Hindsight by Vectorize</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Persistent Cognitive Memory</span>
        </div>

        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.12]">
          Your CRM remembers the deal.{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-200 bg-clip-text text-transparent">
            DealMemory remembers what actually worked.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          AI relationship intelligence for B2B sales — powered by persistent memory and outcome-based learning.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <NavLink
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <span>Explore DealMemory</span>
            <ArrowRight size={18} />
          </NavLink>

          <button
            onClick={() => scrollToSection('pipeline')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-sm sm:text-base transition-all cursor-pointer shadow-xs"
          >
            <Layers size={17} className="text-indigo-600 dark:text-indigo-400" />
            <span>See How It Learns</span>
          </button>
        </div>

        {/* Subtle Cognitive Pipeline Banner */}
        <div id="pipeline" className="scroll-mt-24 mt-12 w-full max-w-4xl p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles size={14} />
              <span>Continuous Intelligence Pipeline</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 lowercase">Memory → Outcome → Learning → Next Action</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-2.5 items-stretch text-left">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">1. Interaction</div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Customer Meeting</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Sarah wants API-first</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">2. Memory</div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Hindsight Bank</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Retain relationship facts</div>
            </div>

            <div className="bg-rose-50 dark:bg-slate-950 p-3 rounded-xl border border-rose-200 dark:border-rose-500/30 flex flex-col justify-between">
              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">3. Outcome</div>
              <div className="text-xs font-semibold text-rose-800 dark:text-rose-200 mt-1">15% Discount</div>
              <div className="text-[11px] text-rose-600 dark:text-rose-300 font-medium">❌ FAILED</div>
            </div>

            <div className="bg-indigo-50 dark:bg-slate-950 p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/30 flex flex-col justify-between">
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">4. Reflection</div>
              <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-200 mt-1">Hindsight Reflect</div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-300">Value gap identified</div>
            </div>

            <div className="bg-emerald-50 dark:bg-slate-950 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 flex flex-col justify-between">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">5. Learning</div>
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mt-1">Core Insight</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-300">Price is proxy for ROI</div>
            </div>

            <div className="bg-emerald-100/60 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-300 dark:border-emerald-500/40 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">6. Next Action</div>
              <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mt-1">Do NOT Discount</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Prove integration ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs The Solution */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/30 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Problem */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle size={14} />
                <span>The Problem</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Traditional CRMs are static cemeteries of meeting notes.
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Sales reps dutifully type notes, log contacts, and record activities. But the CRM never remembers what strategy was attempted, never understands why a prospect rejected an offer, and never changes what it advises reps to do in the next meeting.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>Notes sit forgotten in activity feeds</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>No institutional memory of failed tactics</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>Reps repeat the same failed discount attempts</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-xl">
              <div className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={14} />
                <span>The Solution</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                DealMemory transforms every interaction into adaptive strategy.
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Powered by Hindsight by Vectorize, DealMemory builds persistent cognitive memory for enterprise accounts. It records what happened, reflects on strategy outcomes, learns why deals stall, and prescribes grounded next actions.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-white font-medium">Persistently retains stakeholder priorities & technical blockers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-white font-medium">Understands whether a strategy succeeded or failed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-white font-medium">Warns reps: "Do NOT discount again. Prove integration ROI."</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Concrete ACME Corp Story Walkthrough */}
      <section id="how-it-works" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Live Proof in Action
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
              Memory → Outcome → Learning in 60 Seconds
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base mt-2">
              Here is how DealMemory saved the $120K ACME Corp enterprise opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 1: Stakeholder Discovery</div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah & David State Blockers</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                VP Sales Sarah requests an API-first sync. CTO David joins expressing deep concern over integration complexity and enterprise security.
              </p>
            </div>

            <div className="bg-rose-50/60 dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 p-5 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Step 2: Strategy Outcome</div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">15% Discount Attempt FAILED</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rep offered an annual discount to bypass budget concerns. CFO Michael rejected it immediately: "The proposal lacks clear integration ROI."
              </p>
            </div>

            <div className="bg-indigo-50/60 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 p-5 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 3: Hindsight Reflection</div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Autonomous Learning</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hindsight correlates Michael's price objection with David's unaddressed technical concerns: price was merely a proxy for unverified ROI.
              </p>
            </div>

            <div className="bg-emerald-50/60 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 p-5 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Step 4: Adapted Action</div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Next Meeting Briefing</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The agent warns: "Do NOT discount again. Prepare an integration ROI business case for Michael and an architecture review for David."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 px-6 sm:px-12 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Traditional CRM vs DealMemory
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            A fundamental shift from passive record-keeping to active relationship intelligence.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6 w-1/2">Traditional CRM</th>
                <th className="py-3.5 px-6 w-1/2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-l border-slate-200 dark:border-slate-800">
                  DealMemory (with Hindsight)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950/60 text-xs sm:text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>Stores static text call notes</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-indigo-50/40 dark:bg-indigo-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Builds persistent relationship memory</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>Records activities blindly</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-indigo-50/40 dark:bg-indigo-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Understands whether strategies worked or failed</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>Manual pre-call preparation</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-indigo-50/40 dark:bg-indigo-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>AI-generated executive briefings & warnings</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  <span>Repeats failed pricing concessions</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-indigo-50/40 dark:bg-indigo-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Explicitly warns: "Do NOT repeat the failed discount"</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Powered by Hindsight Section */}
      <section id="hindsight" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles size={14} />
            <span>The Memory Infrastructure</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Powered by Hindsight by Vectorize
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Hindsight provides persistent cognitive memory banks for enterprise deals, enabling a true three-layer intelligence loop:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">1. Retain</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Context Ingestion</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                Stores interactions, stakeholder concerns, and strategy outcomes in isolated tenant memory banks.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">2. Recall</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Semantic Retrieval</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                Gathers precise deal context, historical facts, and objections when preparing for upcoming meetings.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">3. Reflect</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Autonomous Synthesis</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                Correlates failed outcomes with underlying objections to formulate adaptive, winning recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 sm:px-12 text-center border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Start exploring DealMemory today.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base max-w-xl mx-auto">
            Experience how persistent memory transforms AI sales coaching from generic advice into strategic deal acceleration.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <NavLink
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Start exploring DealMemory
            </NavLink>
            <NavLink
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all shadow-xs"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 sm:px-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <Database size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-300">DealMemory</span>
          <span>• AI Relationship Intelligence for B2B Sales</span>
        </div>
        <div className="mt-3 sm:mt-0 text-slate-500 dark:text-slate-400">
          Powered by <span className="text-indigo-600 dark:text-indigo-400 font-medium">Hindsight by Vectorize</span> & <span className="text-indigo-600 dark:text-indigo-400 font-medium">Groq</span>
        </div>
      </footer>

      {/* Dedicated Public Landing Page Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-4 w-full max-w-md mx-auto px-1 py-1.5 items-center">
          <button
            onClick={() => scrollToSection('top')}
            className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center cursor-pointer"
          >
            <Home size={18} className="mb-0.5 text-indigo-500 dark:text-indigo-400" />
            <span className="text-[10px] font-medium leading-tight truncate w-full">Home</span>
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center cursor-pointer"
          >
            <Layers size={18} className="mb-0.5 text-indigo-500 dark:text-indigo-400" />
            <span className="text-[10px] font-medium leading-tight truncate w-full">How It Works</span>
          </button>

          <button
            onClick={() => scrollToSection('comparison')}
            className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center cursor-pointer"
          >
            <HelpCircle size={18} className="mb-0.5 text-indigo-500 dark:text-indigo-400" />
            <span className="text-[10px] font-medium leading-tight truncate w-full">Why DM</span>
          </button>

          {isAuthenticated ? (
            <NavLink
              to="/dashboard"
              className="flex flex-col items-center justify-center py-1 px-1 text-indigo-600 dark:text-indigo-400 font-bold text-center"
            >
              <LayoutDashboard size={18} className="mb-0.5" />
              <span className="text-[10px] leading-tight truncate w-full">Dashboard</span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="flex flex-col items-center justify-center py-1 px-1 text-indigo-600 dark:text-indigo-400 font-bold text-center"
            >
              <LogIn size={18} className="mb-0.5" />
              <span className="text-[10px] leading-tight truncate w-full">Sign In</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}
