import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Building2,
  ChevronDown,
} from 'lucide-react';
import { fetchMeetingPrep, fetchDeals } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MeetingPrep() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const dealParam = searchParams.get('deal');

  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDemo =
    user?.company_id === 'comp_technova' ||
    user?.company_id === 'technova' ||
    user?.email === 'demo@dealmemory.ai';

  const loadPrep = async (dealId) => {
    if (!dealId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMeetingPrep(dealId);
      setPrepData(data);
    } catch (err) {
      setError(err.message || 'Failed to synthesize meeting briefing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const dealsRes = await fetchDeals(true).catch(() => ({ deals: [] }));
        const userDeals = dealsRes?.deals || [];
        setDeals(userDeals);

        let activeId = '';
        if (dealParam && userDeals.some((d) => d.id === dealParam)) {
          activeId = dealParam;
        } else if (isDemo || userDeals.some((d) => d.id === 'acme')) {
          activeId = 'acme';
        } else if (userDeals.length > 0) {
          activeId = userDeals[0].id;
        }

        setSelectedDealId(activeId);
        if (activeId) {
          await loadPrep(activeId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    init();
  }, [dealParam, isDemo]);

  const handleDealChange = (dealId) => {
    setSelectedDealId(dealId);
    setSearchParams({ deal: dealId });
    loadPrep(dealId);
  };

  const activeDealObj = deals.find((d) => d.id === selectedDealId);

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-fade-in">
      {/* Executive Briefing Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarCheck2 size={16} />
              <span>Executive Meeting Briefing</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                NEXT MEETING: {prepData?.company || activeDealObj?.company_name || (selectedDealId === 'acme' ? 'ACME Corp' : 'Deal Briefing')}
              </h1>
              {(activeDealObj?.deal_value || selectedDealId === 'acme') && (
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  ${(activeDealObj?.deal_value || 120000).toLocaleString()} ARR
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Generated dynamically from Hindsight relationship memory & past strategy outcomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {deals.length > 1 && (
              <select
                value={selectedDealId}
                onChange={(e) => handleDealChange(e.target.value)}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.company_name}
                  </option>
                ))}
              </select>
            )}

            {selectedDealId && (
              <button
                onClick={() => loadPrep(selectedDealId)}
                disabled={loading}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-750 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin text-purple-600 dark:text-purple-400' : 'text-slate-500'} />
                <span>Regenerate Brief</span>
              </button>
            )}

            <Link
              to="/agent"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Bot size={15} />
              <span>Ask Agent</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <Sparkles size={24} className="mx-auto text-purple-600 dark:text-purple-400 animate-spin" />
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
          {selectedDealId && (
            <button
              onClick={() => loadPrep(selectedDealId)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold mt-2 cursor-pointer shadow-xs"
            >
              Retry
            </button>
          )}
        </div>
      ) : !selectedDealId ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Building2 size={24} />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Active Deals Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Create your first enterprise deal on the dashboard to generate AI executive meeting briefings and strategic counter-tactics.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/20"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. WHAT CHANGED */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center space-x-1.5">
                <Layers size={15} />
                <span>1. What Changed in the Deal</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Account Dynamics</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {prepData?.relationship_summary || 'No recent relationship dynamics recorded yet.'}
            </p>

            {prepData?.stakeholders && prepData.stakeholders.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                {prepData.stakeholders.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-purple-50/50 dark:bg-slate-950 rounded-xl border border-purple-200 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {s.name} {s.role ? `— ${s.role}` : ''}
                    </div>
                    {s.notes && <p className="text-[11px] text-slate-600 dark:text-slate-400">{s.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. WHAT WE LEARNED & WHAT TO AVOID */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* What We Learned */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-850">
                <Lightbulb size={15} />
                <span>2. What Hindsight Learned</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                {prepData?.learned_insights && prepData.learned_insights.length > 0 ? (
                  prepData.learned_insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 dark:text-slate-400">
                    No strategic insights extracted yet. Record deal interactions and outcome reflections.
                  </li>
                )}
              </ul>
            </div>

            {/* What To Avoid */}
            <div className="bg-rose-50/50 dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-rose-200 dark:border-rose-500/20">
                <XCircle size={15} />
                <span>3. What To Avoid</span>
              </div>
              <ul className="space-y-2.5 text-xs text-rose-900 dark:text-rose-200">
                {prepData?.avoid_repeating && prepData.avoid_repeating.length > 0 ? (
                  prepData.avoid_repeating.map((avoid, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                      <span>{avoid}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 dark:text-slate-400">
                    No negative patterns detected. Avoid unverified pricing concessions without executive alignment.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 4. WHAT TO SAY & RECOMMENDED STRATEGY */}
          <div className="bg-emerald-50/40 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center space-x-1.5">
                <Target size={16} />
                <span>4. Recommended Strategy & Action Items</span>
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">Execution Plan</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {prepData?.recommended_focus && prepData.recommended_focus.length > 0 ? (
                prepData.recommended_focus.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <MessageSquare size={13} className="text-purple-600 dark:text-purple-400" />
                      <span>Focus Item {idx + 1}:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{rec}</p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  Continue discovery with customer champions to uncover underlying buying criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
