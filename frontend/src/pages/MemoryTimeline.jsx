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
  const [dealsLoaded, setDealsLoaded] = useState(false);
  const [filter, setFilter] = useState('all');

  // Load available deals
  useEffect(() => {
    fetchDeals(true)
      .then((data) => {
        const list = data.deals || [];
        setDeals(list);
        setDealsLoaded(true);
        if (dealParam && list.some((d) => d.id === dealParam)) {
          setSelectedDealId(dealParam);
        } else if (list.length > 0 && !selectedDealId) {
          setSelectedDealId(list[0].id);
        } else if (list.length === 0) {
          setSelectedDealId('');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch deals:', err);
        setDealsLoaded(true);
        setLoading(false);
      });
  }, []);

  // Synchronize selectedDealId with route search param
  useEffect(() => {
    if (dealParam && dealParam !== selectedDealId && deals.some((d) => d.id === dealParam)) {
      setSelectedDealId(dealParam);
    }
  }, [dealParam, deals]);

  const currentDeal = deals.find((d) => d.id === selectedDealId);

  const loadData = async (dealIdToFetch) => {
    const targetId = dealIdToFetch || selectedDealId;
    if (!targetId) {
      setLoading(false);
      setLiveMemories([]);
      setLearnedInsights([]);
      return;
    }
    setLoading(true);
    try {
      const [memData, learnData] = await Promise.all([
        fetchDealMemory(targetId).catch(() => ({ memories: [] })),
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
    if (selectedDealId && currentDeal) {
      loadData(selectedDealId);
    } else if (dealsLoaded && (!selectedDealId || !currentDeal)) {
      setLoading(false);
    }
  }, [selectedDealId, currentDeal, dealsLoaded]);

  const handleSelectDeal = (id) => {
    setSelectedDealId(id);
    setSearchParams(id ? { deal: id } : {});
  };

  // Case 1: Company has zero deals
  if (dealsLoaded && deals.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 animate-fade-in my-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
          <GitBranch size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            No Active Deals Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your company workspace does not have any active deals yet. Create a deal to begin tracking customer interactions, relationship timelines, and cognitive Hindsight learning.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link
            to="/deal"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95 flex items-center space-x-2"
          >
            <Building2 size={15} />
            <span>Create First Deal</span>
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-750 text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Deal query parameter is provided, but deal does not exist or belongs to another company
  if (dealsLoaded && deals.length > 0 && selectedDealId && !currentDeal) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 animate-fade-in my-8">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Deal Not Found or Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The deal <code className="font-mono text-purple-600 dark:text-purple-400">{selectedDealId}</code> does not exist or is not authorized for your company workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => handleSelectDeal(deals[0].id)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95"
          >
            View {deals[0].company_name}
          </button>
          <Link
            to="/deal"
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-750 text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            All Deals Overview
          </Link>
        </div>
      </div>
    );
  }

  const isAcme = selectedDealId === 'acme' && deals.some((d) => d.id === 'acme');
  let dynamicSteps = [];

  // Build steps dynamically from liveMemories and learnedInsights for all deals
  liveMemories.forEach((m, idx) => {
    const isOutcome = m.type === 'outcome' || m.text.toLowerCase().includes('outcome') || m.text.toLowerCase().includes('strategy outcome');
    const isFailed = m.text.toLowerCase().includes('failed') || m.text.toLowerCase().includes('rejected') || m.text.toLowerCase().includes('pause');
    const isSuccess = m.text.toLowerCase().includes('successful') || m.text.toLowerCase().includes('confirmed') || m.text.toLowerCase().includes('progress');

    // Extract stakeholder
    let stakeholder = currentDeal?.company_name || 'Prospect Stakeholder';
    if (m.text.toLowerCase().includes('rohan')) stakeholder = 'Rohan Mehta — CTO';
    else if (m.text.toLowerCase().includes('sarah')) stakeholder = 'Sarah — VP Sales';
    else if (m.text.toLowerCase().includes('david')) stakeholder = 'David — CTO';
    else if (m.text.toLowerCase().includes('michael')) stakeholder = 'Michael — CFO';
    else if (m.text.toLowerCase().includes('marcus')) stakeholder = 'Marcus Vance — VP Operations';
    else if (m.text.toLowerCase().includes('elena')) stakeholder = 'Elena Rostova — Procurement';
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
        {isAcme && liveMemories.length > 0 ? (
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
        ) : liveMemories.length > 0 ? (
          <>
            {/* Dynamic Custom Customer Before */}
            <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit size={15} />
                <span>Phase 1: Recorded Interaction & Objections</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Mandate & Objections</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {liveMemories.find((m) => !m.type?.includes('outcome'))?.text ||
                  `Recorded customer requirement for architecture validation and risk mitigation.`}
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
                    ? 'Strategy outcome recorded in Hindsight bank.'
                    : 'Record a strategy outcome to trigger Hindsight cognitive reflection and adapt the next meeting battle plan.')}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit size={15} />
                <span>Phase 1: Customer Discovery</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Awaiting Initial Discovery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No customer interactions recorded yet. Log the first meeting or call to retain key stakeholder priorities.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={15} />
                <span>Phase 2: Strategy Outcomes</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Awaiting Strategy Outcomes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Record proposals, negotiations, and pauses to trigger automated learning reflection.
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
        {filteredSteps.length > 0 ? (
          filteredSteps.map((ev, idx) => {
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
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <BrainCircuit size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">0 Timeline Milestones</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                No relationship history has been recorded for this deal yet. Record your first customer interaction to begin building persistent Hindsight memory.
              </p>
            </div>
            {selectedDealId && (
              <div className="pt-2">
                <Link
                  to={`/add-interaction?deal=${selectedDealId}&customer=${encodeURIComponent(currentDeal?.company_name || '')}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <FileText size={14} />
                  <span>Record First Interaction</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
