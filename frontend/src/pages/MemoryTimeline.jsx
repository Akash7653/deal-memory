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

  // Visual 4-Pillar Progression: MEMORY → OUTCOME → REFLECTION → RECOMMENDATION
  const events = [
    {
      step: '1. MEMORY',
      stepLabel: 'What Actually Happened',
      date: 'SEP 20, 2026',
      type: 'memory',
      category: 'Discovery Call',
      stakeholder: 'Sarah — VP Sales (Business Champion)',
      summary: 'ACME requires an API-first solution to streamline and synchronize sales pipeline data across internal systems.',
      tags: ['discovery', 'api-first', 'data-sync'],
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      icon: CheckCircle2,
    },
    {
      step: '2. MEMORY',
      stepLabel: 'What Actually Happened',
      date: 'SEP 22, 2026',
      type: 'memory',
      category: 'Technical Evaluation',
      stakeholder: 'David — CTO (Technical Evaluator)',
      summary: 'David joined the evaluation and expressed major concerns about integration complexity, webhook latency, and enterprise security architecture.',
      tags: ['technical', 'security', 'cto-blocker'],
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      icon: Shield,
    },
    {
      step: '3. MEMORY',
      stepLabel: 'What Actually Happened',
      date: 'SEP 24, 2026',
      type: 'memory',
      category: 'Commercial Discussion',
      stakeholder: 'Michael — CFO (Financial Gatekeeper)',
      summary: 'Commercial proposal reviewed. Michael and Sarah stated annual pricing is considered too high compared with allocated budget.',
      tags: ['pricing', 'budget-objection', 'cfo'],
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
    },
    {
      step: '4. OUTCOME',
      stepLabel: 'Strategy Attempted & Consequence',
      date: 'SEP 26, 2026',
      type: 'outcome',
      status: 'FAILED',
      category: 'Sales Strategy Result',
      stakeholder: 'Michael — CFO',
      summary: 'A 15% upfront annual discount was offered to resolve the budget objection. CFO Michael rejected it immediately: "Price is not just raw numbers; the proposal lacks clear integration ROI."',
      tags: ['strategy:discount', 'result:unsuccessful', 'cfo-rejection'],
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      icon: XCircle,
      callout: 'CRITICAL TURNING POINT: Discounting failed to move the deal forward. ACME paused commercial discussions.',
    },
    {
      step: '5. REFLECTION',
      stepLabel: 'What Hindsight Learned',
      date: 'TODAY',
      type: 'reflection',
      category: 'Hindsight Cognitive Reasoning',
      stakeholder: 'Autonomous Memory Reflection Engine',
      summary: 'Hindsight correlated the failed discount with David’s technical objections: Price is a proxy for unverified value. The client is value-skeptical, not price-sensitive.',
      tags: ['hindsight:reflect', 'cognitive-learning', 'roi-gap'],
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Sparkles,
      insights: learnedInsights.length > 0 ? learnedInsights : [
        'Shift focus from discounting to value justification by building a robust business case that quantifies integration ROI.',
        'Prioritize technical architecture by explicitly demonstrating how the solution solves integration complexity and meets security standards.',
        'Align technical capability with sales requirements by anchoring the narrative on the API-first solution.',
      ],
    },
    {
      step: '6. RECOMMENDATION',
      stepLabel: 'What the Agent Advises Next',
      date: 'NEXT ACTION',
      type: 'recommendation',
      category: 'Prescribed Meeting Strategy',
      stakeholder: 'DealMemory Agent Battle-Plan',
      summary: 'Do NOT offer another discount. Lead with an integration ROI business case for Michael and a dedicated technical security briefing for David.',
      tags: ['action-plan', 'roi-proof', 'no-discounting'],
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Target,
      actions: [
        'Present quantified integration ROI modeling operational savings for Michael.',
        'Schedule architecture review with David to address enterprise security checklists.',
        'Demonstrate Sarah’s API-first pipeline streamlining live to connect business & technical goals.',
      ],
    },
  ];

  const filteredEvents =
    filter === 'all' ? events : events.filter((ev) => ev.type === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitBranch size={15} />
            <span>The Memory Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ACME Relationship Timeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Visualizing the complete intelligence loop:{' '}
            <span className="text-sky-400 font-semibold">Memory</span> →{' '}
            <span className="text-rose-400 font-semibold">Outcome</span> →{' '}
            <span className="text-purple-400 font-semibold">Reflection</span> →{' '}
            <span className="text-emerald-400 font-semibold">Recommendation</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Sync Hindsight</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-850 pb-4">
        <span className="text-xs text-slate-400 flex items-center space-x-1 mr-2">
          <Filter size={13} />
          <span>Stage:</span>
        </span>
        {[
          { key: 'all', label: 'Complete Story (6)' },
          { key: 'memory', label: '1. Memory (3)' },
          { key: 'outcome', label: '2. Failed Outcome (1)' },
          { key: 'reflection', label: '3. Hindsight Reflection (1)' },
          { key: 'recommendation', label: '4. Action (1)' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === f.key
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 via-rose-500 via-purple-500 to-emerald-500">
        {filteredEvents.map((event, index) => {
          const Icon = event.icon;
          const isOutcome = event.type === 'outcome';
          const isReflection = event.type === 'reflection';
          const isRecommendation = event.type === 'recommendation';

          return (
            <div key={index} className="relative group">
              {/* Timeline Node Badge */}
              <div
                className={`absolute -left-[30px] sm:-left-[35px] top-2 w-7 h-7 rounded-full flex items-center justify-center border shadow-lg ${
                  isOutcome
                    ? 'bg-rose-600 text-white border-rose-400 shadow-rose-600/40'
                    : isReflection
                    ? 'bg-purple-600 text-white border-purple-400 shadow-purple-600/40'
                    : isRecommendation
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/40'
                    : 'bg-slate-900 text-sky-400 border-sky-500/40 shadow-sky-500/20'
                }`}
              >
                <Icon size={14} />
              </div>

              {/* Event Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isOutcome
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border-rose-500/50 shadow-xl'
                    : isReflection
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border-purple-500/50 shadow-xl'
                    : isRecommendation
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/50 shadow-xl'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-750'
                }`}
              >
                {/* Step Subheader & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[11px] font-bold font-mono text-slate-400">
                      {event.date}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${event.badgeClass}`}
                    >
                      {event.step}: {event.category}
                    </span>
                    {event.status === 'FAILED' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/25 text-rose-300 border border-rose-500/40 animate-pulse">
                        FAILED
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    {event.stakeholder}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {event.summary}
                  </p>

                  {/* Prominent Failed Outcome Callout */}
                  {isOutcome && event.callout && (
                    <div className="bg-rose-950/30 border border-rose-500/40 p-3 rounded-xl text-xs text-rose-200 font-semibold flex items-center space-x-2">
                      <AlertTriangle size={15} className="text-rose-400 flex-shrink-0" />
                      <span>{event.callout}</span>
                    </div>
                  )}

                  {/* Autonomous Reflection Insights */}
                  {isReflection && event.insights && (
                    <div className="bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5 uppercase tracking-wider">
                        <Sparkles size={13} />
                        <span>Hindsight Autonomous Reflection Insights:</span>
                      </div>
                      <ul className="space-y-1.5">
                        {event.insights.map((insight, iIdx) => (
                          <li
                            key={iIdx}
                            className="text-xs text-slate-200 flex items-start space-x-2"
                          >
                            <span className="text-purple-400 font-bold">•</span>
                            <span className="leading-relaxed">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Action Checklist */}
                  {isRecommendation && event.actions && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 uppercase tracking-wider">
                        <CheckCircle2 size={13} />
                        <span>Prescribed Next Meeting Battle-Plan:</span>
                      </div>
                      <div className="space-y-1.5">
                        {event.actions.map((act, aIdx) => (
                          <div
                            key={aIdx}
                            className="text-xs text-slate-200 flex items-start space-x-2"
                          >
                            <span className="text-emerald-400 font-bold">{aIdx + 1}.</span>
                            <span className="leading-relaxed">{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standardized Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {event.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-850 text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
