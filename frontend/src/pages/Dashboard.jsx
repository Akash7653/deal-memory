import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  History,
  Lightbulb,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
  Building,
  ArrowDown,
  XCircle,
  Database,
  BrainCircuit,
} from 'lucide-react';
import { fetchDealMemory } from '../api';

export default function Dashboard() {
  const [memoryCount, setMemoryCount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealMemory('acme')
      .then((data) => {
        if (data.count) setMemoryCount(data.count);
      })
      .catch((err) => console.log('Memory fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Visual Hook: Traditional CRM vs DealMemory */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <BrainCircuit size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Cognitive Sales Layer
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Hindsight by Vectorize
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              <span className="text-slate-400">Traditional CRMs store static notes.</span>{' '}
              <strong className="text-white font-semibold">
                DealMemory remembers what happened, learns from previous outcomes, and advises your next move.
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-center flex-shrink-0">
          <Link
            to="/meeting-prep"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center space-x-1.5 shadow-md shadow-sky-600/20 transition-all"
          >
            <Sparkles size={13} />
            <span>Launch 60s Demo</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Pipeline Value</span>
            <DollarSign size={15} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">$470,000</div>
          <div className="text-[11px] text-slate-400 mt-1">4 active sales opportunities</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Needs Attention</span>
            <AlertTriangle size={15} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">1 Deal Stalled</div>
          <div className="text-[11px] text-slate-400 mt-1">ACME Corp (Strategy failure)</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Persistent Memories</span>
            <History size={15} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">
            {loading ? '...' : `${memoryCount}+ Units`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Hindsight autonomous retention</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Cognitive Insights</span>
            <Lightbulb size={15} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">5 Lessons</div>
          <div className="text-[11px] text-slate-400 mt-1">Learned from strategy outcomes</div>
        </div>
      </div>

      {/* Primary Hero Deal Card: ACME Corp */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Primary Opportunity
              </span>
              <span className="text-xs text-slate-400">Stage: Evaluation</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Relationship Health: 78%</span>
              </span>
            </div>
            <div className="flex items-baseline space-x-3 mt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ACME Corp
              </h2>
              <span className="text-xl font-bold text-sky-400">$120,000 ARR</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/meeting-prep"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-sky-600/20 transition-all"
            >
              <span>Prepare Next Meeting</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/timeline"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              View Timeline
            </Link>
          </div>
        </div>

        {/* 60-Second Demo Highlight Card: What Failed -> Hindsight Learned -> New Strategy */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Relationship Learning Loop (Core Differentiator)
            </span>
            <span className="text-[11px] text-sky-400 font-mono">
              Bank: dealmemory-acme
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-3 items-center">
            {/* Step 1: Failed Strategy */}
            <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <XCircle size={14} />
                <span>Previous Strategy Failed</span>
              </div>
              <div className="text-xs font-semibold text-white">
                15% Upfront Discount Rejected
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Offered to resolve budget objection. CFO Michael rejected it: <em className="text-rose-300">"Price is not raw numbers; it lacks clear integration ROI."</em>
              </p>
            </div>

            {/* Step 2: Hindsight Learned */}
            <div className="bg-indigo-950/20 border border-indigo-500/30 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Hindsight Autonomous Learning</span>
              </div>
              <div className="text-xs font-semibold text-white">
                Price is a Proxy for Value
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Hindsight reflected: The customer is <strong className="text-white">value-skeptical</strong>, not price-sensitive. Lowering price reinforces lack of value.
              </p>
            </div>

            {/* Step 3: New Recommended Focus */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Prescribed Next Action</span>
              </div>
              <div className="text-xs font-semibold text-white">
                Prove Integration ROI & Security
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-white">Do NOT discount again.</strong> Provide a detailed business case on pipeline ROI and solve CTO David’s architecture security blocker.
              </p>
            </div>
          </div>
        </div>

        {/* Stakeholders & Objections Row */}
        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div className="bg-slate-850/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Stakeholders Involved
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                Sarah — <span className="text-slate-400">VP Sales (Champion)</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                David — <span className="text-slate-400">CTO (Tech Blocker)</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                Michael — <span className="text-slate-400">CFO (Budget Gatekeeper)</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-850/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Known Objections & Blockers
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                API integration complexity
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                Enterprise security architecture
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                Unproven integration ROI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Accounts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Pipeline Health Overview
          </h3>
          <span className="text-xs text-slate-400">3 Other Accounts Tracked</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Globex Corp</span>
              <span className="text-xs text-emerald-400 font-semibold">88% Health</span>
            </div>
            <div className="text-xs text-slate-400">$85,000 • Proposal Stage</div>
            <p className="text-xs text-slate-300 line-clamp-2">
              Security team approved architecture. Finalizing SLA commitments.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Stark Logistics</span>
              <span className="text-xs text-amber-400 font-semibold">65% Health</span>
            </div>
            <div className="text-xs text-slate-400">$140,000 • Discovery Stage</div>
            <p className="text-xs text-slate-300 line-clamp-2">
              Evaluating multi-region sync. Competing against legacy in-house scripts.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Wayne Enterprises</span>
              <span className="text-xs text-sky-400 font-semibold">82% Health</span>
            </div>
            <div className="text-xs text-slate-400">$210,000 • Tech Validation</div>
            <p className="text-xs text-slate-300 line-clamp-2">
              Architecture review validated. Waiting on procurement compliance checklist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
