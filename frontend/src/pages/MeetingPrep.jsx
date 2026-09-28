import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarCheck2,
  Users,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Target,
  Bot,
  Layers,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { fetchMeetingPrep } from '../api';

export default function MeetingPrep() {
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrep = () => {
    setLoading(true);
    fetchMeetingPrep('acme')
      .then((data) => {
        setPrepData(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPrep();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-fade-in">
      {/* Executive Briefing Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarCheck2 size={16} />
              <span>Executive Meeting Briefing</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                NEXT MEETING: ACME Corp
              </h1>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">$120,000 ARR</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Generated from Hindsight relationship memory + previous strategy outcomes.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={loadPrep}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-750 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-indigo-600 dark:text-indigo-400' : 'text-slate-500'} />
              <span>Regenerate Brief</span>
            </button>
            <Link
              to="/agent"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Bot size={15} />
              <span>Ask Agent</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <Sparkles size={24} className="mx-auto text-indigo-600 dark:text-indigo-400 animate-spin" />
          <div className="text-slate-900 dark:text-white font-bold text-sm">
            Recalling memories & synthesizing executive meeting intelligence...
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            Hindsight reflect() evaluating past outcomes against next meeting objectives
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 p-6 rounded-2xl text-xs text-rose-800 dark:text-rose-300 space-y-2 shadow-xs">
          <div className="font-bold">Error loading meeting prep:</div>
          <div>{error}</div>
          <button
            onClick={loadPrep}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold mt-2 cursor-pointer shadow-xs"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. WHAT CHANGED */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center space-x-1.5">
                <Layers size={15} />
                <span>1. What Changed in the Deal</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Account Dynamics</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {prepData?.relationship_summary ||
                'The engagement progressed from discovery into technical evaluation. Functional alignment on API-first data sync exists with Sarah (VP Sales), but CTO David introduced major architectural security concerns, and CFO Michael rejected our 15% discount offer.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 bg-indigo-50/50 dark:bg-slate-950 rounded-xl border border-indigo-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">Sarah — VP Sales</div>
                <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-semibold">Business Champion</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Needs API-first sync to unify internal pipeline data.</p>
              </div>

              <div className="p-3.5 bg-amber-50/50 dark:bg-slate-950 rounded-xl border border-amber-200 dark:border-amber-500/30 space-y-1">
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">David — CTO</div>
                <div className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">Technical Blocker</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Concerned about webhook latency and enterprise security.</p>
              </div>

              <div className="p-3.5 bg-rose-50/50 dark:bg-slate-950 rounded-xl border border-rose-200 dark:border-rose-500/30 space-y-1">
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">Michael — CFO</div>
                <div className="text-[10px] text-rose-800 dark:text-rose-400 font-semibold">Budget Gatekeeper</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Rejected 15% discount due to unproven integration ROI.</p>
              </div>
            </div>
          </div>

          {/* 2. WHAT WE LEARNED & WHAT TO AVOID */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* What We Learned */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-850">
                <Lightbulb size={15} />
                <span>2. What Hindsight Learned</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Price was a proxy for ROI:</strong> Lowering the price did not address the CFO's underlying doubt.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Technical sign-off is required:</strong> Michael will not approve budget until David approves the architecture.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Sarah's champion status:</strong> Anchor on her business goal of eliminating data silos across teams.</span>
                </li>
              </ul>
            </div>

            {/* What To Avoid */}
            <div className="bg-rose-50/50 dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-rose-200 dark:border-rose-500/20">
                <XCircle size={15} />
                <span>3. What To Avoid</span>
              </div>
              <ul className="space-y-2.5 text-xs text-rose-900 dark:text-rose-200">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                  <span><strong>DO NOT offer further discounts:</strong> Signals desperation and reinforces perception of weak product value.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                  <span><strong>DO NOT rush commercial closing:</strong> Bypassing CTO David's security evaluation will permanently kill the deal.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                  <span><strong>DO NOT give generic sales talk:</strong> Avoid high-level pitches; provide concrete latency and architecture specs.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. WHAT TO SAY & RECOMMENDED STRATEGY */}
          <div className="bg-emerald-50/40 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center space-x-1.5">
                <Target size={16} />
                <span>4. Recommended Strategy & Talking Points</span>
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">Value-Based Technical Demo</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare size={13} className="text-indigo-600 dark:text-indigo-400" />
                  <span>For Sarah (VP Sales):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  "Let's review how our API-first pipeline connects your CRM with ERP systems live, eliminating manual pipeline handoffs for your team."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-amber-200 dark:border-slate-800 space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare size={13} className="text-amber-600 dark:text-amber-400" />
                  <span>For David (CTO):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  "We have prepared our webhook SLA and SOC2 architecture diagram specifically addressing your integration complexity questions."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 space-y-1 shadow-2xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>For Michael (CFO):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  "Based on our integration modeling, automating this data flow saves an estimated $180,000 annually in engineering overhead — far exceeding the $120,000 ARR investment."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
