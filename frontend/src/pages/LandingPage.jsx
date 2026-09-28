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
      <section className="relative px-6 sm:px-12 pt-10 sm:pt-14 pb-16 overflow-hidden max-w-7xl mx-auto flex flex-col items-center text-center animate-fade-in">
        {/* Multi-Color Ambient Glows: Purple, Emerald, Amber, Rose */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hindsight Live Cognitive Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-xs mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Brain size={14} className="text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Hindsight by Vectorize</span>
          <span className="text-slate-400">•</span>
          <span className="text-indigo-700 dark:text-indigo-300 font-bold">Persistent Cognitive Memory</span>
        </div>

        {/* Main Headline with High-Contrast Multi-Color Gradient */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.14]">
          Your CRM remembers the deal.{' '}
          <span className="inline-block bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600 dark:from-purple-400 dark:via-indigo-300 dark:to-emerald-400 bg-clip-text text-transparent font-black drop-shadow-xs">
            DealMemory remembers what actually worked.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
          AI relationship intelligence for B2B sales — powered by persistent memory and outcome-based learning.
        </p>

        {/* Multi-Color Semantic Pillar Badges: Green, Red, Yellow, Purple */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-800 dark:text-purple-300 text-xs font-bold shadow-2xs">
            <Database size={13} className="text-purple-600 dark:text-purple-400" />
            <span>Persistent Memory Bank</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>100% Grounded Recommendations</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs font-bold shadow-2xs">
            <XCircle size={13} className="text-rose-600 dark:text-rose-400" />
            <span>Prevents Failed Discount Tactics</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-2xs">
            <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Early Risk & Blocker Alerts</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <NavLink
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Explore DealMemory</span>
            <ArrowRight size={18} />
          </NavLink>

          <button
            onClick={() => scrollToSection('pipeline')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-bold text-sm sm:text-base transition-all cursor-pointer shadow-xs"
          >
            <Layers size={17} className="text-indigo-600 dark:text-indigo-400" />
            <span>See How It Learns</span>
          </button>
        </div>

        {/* Multi-Color Cognitive Pipeline Banner */}
        <div id="pipeline" className="scroll-mt-24 mt-12 w-full max-w-4xl p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-xs">
            <span className="flex items-center space-x-1.5 text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
              <span>Continuous Intelligence Pipeline</span>
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Memory → Outcome → Learning → Adapted Action</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-2.5 items-stretch text-left">
            {/* 1. Amber Yellow */}
            <div className="bg-amber-50/80 dark:bg-slate-950 p-3 rounded-xl border border-amber-300 dark:border-amber-500/40 flex flex-col justify-between shadow-2xs">
              <div className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">1. Interaction</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Customer Call</div>
              <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">Sarah wants API-first</div>
            </div>

            {/* 2. Purple Violet */}
            <div className="bg-purple-50/80 dark:bg-slate-950 p-3 rounded-xl border border-purple-300 dark:border-purple-500/40 flex flex-col justify-between shadow-2xs">
              <div className="text-[10px] text-purple-800 dark:text-purple-400 font-bold uppercase tracking-wider">2. Memory</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Hindsight Bank</div>
              <div className="text-[11px] text-purple-800 dark:text-purple-300 font-medium">Retain relationship facts</div>
            </div>

            {/* 3. Rose Red */}
            <div className="bg-rose-50/90 dark:bg-slate-950 p-3 rounded-xl border border-rose-300 dark:border-rose-500/50 flex flex-col justify-between shadow-2xs">
              <div className="text-[10px] text-rose-800 dark:text-rose-400 font-bold uppercase tracking-wider">3. Outcome</div>
              <div className="text-xs font-bold text-rose-950 dark:text-rose-200 mt-1">15% Discount</div>
              <div className="text-[11px] text-rose-800 dark:text-rose-300 font-bold flex items-center space-x-1">
                <span>❌ FAILED</span>
              </div>
            </div>

            {/* 4. Indigo Purple */}
            <div className="bg-indigo-50/80 dark:bg-slate-950 p-3 rounded-xl border border-indigo-300 dark:border-indigo-500/40 flex flex-col justify-between shadow-2xs">
              <div className="text-[10px] text-indigo-800 dark:text-indigo-400 font-bold uppercase tracking-wider">4. Reflection</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Hindsight Reflect</div>
              <div className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium">Value gap identified</div>
            </div>

            {/* 5. Emerald Green */}
            <div className="bg-emerald-50/80 dark:bg-slate-950 p-3 rounded-xl border border-emerald-300 dark:border-emerald-500/40 flex flex-col justify-between shadow-2xs">
              <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">5. Learning</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Core Insight</div>
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">Price is proxy for ROI</div>
            </div>

            {/* 6. Solid Emerald Next Action */}
            <div className="bg-emerald-100 dark:bg-emerald-950/50 p-3 rounded-xl border-2 border-emerald-400 dark:border-emerald-500/60 flex flex-col justify-between col-span-2 sm:col-span-1 shadow-xs">
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-black uppercase tracking-wider">6. Next Action</div>
              <div className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 mt-1">Do NOT Discount</div>
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">Prove integration ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs The Solution - Red vs Green Theme */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Problem: Red / Rose Accent */}
            <div className="bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md relative overflow-hidden">
              <div className="inline-flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30">
                <AlertTriangle size={14} className="text-rose-600 dark:text-rose-400" />
                <span>The Problem</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Traditional CRMs are static cemeteries of meeting notes.
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Sales reps dutifully type notes, log contacts, and record activities. But the CRM never remembers what strategy was attempted, never understands why a prospect rejected an offer, and never changes what it advises reps to do in the next meeting.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs">
                <li className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Notes sit forgotten in unindexed activity feeds</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>No institutional memory of failed sales tactics</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Reps repeatedly pitch discounts that stall the deal</span>
                </li>
              </ul>
            </div>

            {/* The Solution: Green / Emerald & Purple Accent */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-xl">
              <div className="inline-flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>The Solution</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                DealMemory transforms every interaction into adaptive strategy.
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Powered by Hindsight by Vectorize, DealMemory builds persistent cognitive memory for enterprise accounts. It records what happened, reflects on strategy outcomes, learns why deals stall, and prescribes grounded next actions.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-white font-semibold">Persistently retains stakeholder priorities & technical blockers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-white font-semibold">Understands whether a strategy succeeded or failed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-900 dark:text-white font-semibold">Explicitly warns reps: "Do NOT discount again. Prove integration ROI."</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Concrete ACME Corp Story Walkthrough - Yellow, Red, Purple, Green Cards */}
      <section id="how-it-works" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-400 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
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
            {/* Step 1: Amber Yellow Card */}
            <div className="bg-amber-50/50 dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-500/30 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-500/20 px-2 py-0.5 rounded">
                Step 1: Stakeholder Discovery
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah & David State Blockers</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                VP Sales Sarah requests an API-first sync. CTO David joins expressing deep concern over integration complexity and enterprise security.
              </p>
            </div>

            {/* Step 2: Rose Red Card */}
            <div className="bg-rose-50/60 dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-500/30 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-500/20 px-2 py-0.5 rounded">
                Step 2: Strategy Outcome
              </div>
              <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">15% Discount Attempt FAILED</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rep offered an annual discount to bypass budget concerns. CFO Michael rejected it immediately: "The proposal lacks clear integration ROI."
              </p>
            </div>

            {/* Step 3: Purple Violet Card */}
            <div className="bg-purple-50/50 dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-500/30 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-500/20 px-2 py-0.5 rounded">
                Step 3: Hindsight Reflection
              </div>
              <h4 className="text-sm font-bold text-purple-950 dark:text-purple-200">Autonomous Learning</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hindsight correlates Michael's price objection with David's unaddressed technical concerns: price was merely a proxy for unverified ROI.
              </p>
            </div>

            {/* Step 4: Emerald Green Card */}
            <div className="bg-emerald-50/60 dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-500/30 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-500/20 px-2 py-0.5 rounded">
                Step 4: Adapted Action
              </div>
              <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">Next Meeting Briefing</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The agent warns: "Do NOT discount again. Prepare an integration ROI business case for Michael and an architecture review for David."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section - Red vs Green Columns */}
      <section id="comparison" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 px-6 sm:px-12 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Traditional CRM vs DealMemory
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            A fundamental shift from passive record-keeping to active relationship intelligence.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6 w-1/2 bg-rose-50/70 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
                  Traditional CRM
                </th>
                <th className="py-4 px-6 w-1/2 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-l border-slate-200 dark:border-slate-800">
                  DealMemory (with Hindsight)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950/60 text-xs sm:text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-700 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Stores static text call notes</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Builds persistent relationship memory</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-700 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Records activities blindly</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Understands whether strategies worked or failed</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-700 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Manual pre-call preparation</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>AI-generated executive briefings & warnings</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-700 dark:text-slate-400 flex items-center space-x-2">
                  <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Repeats failed pricing concessions</span>
                </td>
                <td className="py-3.5 px-6 text-slate-900 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Explicitly warns: "Do NOT repeat the failed discount"</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Powered by Hindsight Section - Purple, Amber, Emerald triad */}
      <section id="hindsight" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-xs text-purple-700 dark:text-purple-400 mb-6 font-bold">
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
            {/* 1. Retain: Purple */}
            <div className="p-6 rounded-3xl bg-purple-50/40 dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-500/30 shadow-xs">
              <div className="text-xs uppercase tracking-wider font-bold text-purple-700 dark:text-purple-400">1. Retain</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Context Ingestion</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                Stores interactions, stakeholder concerns, and strategy outcomes in isolated tenant memory banks.
              </p>
            </div>

            {/* 2. Recall: Amber */}
            <div className="p-6 rounded-3xl bg-amber-50/40 dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-500/30 shadow-xs">
              <div className="text-xs uppercase tracking-wider font-bold text-amber-800 dark:text-amber-400">2. Recall</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Semantic Retrieval</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                Gathers precise deal context, historical facts, and objections when preparing for upcoming meetings.
              </p>
            </div>

            {/* 3. Reflect: Emerald */}
            <div className="p-6 rounded-3xl bg-emerald-50/40 dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-500/30 shadow-xs">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">3. Reflect</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">Autonomous Synthesis</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                Correlates failed outcomes with underlying objections to formulate adaptive, winning recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 sm:px-12 text-center border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-slate-900/60 dark:to-slate-950">
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
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
