import React, { useState, useEffect } from 'react';
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
import HindsightBrainAnimation from '../components/HindsightBrainAnimation';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Branded loading animation whenever the landing page is loaded
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const [showLandingLoader, setShowLandingLoader] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingProgress(45), 250);
    const t2 = setTimeout(() => setLoadingProgress(80), 650);
    const t3 = setTimeout(() => setLoadingProgress(100), 1050);
    const tExit = setTimeout(() => setIsLoaderExiting(true), 1300);
    const tDone = setTimeout(() => setShowLandingLoader(false), 1650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, []);

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
      {/* Branded Initial Landing Page Loader */}
      {showLandingLoader && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-350 ease-out ${
            isLoaderExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ transitionDuration: '350ms' }}
        >
          <div className="relative flex flex-col items-center p-8 text-center max-w-sm animate-fade-in">
            {/* Glowing Icon Container */}
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-emerald-500 flex items-center justify-center shadow-xl shadow-purple-600/30 text-white relative z-10">
                <Brain size={32} className="text-white animate-pulse" />
              </div>
              <div className="absolute -inset-2 rounded-3xl bg-purple-500/20 blur-lg animate-pulse" />
              <div
                className="absolute -inset-4 rounded-full border border-purple-500/25 animate-spin"
                style={{ animationDuration: '6s' }}
              />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              DealMemory
            </h2>
            <p className="text-xs text-purple-700 dark:text-purple-400 font-bold tracking-wider uppercase mt-1">
              Persistent Relationship Memory
            </p>

            {/* Dynamic Status Text */}
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-4 h-4 font-mono">
              {loadingProgress < 50
                ? 'Initializing persistent neural state...'
                : loadingProgress < 95
                ? 'Connecting Hindsight memory bank...'
                : 'Intelligence matrix ready.'}
            </p>

            {/* Animated Progress Bar */}
            <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1.5">
              {loadingProgress}%
            </span>
          </div>
        </div>
      )}

      {/* Top Floating Island Header */}
      <div className="pt-2 sm:pt-4 px-2.5 sm:px-8 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <header className="h-14 sm:h-16 max-w-7xl mx-auto border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl px-3 sm:px-8 flex items-center justify-between shadow-sm dark:shadow-xl dark:shadow-black/5">
          <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center shadow-md shadow-purple-600/30 text-white font-black text-base sm:text-xl flex-shrink-0">
              <Database size={18} className="text-white sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  DealMemory
                </span>
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Hindsight
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden lg:block">AI Relationship Intelligence for B2B Sales</p>
            </div>
          </NavLink>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
            {/* Mode / Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-xs flex-shrink-0"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-purple-600" />}
            </button>

            {/* Admin Portal Button placed directly beside the mode button */}
            <NavLink
              to="/admin/login"
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border border-purple-500/25 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-xs transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex-shrink-0"
              title="Platform Administration Portal"
            >
              <ShieldCheck size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Admin Portal</span>
            </NavLink>

            {isAuthenticated ? (
              <NavLink
                to="/dashboard"
                className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/20 whitespace-nowrap flex-shrink-0 transition-transform active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </NavLink>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
                {/* Sign In Button: hidden on mobile top nav, visible on sm+ */}
                <NavLink
                  to="/login"
                  className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-purple-600/30 dark:border-purple-500/50 bg-purple-50/90 hover:bg-purple-100/90 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 shadow-xs transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex-shrink-0"
                >
                  Sign In
                </NavLink>

                {/* Explore Deal: visible on md+ */}
                <NavLink
                  to="/register"
                  className="hidden md:inline-flex bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex-shrink-0"
                >
                  Explore Deal
                </NavLink>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Hero Section with Hindsight Memory Brain Animation */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-16 overflow-hidden max-w-7xl mx-auto w-full animate-fade-in">
        {/* Multi-Color Ambient Glows based on 6-color system */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Desktop / Tablet View (sm and above): Left Text, Right Full Card */}
        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-6 lg:gap-8 items-center text-left">
          {/* Left Column: Headlines, Explanations, Badges & CTAs */}
          <div className="sm:col-span-7 flex flex-col items-start text-left">
            {/* Hindsight Live Cognitive Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-xs mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <Brain size={14} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Hindsight by Vectorize</span>
              <span className="text-slate-400">•</span>
              <span className="text-purple-700 dark:text-purple-400 font-bold">Persistent Cognitive Memory</span>
            </div>

            {/* Main Headline with 6-Color Palette Gradient */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Your CRM remembers the deal.{' '}
              <span className="inline-block bg-gradient-to-r from-purple-700 via-purple-600 to-emerald-600 dark:from-purple-400 dark:via-purple-300 dark:to-emerald-400 bg-clip-text text-transparent font-black drop-shadow-xs">
                DealMemory remembers what actually worked.
              </span>
            </h1>

            {/* Explanatory Content for Hindsight Memory */}
            <div className="mt-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm w-full max-w-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">
                Persistent Relationship Memory
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                DealMemory remembers customer interactions, outcomes, and lessons through Hindsight — so every future conversation starts with context.
              </p>
              <div className="mt-2.5 flex items-center space-x-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <span>Remember</span>
                <span className="text-slate-400">→</span>
                <span>Learn</span>
                <span className="text-slate-400">→</span>
                <span>Adapt</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-row items-center gap-3.5 w-auto">
              <NavLink
                to="/register"
                className="flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm md:text-base shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
              >
                <span>Explore DealMemory</span>
                <ArrowRight size={16} />
              </NavLink>

              <button
                onClick={() => scrollToSection('pipeline')}
                className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-bold text-sm md:text-base transition-all cursor-pointer shadow-xs active:scale-95 text-center"
              >
                <Layers size={16} className="text-purple-600 dark:text-purple-400" />
                <span>See How It Learns</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hindsight Brain Animation Full Card on Desktop */}
          <div className="sm:col-span-5 w-full flex justify-center items-center">
            <HindsightBrainAnimation />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW ONLY: Animation DOMINATES Left, Side Text Right, Centered Buttons Below */}
        {/* ========================================================================= */}
        <div className="sm:hidden flex flex-col items-center w-full">
          {/* Single Row: Animation on Left (Dominating Width & Height), Text on Right (Decreased Width & Increased Height) */}
          <div className="grid grid-cols-12 gap-2.5 items-center text-left w-full min-h-[220px] xs:min-h-[245px] py-3">
            {/* User's LEFT Side: Pure Animation - Dominant Width & Increased Height */}
            <div className="col-span-8 flex items-center justify-center bg-transparent h-[210px] xs:h-[235px] scale-120 xs:scale-125 origin-center">
              <HindsightBrainAnimation onlyAnimation={true} />
            </div>

            {/* User's RIGHT Side: Supporting Text - Decreased Width (col-span-4) & Increased Height */}
            <div className="col-span-4 flex flex-col justify-between text-left pr-0.5 h-[210px] xs:h-[235px] py-1">
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[10px] xs:text-xs shadow-2xs self-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Hindsight</span>
              </div>

              <h1 className="text-xs xs:text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug my-auto">
                Your CRM remembers deals.{' '}
                <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-emerald-600 dark:from-purple-400 dark:via-purple-300 dark:to-emerald-400 bg-clip-text text-transparent block mt-1">
                  DealMemory learns what works.
                </span>
              </h1>

              <div className="flex flex-col space-y-0.5 text-[9px] xs:text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>Remember</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>Learn</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  <span>Adapt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered CTA Buttons in Middle Below Animation & Text Row */}
          <div className="mt-4 flex flex-row items-center justify-center gap-2.5 w-full max-w-xs mx-auto">
            <NavLink
              to="/register"
              className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 text-center active:scale-95"
            >
              <span>Explore Deal</span>
              <ArrowRight size={13} />
            </NavLink>

            <button
              onClick={() => scrollToSection('pipeline')}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs text-center active:scale-95 shadow-2xs"
            >
              <Layers size={13} className="text-purple-600 dark:text-purple-400" />
              <span>See How It Learns</span>
            </button>
          </div>
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

            {/* 4. Violet Purple */}
            <div className="bg-purple-50/80 dark:bg-slate-950 p-3 rounded-xl border border-purple-300 dark:border-purple-500/40 flex flex-col justify-between shadow-2xs">
              <div className="text-[10px] text-purple-800 dark:text-purple-400 font-bold uppercase tracking-wider">4. Reflection</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">Hindsight Reflect</div>
              <div className="text-[11px] text-purple-800 dark:text-purple-300 font-medium">Value gap identified</div>
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
            <span className="text-xs uppercase tracking-wider font-bold text-purple-700 dark:text-purple-400 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
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

        {/* Mobile View: High-clarity Paired Contrast Cards (Both sides clearly visible) */}
        <div className="space-y-3.5 sm:hidden">
          {[
            {
              crm: 'Stores static text call notes',
              dm: 'Builds persistent relationship memory',
            },
            {
              crm: 'Records activities blindly',
              dm: 'Understands whether strategies worked or failed',
            },
            {
              crm: 'Manual pre-call preparation',
              dm: 'AI-generated executive briefings & warnings',
            },
            {
              crm: 'Repeats failed pricing concessions',
              dm: 'Explicitly warns: "Do NOT repeat the failed discount"',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
            >
              {/* Traditional CRM side */}
              <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-start space-x-2.5">
                <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    Traditional CRM
                  </div>
                  <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {item.crm}
                  </div>
                </div>
              </div>

              {/* DealMemory side */}
              <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start space-x-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    DealMemory (with Hindsight)
                  </div>
                  <div className="text-xs text-slate-950 dark:text-white font-bold">
                    {item.dm}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet View: Side-by-Side 50/50 Table with proper table-cell display */}
        <div className="hidden sm:block rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden bg-white dark:bg-slate-950/60">
          <table className="w-full table-fixed text-left text-sm border-collapse">
            <colgroup>
              <col className="w-1/2" />
              <col className="w-1/2" />
            </colgroup>
            <thead className="text-xs uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6 bg-rose-50/80 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
                  <div className="flex items-center space-x-2">
                    <XCircle size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>Traditional CRM</span>
                  </div>
                </th>
                <th className="py-4 px-6 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>DealMemory (with Hindsight)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 align-middle">
                  <div className="flex items-center space-x-3">
                    <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>Stores static text call notes</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-950 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 align-middle">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>Builds persistent relationship memory</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 align-middle">
                  <div className="flex items-center space-x-3">
                    <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>Records activities blindly</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-950 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 align-middle">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>Understands whether strategies worked or failed</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 align-middle">
                  <div className="flex items-center space-x-3">
                    <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>Manual pre-call preparation</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-950 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 align-middle">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>AI-generated executive briefings & warnings</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 align-middle">
                  <div className="flex items-center space-x-3">
                    <XCircle size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>Repeats failed pricing concessions</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-950 dark:text-white font-medium bg-emerald-50/20 dark:bg-emerald-950/10 border-l border-slate-200 dark:border-slate-800 align-middle">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>Explicitly warns: "Do NOT repeat the failed discount"</span>
                  </div>
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
      <section className="py-20 px-6 sm:px-12 text-center border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-purple-50/20 dark:from-slate-900/60 dark:to-slate-950">
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
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
      <footer className="py-8 px-6 sm:px-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-3">
        <div className="flex items-center space-x-2">
          <Database size={16} className="text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-300">DealMemory</span>
          <span>• AI Relationship Intelligence for B2B Sales</span>
        </div>
        <div className="flex items-center space-x-4">
          <NavLink
            to="/admin/login"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            <ShieldCheck size={14} className="text-purple-500" />
            <span>Platform Admin Portal</span>
          </NavLink>
          <span>•</span>
          <div className="text-slate-500 dark:text-slate-400">
            Powered by <span className="text-purple-600 dark:text-purple-400 font-medium">Hindsight by Vectorize</span> & <span className="text-purple-600 dark:text-purple-400 font-medium">Groq</span>
          </div>
        </div>
      </footer>

      {/* Dedicated Public Landing Page Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-4 w-full max-w-md mx-auto px-1.5 py-1.5 items-center">
          <button
            onClick={() => scrollToSection('top')}
            className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-center cursor-pointer active:scale-95"
          >
            <Home size={18} className="mb-0.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] font-medium leading-tight truncate w-full">Home</span>
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-center cursor-pointer active:scale-95"
          >
            <Layers size={18} className="mb-0.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] font-medium leading-tight truncate w-full">How It Works</span>
          </button>

          <button
            onClick={() => scrollToSection('comparison')}
            className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-center cursor-pointer active:scale-95"
          >
            <HelpCircle size={18} className="mb-0.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] font-medium leading-tight truncate w-full">Why DM</span>
          </button>

          {isAuthenticated ? (
            <NavLink
              to="/dashboard"
              className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-center active:scale-95"
            >
              <LayoutDashboard size={18} className="mb-0.5 text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] font-medium leading-tight truncate w-full">Dashboard</span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="flex flex-col items-center justify-center py-1 px-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-center active:scale-95"
            >
              <LogIn size={18} className="mb-0.5 text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] font-medium leading-tight truncate w-full">Sign In</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}
