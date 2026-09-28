import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Tag,
  Shield,
  Filter,
  ArrowRight,
  Database,
  BrainCircuit,
  Target,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { fetchDealMemory, fetchLearnedInsights } from '../api';

export default function MemoryTimeline() {
  const [liveMemories, setLiveMemories] = useState([]);
  const [learnedInsights, setLearnedInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [memData, learnData] = await Promise.all([
        fetchDealMemory('acme'),
        fetchLearnedInsights('acme').catch(() => ({ learned_insights: [] })),
      ]);
      setLiveMemories(memData.memories || []);
      setLearnedInsights(learnData.learned_insights || []);
    } catch (err) {
      console.error('Timeline fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const timelineSteps = [
    {
      step: '1. DISCOVERY',
      date: 'SEP 20, 2026',
      type: 'memory',
      category: 'Requirement Discovery',
      stakeholder: 'Sarah — VP Sales (Business Champion)',
      quote: 'ACME requires an API-first architecture to synchronize sales pipeline data across internal CRM systems.',
      tags: ['discovery', 'api-first', 'sarah'],
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      icon: CheckCircle2,
    },
    {
      step: '2. TECHNICAL EVALUATION',
      date: 'SEP 22, 2026',
      type: 'memory',
      category: 'Architecture Assessment',
      stakeholder: 'David — CTO (Technical Evaluator)',
      quote: 'David expressed serious concerns regarding webhook latency, integration complexity, and enterprise security compliance.',
      tags: ['technical', 'security-blocker', 'david'],
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      icon: Shield,
    },
    {
      step: '3. COMMERCIAL PROPOSAL',
      date: 'SEP 24, 2026',
      type: 'memory',
      category: 'Budget Review',
      stakeholder: 'Michael — CFO (Financial Gatekeeper)',
      quote: 'Commercial terms reviewed. Michael stated annual pricing of $120,000 ARR exceeded their current allocation.',
      tags: ['commercial', 'budget-objection', 'michael'],
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
    },
    {
      step: '4. STRATEGY OUTCOME',
      date: 'SEP 26, 2026',
      type: 'outcome',
      category: 'Sales Strategy Result',
      stakeholder: 'Michael — CFO',
      status: 'FAILED',
      quote: 'A 15% upfront annual discount was offered to bypass budget objections. CFO Michael rejected it immediately: "The proposal lacks clear integration ROI."',
      tags: ['strategy:discount', 'outcome:unsuccessful'],
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: XCircle,
      callout: 'CRITICAL TURNING POINT: Discounting failed. Commercial discussions stalled.',
    },
    {
      step: '5. HINDSIGHT REFLECTION',
      date: 'TODAY',
      type: 'reflection',
      category: 'Cognitive Reasoning',
      stakeholder: 'Hindsight Autonomous Memory Engine',
      quote: 'Price was merely a proxy for unverified ROI. The prospect is value-skeptical, not price-sensitive. Technical buy-in from CTO David is a prerequisite before CFO Michael will release budget.',
      tags: ['hindsight:reflect', 'cognitive-learning'],
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      icon: Sparkles,
    },
    {
      step: '6. ADAPTED STRATEGY',
      date: 'NEXT ACTION',
      type: 'recommendation',
      category: 'Prescribed Next Move',
      stakeholder: 'DealMemory Battle Plan',
      quote: 'Do NOT offer another discount. Lead next meeting with an integration ROI business case for Michael and an enterprise security briefing for David.',
      tags: ['action-plan', 'roi-proof', 'no-discounting'],
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Target,
    },
  ];

  const filteredSteps = filter === 'all' ? timelineSteps : timelineSteps.filter((s) => s.type === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GitBranch size={16} />
              <span>Hindsight Learning Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ACME Corp Relationship Memory Timeline
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Chronological relationship evolution: What happened → What failed → What Hindsight learned.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs border border-slate-750 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-400' : 'text-slate-400'} />
            <span>Sync Memories</span>
          </button>
        </div>
      </div>

      {/* Visual Flow: Before vs After & Core Learning */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Before: Failed Discount */}
        <div className="bg-slate-900 border border-rose-500/30 bg-rose-500/5 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <XCircle size={15} />
            <span>Before: Failed Tactic</span>
          </div>
          <h3 className="text-base font-bold text-rose-200">15% Price Discount → ❌ FAILED</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rep offered a 15% discount to appease CFO Michael. Michael rejected it because lowering the price did not address unproven integration ROI or CTO David's security doubts.
          </p>
        </div>

        {/* After: Hindsight Learned */}
        <div className="bg-slate-900 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={15} />
            <span>After: Hindsight Adaptation</span>
          </div>
          <h3 className="text-base font-bold text-emerald-200">ROI + Technical Validation → ✅ ADOPTED</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hindsight learned that price was merely a proxy for value. The agent advises zero discounting, instead prescribing an operational ROI model for Michael and an architecture review for David.
          </p>
        </div>
      </div>

      {/* Lightweight Strategy Evolution Curve */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
          <BrainCircuit size={15} />
          <span>Strategy Evolution Curve (ACME Corp $120K)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <div className="text-[10px] text-slate-400 font-semibold">DAY 1</div>
            <div className="text-xs font-bold text-white mt-1">Discovery</div>
            <div className="text-[10px] text-slate-400 mt-0.5">API mandate</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
            <div className="text-[10px] text-slate-400 font-semibold">DAY 5</div>
            <div className="text-xs font-bold text-white mt-1">Pricing Talks</div>
            <div className="text-[10px] text-slate-400 mt-0.5">CFO hesitates</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 bg-rose-500/5">
            <div className="text-[10px] text-rose-400 font-semibold">DAY 10</div>
            <div className="text-xs font-bold text-rose-200 mt-1">15% Discount</div>
            <div className="text-[10px] text-rose-400 font-medium mt-0.5">❌ FAILED</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
            <div className="text-[10px] text-indigo-400 font-semibold">REFLECTION</div>
            <div className="text-xs font-bold text-indigo-200 mt-1">Hindsight Learn</div>
            <div className="text-[10px] text-indigo-300 mt-0.5">ROI gap identified</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 bg-emerald-500/5 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-emerald-400 font-semibold">DAY 15</div>
            <div className="text-xs font-bold text-emerald-200 mt-1">ROI Strategy</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Technical buy-in</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="text-slate-400">Filter View:</span>
          {['all', 'memory', 'outcome', 'reflection', 'recommendation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {filteredSteps.length} Timeline Milestones
        </span>
      </div>

      {/* Step by Step Timeline Cards */}
      <div className="space-y-4">
        {filteredSteps.map((ev, idx) => {
          const IconComponent = ev.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                ev.status === 'FAILED'
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : ev.type === 'reflection'
                  ? 'border-indigo-500/40 bg-indigo-500/5'
                  : ev.type === 'recommendation'
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${ev.badgeClass}`}>
                      {ev.step}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-300">{ev.date}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{ev.category}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-300">
                    Stakeholder: <span className="text-white">{ev.stakeholder}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {ev.quote}
                  </p>

                  {ev.callout && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {ev.callout}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {ev.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300">
                  <IconComponent size={18} className={ev.status === 'FAILED' ? 'text-rose-400' : 'text-indigo-400'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
