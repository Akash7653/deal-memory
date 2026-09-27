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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isAuthenticated, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <header className="h-18 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-600/30 text-white font-black text-xl">
            <Database size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                DealMemory
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Hindsight
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Relationship Intelligence for B2B Sales</p>
          </div>
        </NavLink>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-sky-400" />}
          </button>

          {isAuthenticated ? (
            <NavLink
              to="/dashboard"
              className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-sky-600/20"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </NavLink>
          ) : (
            <>
              <button
                onClick={handleDemoAccess}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition-all"
              >
                <Sparkles size={14} />
                <span>Demo (ACME)</span>
              </button>

              <NavLink
                to="/login"
                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/register"
                className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-sky-600/20 transition-all"
              >
                Start Free
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-16 pb-24 overflow-hidden max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 mb-8 shadow-sm">
          <Brain size={14} className="text-sky-400" />
          <span>Powered by Hindsight by Vectorize</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Persistent Cognitive Memory</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
          Your CRM remembers the deal.{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200 bg-clip-text text-transparent">
            DealMemory remembers what worked.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
          Persistent AI relationship memory that learns from customer interactions, failed strategies, and outcomes —
          then guides sales teams to make smarter decisions in the next meeting.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <NavLink
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Start Free</span>
            <ArrowRight size={18} />
          </NavLink>

          <button
            onClick={handleDemoAccess}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 hover:text-white font-semibold text-base transition-all"
          >
            <Sparkles size={17} className="text-sky-400" />
            <span>See How It Works (ACME Demo)</span>
          </button>
        </div>

        {/* Cognitive Loop Diagram Banner */}
        <div className="mt-14 w-full max-w-4xl p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-850/90 to-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
            The Continuous Intelligence Loop
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 items-center text-left">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">1. Interaction</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Customer Meeting</div>
              <div className="text-[11px] text-slate-400">Sarah wants API-first</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">2. Memory</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Hindsight Bank</div>
              <div className="text-[11px] text-slate-400">Retain relationship facts</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-500/30 bg-rose-500/5">
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">3. Outcome</div>
              <div className="text-xs font-semibold text-rose-200 mt-1">15% Discount Failed</div>
              <div className="text-[11px] text-rose-300/80">CFO rejects pricing</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">4. Reflection</div>
              <div className="text-xs font-semibold text-indigo-200 mt-1">Hindsight Reflect</div>
              <div className="text-[11px] text-indigo-300/80">Value gap identified</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">5. Next Action</div>
              <div className="text-xs font-semibold text-emerald-200 mt-1">Do NOT Discount</div>
              <div className="text-[11px] text-emerald-300/80">Prove integration ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-850 bg-slate-900/40 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              Cognitive Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              How DealMemory Powers B2B Sales
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Traditional CRMs are static cemeteries of meeting notes. DealMemory turns every interaction into an adaptive strategy asset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-base mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Remember</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hindsight persistently retains stakeholders, requirements, technical blockers, and commercial conversations across the entire deal cycle.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-base mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Learn</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                The cognitive reflection engine analyzes what strategies worked, what failed, and why customers pushed back.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Adapt</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                The agent pivots recommendations: it warns against repeating failed tactics and surfaces underlying value blockers.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Act</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sales representatives receive grounded executive meeting briefs and grounded Q&A with zero hallucinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Why DealMemory?
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            A fundamental shift from passive record-keeping to active relationship intelligence.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 w-1/2">Traditional CRM</th>
                <th className="py-4 px-6 w-1/2 bg-sky-950/40 text-sky-300 border-l border-slate-800">
                  DealMemory (with Hindsight)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-xs sm:text-sm">
              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-400 flex-shrink-0" />
                  <span>Stores static call notes</span>
                </td>
                <td className="py-3.5 px-6 text-white font-medium bg-sky-950/20 border-l border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Builds persistent relationship memory</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-400 flex-shrink-0" />
                  <span>Records past activities blindly</span>
                </td>
                <td className="py-3.5 px-6 text-white font-medium bg-sky-950/20 border-l border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Understands whether strategies worked</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-400 flex-shrink-0" />
                  <span>Fragmented history across reps</span>
                </td>
                <td className="py-3.5 px-6 text-white font-medium bg-sky-950/20 border-l border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Persistent cognitive reflection</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-400 flex-shrink-0" />
                  <span>Manual pre-call preparation</span>
                </td>
                <td className="py-3.5 px-6 text-white font-medium bg-sky-950/20 border-l border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>AI-generated executive briefings & warnings</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-6 text-slate-400 flex items-center space-x-2">
                  <XCircle size={15} className="text-rose-400 flex-shrink-0" />
                  <span>Doesn't learn from failed strategies</span>
                </td>
                <td className="py-3.5 px-6 text-white font-medium bg-sky-950/20 border-l border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Warns: "Do NOT repeat the failed discount"</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Powered by Hindsight Section */}
      <section className="py-20 border-t border-slate-850 bg-gradient-to-b from-slate-900/40 to-slate-950 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 mb-6">
            <Sparkles size={14} />
            <span>The Memory Infrastructure</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Powered by Hindsight by Vectorize
          </h2>

          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Hindsight transforms standard LLM interactions into persistent cognitive agents. By using dedicated memory banks, DealMemory implements true three-layer intelligence:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs uppercase tracking-wider font-bold text-sky-400">1. Retain</div>
              <h4 className="text-base font-bold text-white mt-1">Context Ingestion</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Stores interactions, stakeholder concerns, and failed strategy outcomes into dedicated tenant memory banks.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-400">2. Recall</div>
              <h4 className="text-base font-bold text-white mt-1">Semantic Retrieval</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Gathers precise deal context, historical facts, and recorded reactions when preparing for the next interaction.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs uppercase tracking-wider font-bold text-purple-400">3. Reflect</div>
              <h4 className="text-base font-bold text-white mt-1">Autonomous Synthesis</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Executes multi-step reflection to understand underlying value drivers and formulate adaptive next actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 sm:px-12 text-center border-t border-slate-800 bg-slate-900/80">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Turn customer history into relationship intelligence.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Experience how persistent memory transforms AI sales coaching from generic advice into strategic deal acceleration.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <NavLink
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-600/30 transition-all hover:scale-105"
            >
              Create Account
            </NavLink>
            <NavLink
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 font-semibold text-sm transition-all"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 sm:px-12 border-t border-slate-850 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <Database size={16} className="text-sky-400" />
          <span className="font-semibold text-slate-300">DealMemory</span>
          <span>• AI Relationship Intelligence for B2B Sales</span>
        </div>
        <div className="mt-3 sm:mt-0 text-slate-400">
          Powered by <span className="text-sky-400 font-medium">Hindsight by Vectorize</span> & <span className="text-indigo-400 font-medium">Groq</span>
        </div>
      </footer>
    </div>
  );
}
