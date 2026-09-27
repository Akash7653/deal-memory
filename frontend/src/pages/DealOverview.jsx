import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  AlertTriangle,
  History,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Tag,
  CheckCircle,
  TrendingDown,
  RefreshCw,
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg">
              AC
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  ACME Corp
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                  Evaluation Stage
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="text-white font-semibold text-sm">$120,000 ARR</span>
                <span>•</span>
                <span>B2B Enterprise CRM</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Relationship Health: 78%</span>
                </span>
                <span>•</span>
                <span className="text-slate-400">Bank: dealmemory-acme</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/meeting-prep"
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center space-x-2 shadow-lg shadow-sky-600/20 transition-all"
            >
              <Sparkles size={14} />
              <span>Prepare Meeting</span>
            </Link>
            <Link
              to="/agent"
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              <span>Ask Agent</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stakeholders & Key Concerns Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stakeholders Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Users size={17} className="text-sky-400" />
              <span>Key Stakeholders & Account Map</span>
            </h3>
            <span className="text-xs text-slate-400">3 Identified in Memory</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/20">
                  S
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Sarah</div>
                  <div className="text-[11px] text-slate-400">VP Sales</div>
                </div>
              </div>
              <div className="text-xs text-sky-300 font-medium pt-1">
                Business Champion
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mandated an API-first solution to unify sales pipeline data across internal systems.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                  D
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">David</div>
                  <div className="text-[11px] text-slate-400">CTO</div>
                </div>
              </div>
              <div className="text-xs text-amber-300 font-medium pt-1">
                Technical Evaluator
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Primary blocker. Concerned about enterprise security architecture and integration complexity.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/20">
                  M
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Michael</div>
                  <div className="text-[11px] text-slate-400">CFO</div>
                </div>
              </div>
              <div className="text-xs text-rose-300 font-medium pt-1">
                Financial Gatekeeper
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Controls the budget. Rejected 15% discount because integration ROI was unquantified.
              </p>
            </div>
          </div>
        </div>

        {/* Known Objections & Blockers */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertTriangle size={17} className="text-amber-400" />
            <span>Active Objections</span>
          </h3>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-start space-x-3 pb-3 border-b border-slate-850">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Integration Complexity</div>
                <div className="text-[11px] text-slate-400">Raised by CTO David on Sept 22</div>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-3 border-b border-slate-850">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Enterprise Security Review</div>
                <div className="text-[11px] text-slate-400">Architecture checklist pending approval</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Budget vs Value Perception</div>
                <div className="text-[11px] text-slate-400">CFO requires verified ROI, not just discounts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Hindsight Memory Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History size={17} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Live Hindsight Relationship Memories
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              GET /deals/acme/memory
            </span>
          </div>

          <button
            onClick={loadMemories}
            disabled={loading}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Memories</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            Recalling memories from Hindsight bank...
          </div>
        ) : error ? (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300">
            Error loading memories: {error}
          </div>
        ) : memories.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No memories found.
          </div>
        ) : (
          <div className="space-y-2.5">
            {memories.map((m, idx) => (
              <div
                key={m.id || idx}
                className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-start justify-between gap-4 hover:border-slate-750 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                      {m.type || 'memory'}
                    </span>
                    {m.context && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {m.context}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{m.text}</p>
                  {m.tags && m.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {m.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-slate-850 text-slate-400 border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 whitespace-nowrap">
                  Hindsight Unit
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
