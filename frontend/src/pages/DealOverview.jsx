import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  XCircle,
  TrendingDown,
  RefreshCw,
  Target,
  Radar,
  Calendar,
  Layers,
  Bot,
} from 'lucide-react';
import { fetchDealMemory } from '../api';

export default function DealOverview() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMemories = () => {
    setLoading(true);
    fetchDealMemory('acme')
      .then((data) => {
        setMemories(data.memories || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Enterprise Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-black text-xl text-white shadow-md shadow-indigo-600/25 flex-shrink-0">
              AC
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ACME Corp
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  Evaluation
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Relationship Health: 78%
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="text-white font-semibold text-sm">$120,000 ARR</span>
                <span>•</span>
                <span>B2B Enterprise CRM</span>
                <span>•</span>
                <span className="text-slate-400">Memory Bank: <code className="text-indigo-400">dealmemory-acme</code></span>
                <span>•</span>
                <span className="text-slate-400">Last Interaction: Sept 26, 2026</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/meeting-prep"
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles size={14} />
              <span>Prepare Meeting</span>
            </Link>
            <Link
              to="/agent"
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750 flex items-center space-x-1.5 transition-colors"
            >
              <Bot size={14} className="text-indigo-400" />
              <span>Ask Agent</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Deal Snapshot Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Stage</div>
          <div className="text-sm font-bold text-white">Evaluation</div>
          <div className="text-[11px] text-slate-400">Technical POC</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Value</div>
          <div className="text-sm font-bold text-white">$120,000 ARR</div>
          <div className="text-[11px] text-slate-400">Annual Contract</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Relationship Health</div>
          <div className="text-sm font-bold text-emerald-400">78% Health</div>
          <div className="text-[11px] text-slate-400">Champion Active</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Last Interaction</div>
          <div className="text-sm font-bold text-slate-200">Sept 26, 2026</div>
          <div className="text-[11px] text-rose-400">Discount Rejected</div>
        </div>
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-3.5 space-y-1 bg-indigo-500/5 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-semibold text-indigo-400 uppercase">Next Action</div>
          <div className="text-sm font-bold text-white">Prove ROI</div>
          <div className="text-[11px] text-indigo-300">Technical Briefing</div>
        </div>
      </div>

      {/* Strategies: Current Winning Strategy vs Strategy To Avoid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recommended Strategy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Current Winning Strategy</span>
          </div>
          <h3 className="text-base font-bold text-white">Prove Integration ROI and Technical Feasibility</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hindsight learned that CFO Michael's price pushback is a direct symptom of unverified integration value. Focus next meeting on operational hours saved by the API-first pipeline and clear security checklists with David.
          </p>
        </div>

        {/* Strategy to Avoid */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 bg-rose-500/5 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <XCircle size={16} />
            <span>Strategy To Avoid</span>
          </div>
          <h3 className="text-base font-bold text-rose-200">Do NOT Repeat Discounting</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            On Sept 26, offering a 15% upfront discount failed and alienated the CFO. Further price cuts signal low product value and will permanently stall enterprise procurement.
          </p>
        </div>
      </div>

      {/* Account Stakeholder Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Users size={16} className="text-indigo-400" />
            <span>Stakeholders & Account Map</span>
          </h3>
          <span className="text-xs text-slate-400">3 Stakeholders Retained in Hindsight</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Sarah */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
                S
              </div>
              <div>
                <div className="font-bold text-white text-sm">Sarah</div>
                <div className="text-xs text-slate-400">VP Sales</div>
              </div>
            </div>
            <div className="text-xs text-indigo-400 font-semibold pt-1">
              Business Champion
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mandated an API-first solution to unify sales pipeline data across internal systems. Wants fast rollout.
            </p>
          </div>

          {/* David */}
          <div className="bg-slate-900 border border-amber-500/30 p-4 sm:p-5 rounded-2xl space-y-2 bg-amber-500/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                D
              </div>
              <div>
                <div className="font-bold text-white text-sm">David</div>
                <div className="text-xs text-slate-400">CTO</div>
              </div>
            </div>
            <div className="text-xs text-amber-300 font-semibold pt-1">
              Technical Evaluator & Blocker
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Primary blocker. Deeply concerned about integration complexity, webhook latency, and SOC2/security architecture.
            </p>
          </div>

          {/* Michael */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700">
                M
              </div>
              <div>
                <div className="font-bold text-white text-sm">Michael</div>
                <div className="text-xs text-slate-400">CFO</div>
              </div>
            </div>
            <div className="text-xs text-slate-300 font-semibold pt-1">
              Financial Gatekeeper
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demands strict ROI proof. Rejected 15% discount because proposal lacked concrete operational cost justification.
            </p>
          </div>
        </div>
      </div>

      {/* Deal Risk Radar Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-850">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Shield size={16} />
            <span>Deal Risk Radar</span>
          </div>
          <span className="text-xs text-slate-400">Real Stored Intelligence</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 bg-rose-500/5 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Integration Risk</div>
            <div className="text-sm font-bold text-rose-400">High</div>
            <p className="text-[11px] text-slate-400">CTO raised API/webhook concerns</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 bg-amber-500/5 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Security Risk</div>
            <div className="text-sm font-bold text-amber-400">Medium</div>
            <p className="text-[11px] text-slate-400">Needs enterprise architecture review</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 bg-amber-500/5 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Budget Risk</div>
            <div className="text-sm font-bold text-amber-400">Medium</div>
            <p className="text-[11px] text-slate-400">CFO requires verified ROI</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Champion Health</div>
            <div className="text-sm font-bold text-emerald-400">Strong</div>
            <p className="text-[11px] text-slate-400">Sarah (VP Sales) committed</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Competition</div>
            <div className="text-sm font-bold text-slate-300">Watch</div>
            <p className="text-[11px] text-slate-400">Internal build evaluated</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-white">Biggest Risk:</span>{' '}
            <span className="text-slate-300">Integration complexity & unverified ROI with David (CTO).</span>
          </div>
          <div className="text-indigo-400 font-semibold flex items-center space-x-1.5 flex-shrink-0">
            <span>Recommended Action:</span>
            <Link to="/meeting-prep" className="underline hover:text-indigo-300">
              Schedule technical briefing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
