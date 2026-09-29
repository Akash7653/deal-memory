import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  Building2,
  FileText,
} from 'lucide-react';
import { fetchDealMemory, fetchLearnedInsights, fetchDeals, formatDisplayDate } from '../api';

export default function MemoryTimeline() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dealParam = searchParams.get('deal') || '';

  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(dealParam);
  const [liveMemories, setLiveMemories] = useState([]);
  const [learnedInsights, setLearnedInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Load available deals
  useEffect(() => {
    fetchDeals(true)
      .then((data) => {
        const list = data.deals || [];
        setDeals(list);
        if (!selectedDealId) {
          if (dealParam) {
            setSelectedDealId(dealParam);
          } else if (list.length > 0) {
            setSelectedDealId(list[0].id);
          } else {
            setSelectedDealId('acme');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch deals:', err);
        if (!selectedDealId) setSelectedDealId('acme');
      });
  }, []);

  const currentDeal = deals.find((d) => d.id === selectedDealId) || (selectedDealId === 'acme' ? { id: 'acme', company_name: 'ACME Corp', deal_value: 120000, stage: 'Evaluation' } : null);

  const loadData = async (dealIdToFetch) => {
    const targetId = dealIdToFetch || selectedDealId || 'acme';
    setLoading(true);
    try {
      const [memData, learnData] = await Promise.all([
        fetchDealMemory(targetId),
        fetchLearnedInsights(targetId).catch(() => ({ learned_insights: [] })),
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
    if (selectedDealId) {
      loadData(selectedDealId);
    }
  }, [selectedDealId]);

  const handleSelectDeal = (id) => {
    setSelectedDealId(id);
    setSearchParams(id ? { deal: id } : {});
  };

  const acmeTimelineSteps = [
    {
      step: '1. DISCOVERY',
      date: 'SEP 20, 2026',
      type: 'memory',
      category: 'Requirement Discovery',
      stakeholder: 'Sarah — VP Sales (Business Champion)',
      quote: 'ACME requires an API-first architecture to synchronize sales pipeline data across internal CRM systems.',
      tags: ['discovery', 'api-first', 'sarah'],
      badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
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
      badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
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
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
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
      badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/40',
      icon: XCircle,
      callout: 'CRITICAL TURNING POINT: Discounting failed. Commercial discussions stalled.',
    },
    {
      step: '5. HINDSIGHT REFLECTION',
      date: `TODAY (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()})`,
      type: 'reflection',
      category: 'Cognitive Reasoning',
      stakeholder: 'Hindsight Autonomous Memory Engine',
      quote: 'Price was merely a proxy for unverified ROI. The prospect is value-skeptical, not price-sensitive. Technical buy-in from CTO David is a prerequisite before CFO Michael will release budget.',
      tags: ['hindsight:reflect', 'cognitive-learning'],
      badgeClass: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
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
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      icon: Target,
    },
  ];

  // Dynamic timeline synthesis for non-ACME deals (e.g. Globex)
  const isAcme = selectedDealId === 'acme';
  let dynamicSteps = [];

  if (isAcme) {
    dynamicSteps = [...acmeTimelineSteps];
  } else {
    // Build steps from liveMemories and learnedInsights
    liveMemories.forEach((m, idx) => {
      const isOutcome = m.type === 'outcome' || m.text.toLowerCase().includes('outcome') || m.text.toLowerCase().includes('strategy outcome');
      const isFailed = m.text.toLowerCase().includes('failed') || m.text.toLowerCase().includes('rejected');
      const isSuccess = m.text.toLowerCase().includes('successful') || m.text.toLowerCase().includes('confirmed');

      // Extract stakeholder
      let stakeholder = currentDeal?.company_name || 'Prospect Stakeholder';
      if (m.text.toLowerCase().includes('rohan')) stakeholder = 'Rohan Mehta — CTO';
      else if (m.context) stakeholder = m.context;

      dynamicSteps.push({
        step: `${idx + 1}. ${isOutcome ? 'STRATEGY OUTCOME' : 'INTERACTION MEMORY'}`,
        date: formatDisplayDate(m.mentioned_at, false) || 'RECENT',
        type: isOutcome ? 'outcome' : 'memory',
        category: isOutcome ? 'Strategy Outcome' : 'Relationship Interaction',
        stakeholder: stakeholder,
        status: isFailed ? 'FAILED' : (isSuccess ? 'SUCCESSFUL' : 'RECORDED'),
        quote: m.text,
        tags: m.tags || ['hindsight-memory'],
        badgeClass: isOutcome
          ? (isSuccess ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/40')
          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
        icon: isOutcome ? (isSuccess ? CheckCircle2 : XCircle) : CheckCircle2,
      });
    });

    if (learnedInsights.length > 0) {
      dynamicSteps.push({
        step: `${dynamicSteps.length + 1}. HINDSIGHT REFLECTION`,
        date: 'AUTONOMOUS REASONING',
        type: 'reflection',
        category: 'Cognitive Reasoning',
        stakeholder: 'Hindsight Memory & Reflection Engine',
        quote: learnedInsights[0] || 'Reflected on recorded outcomes and stakeholder concerns to extract forward-looking advice.',
        tags: ['hindsight:reflect', 'cognitive-learning'],
        badgeClass: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
        icon: Sparkles,
      });

      if (learnedInsights.length > 1) {
        dynamicSteps.push({
          step: `${dynamicSteps.length + 1}. ADAPTED STRATEGY`,
          date: 'NEXT ACTION',
          type: 'recommendation',
          category: 'Prescribed Next Move',
          stakeholder: 'DealMemory Battle Plan',
          quote: learnedInsights.slice(1).join(' '),
          tags: ['action-plan', 'adapted-strategy'],
          badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          icon: Target,
        });
      }
    }
  }

  const filteredSteps = filter === 'all' ? dynamicSteps : dynamicSteps.filter((s) => s.type === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GitBranch size={16} />
              <span>Hindsight Learning Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentDeal?.company_name || 'Customer'} Relationship Memory Timeline
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Chronological relationship evolution: What happened → What failed/succeeded → What Hindsight learned.
            </p>

            {/* Account / Deal Selector */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Account / Deal:</span>
              <select
                value={selectedDealId}
                onChange={(e) => handleSelectDeal(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              >
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.company_name} {d.deal_value ? `($${d.deal_value.toLocaleString()} ARR)` : ''}
                  </option>
                ))}
                {!deals.some((d) => d.id === 'acme') && <option value="acme">ACME Corp ($120,000 ARR)</option>}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <Link
              to={`/add-interaction?deal=${selectedDealId}&customer=${encodeURIComponent(currentDeal?.company_name || '')}`}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <FileText size={14} />
              <span>Add Interaction / Outcome</span>
            </Link>
            <button
              onClick={() => loadData(selectedDealId)}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-750 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-purple-600 dark:text-purple-400' : 'text-slate-500'} />
              <span>Sync Memories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Flow: Before vs After & Core Learning */}
      <div className="grid md:grid-cols-2 gap-4">
        {isAcme ? (
          <>
            {/* Before: Failed Discount */}
            <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <XCircle size={15} />
                <span>Before: Failed Tactic</span>
              </div>
              <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">15% Price Discount → ❌ FAILED</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Rep offered a 15% discount to appease CFO Michael. Michael rejected it because lowering the price did not address unproven integration ROI or CTO David's security doubts.
              </p>
            </div>

            {/* After: Hindsight Learned */}
            <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={15} />
                <span>After: Hindsight Adaptation</span>
              </div>
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">ROI + Technical Validation → ✅ ADOPTED</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Hindsight learned that price was merely a proxy for value. The agent advises zero discounting, instead prescribing an operational ROI model for Michael and an architecture review for David.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Dynamic Custom Customer Before */}
            <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit size={15} />
                <span>Phase 1: Recorded Interaction & Objections</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">API Integration Mandate & Compliance Concerns</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {liveMemories.find((m) => !m.type?.includes('outcome'))?.text ||
                  `Recorded customer requirement for API-first architecture, migration risk mitigation, and security compliance verification.`}
              </p>
            </div>

            {/* Dynamic Custom Customer Outcome / Learning */}
            <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={15} />
                <span>Phase 2: Strategy Outcome & Reflection</span>
              </div>
              <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                {liveMemories.some((m) => m.type === 'outcome' || m.text?.toLowerCase().includes('outcome'))
                  ? 'Strategy Outcome Recorded → Hindsight Reflection Active'
                  : 'Awaiting Strategy Outcome'}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {learnedInsights[0] ||
                  (liveMemories.some((m) => m.type === 'outcome')
                    ? 'Technical validation reduced CTO concerns. Detailed security review is the next blocker before commercial discussions.'
                    : 'Record a strategy outcome to trigger Hindsight cognitive reflection and adapt the next meeting battle plan.')}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Lightweight Strategy Evolution Curve */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center space-x-2">
          <BrainCircuit size={15} />
          <span>
            Strategy Evolution Curve ({currentDeal?.company_name || 'Customer'}{' '}
            {currentDeal?.deal_value ? `$${currentDeal.deal_value.toLocaleString()}` : ''})
          </span>
        </div>

        {isAcme ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">DAY 1</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Discovery</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">API mandate</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">DAY 5</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Pricing Talks</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">CFO hesitates</div>
            </div>
            <div className="p-3 bg-rose-50/50 dark:bg-slate-950 rounded-xl border border-rose-200 dark:border-rose-900/40">
              <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">DAY 10</div>
              <div className="text-xs font-bold text-rose-950 dark:text-rose-200 mt-1">15% Discount</div>
              <div className="text-[10px] text-rose-700 dark:text-rose-400 font-bold mt-0.5">❌ FAILED</div>
            </div>
            <div className="p-3 bg-purple-50/50 dark:bg-slate-950 rounded-xl border border-purple-200 dark:border-purple-900/40">
              <div className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">REFLECTION</div>
              <div className="text-xs font-bold text-purple-950 dark:text-purple-200 mt-1">Hindsight Learn</div>
              <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-0.5">ROI gap identified</div>
            </div>
            <div className="p-3 bg-emerald-50/50 dark:bg-slate-950 rounded-xl border border-emerald-200 dark:border-emerald-900/40 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">DAY 15</div>
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 mt-1">ROI Strategy</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">Technical buy-in</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">STAGE 1: DISCOVERY</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">API & Integration</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">CTO complexity concern</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">STAGE 2: STRATEGY</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Technical Deep Dive</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                {liveMemories.some((m) => m.type === 'outcome') ? '✅ SUCCESSFUL' : 'In Progress'}
              </div>
            </div>
            <div className="p-3 bg-purple-50/50 dark:bg-slate-950 rounded-xl border border-purple-200 dark:border-purple-900/40">
              <div className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">STAGE 3: REFLECT</div>
              <div className="text-xs font-bold text-purple-950 dark:text-purple-200 mt-1">Hindsight Engine</div>
              <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-0.5">Identifies next blocker</div>
            </div>
            <div className="p-3 bg-emerald-50/50 dark:bg-slate-950 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">STAGE 4: NEXT MOVE</div>
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 mt-1">Security Review</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">Architecture validation</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400 mr-1">Filter View:</span>
          {['all', 'memory', 'outcome', 'reflection', 'recommendation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
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
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-xs ${
                ev.status === 'FAILED'
                  ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20'
                  : ev.type === 'reflection'
                  ? 'border-purple-200 dark:border-purple-900/40 bg-purple-50/20'
                  : ev.type === 'recommendation'
                  ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${ev.badgeClass}`}>
                      {ev.step}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{ev.date}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{ev.category}</span>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Stakeholder: <span className="text-slate-950 dark:text-white font-bold">{ev.stakeholder}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {ev.quote}
                  </p>

                  {ev.callout && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-slate-950 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs font-medium">
                      {ev.callout}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {ev.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300">
                  <IconComponent size={18} className={ev.status === 'FAILED' ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
