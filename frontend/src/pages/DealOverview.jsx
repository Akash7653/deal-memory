import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  FileText,
} from 'lucide-react';
import { fetchDealMemory, fetchDeals, fetchDealIntelligence, formatDisplayDate } from '../api';
import { useAuth } from '../context/AuthContext';

export default function DealOverview() {
  const { user, company } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const dealParam = searchParams.get('deal') || '';

  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(dealParam);
  const [memories, setMemories] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeals(true)
      .then((data) => {
        const list = data.deals || [];
        setDeals(list);
        if (!selectedDealId) {
          if (dealParam && list.some((d) => d.id === dealParam)) {
            setSelectedDealId(dealParam);
          } else if (list.length > 0) {
            setSelectedDealId(list[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load deals in Overview:', err);
      });
  }, []);

  const currentDeal = deals.find((d) => d.id === selectedDealId);

  const loadDealData = async (targetId) => {
    if (!targetId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [memData, intelData] = await Promise.all([
        fetchDealMemory(targetId).catch(() => ({ memories: [] })),
        fetchDealIntelligence(targetId).catch(() => null),
      ]);
      setMemories(memData?.memories || []);
      setIntelligence(intelData);
    } catch (err) {
      setError(err.message || 'Failed to load deal intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDealId) {
      loadDealData(selectedDealId);
    }
  }, [selectedDealId]);

  const handleSelectDeal = (id) => {
    setSelectedDealId(id);
    setSearchParams(id ? { deal: id } : {});
  };

  const dealTitle = currentDeal?.company_name || intelligence?.company_name || 'Customer Deal';
  const dealValue = currentDeal?.deal_value
    ? `$${currentDeal.deal_value.toLocaleString()} ARR`
    : intelligence?.deal_value
    ? `$${intelligence.deal_value.toLocaleString()} ARR`
    : '$0 ARR';
  const dealStage = currentDeal?.stage || intelligence?.stage || 'Discovery';
  const dealInitials = dealTitle.slice(0, 2).toUpperCase();

  const healthScore = intelligence?.relationship_health ?? currentDeal?.relationship_health ?? 0;
  const isUnscored = healthScore === 0;
  const healthDisplay = isUnscored ? '0%' : `${healthScore}%`;
  const effectiveBankId = company?.id || user?.company_id || (user?.email && user.email.includes('@') ? user.email.split('@')[0] : 'bank');
  const memoryBankName = `dealmemory-${effectiveBankId}`;

  const stakeholders = intelligence?.stakeholders || [];
  const risks = intelligence?.risks || [];
  const winningStrategy = intelligence?.winning_strategy || {
    title: 'Formulate Value-Driven Engagement',
    description: 'Record customer interactions and outcomes to synthesize deal-specific winning strategies.',
  };
  const strategyToAvoid = intelligence?.strategy_to_avoid || {
    title: 'Avoid Premature Concessions',
    description: 'Ensure all customer requirements and technical doubts are validated before commercial terms.',
  };
  const nextAction = intelligence?.next_action || {
    title: 'Next Step',
    subtitle: 'Log interaction or schedule technical review',
  };

  if (!loading && deals.length === 0 && !selectedDealId) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <Building2 className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Deals in Workspace</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Create an enterprise deal to begin tracking relationship intelligence and memory.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Enterprise Header - Deal Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company identity & Deal metrics */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center font-black text-lg sm:text-xl text-white shadow-md shadow-purple-600/25 flex-shrink-0">
              {dealInitials}
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                  {dealTitle}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold">
                  {dealStage}
                </span>
              </div>

              {/* Deal value & metadata */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">{dealValue}</span>
                <span>•</span>
                <span>Enterprise Deal</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Memory Bank: <code className="text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-900/40">{memoryBankName}</code></span>
              </div>

              {/* Deal Selector Dropdown - Strict Tenant Deals */}
              <div className="mt-2 flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Switch Deal:</span>
                <select
                  value={selectedDealId}
                  onChange={(e) => handleSelectDeal(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                >
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.company_name} {d.deal_value ? `($${d.deal_value.toLocaleString()} ARR)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Relationship Health & Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            {/* Relationship Health Indicator */}
            <div className={`px-4 py-2.5 rounded-xl border flex items-center justify-between sm:justify-start space-x-3 shadow-2xs ${
              isUnscored
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : healthScore >= 70
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                : healthScore >= 40
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
            }`}>
              <div className="text-left">
                <div className={`text-[10px] font-bold uppercase tracking-wider ${
                  isUnscored
                    ? 'text-slate-500 dark:text-slate-400'
                    : healthScore >= 70
                    ? 'text-emerald-800 dark:text-emerald-400'
                    : healthScore >= 40
                    ? 'text-amber-800 dark:text-amber-400'
                    : 'text-rose-800 dark:text-rose-400'
                }`}>
                  Relationship Health
                </div>
                <div className={`text-lg sm:text-xl font-black leading-tight ${
                  isUnscored
                    ? 'text-slate-700 dark:text-slate-300'
                    : healthScore >= 70
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : healthScore >= 40
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-rose-700 dark:text-rose-300'
                }`}>
                  {isUnscored ? '0% (Unscored)' : healthDisplay}
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                isUnscored
                  ? 'bg-slate-400'
                  : healthScore >= 70
                  ? 'bg-emerald-500 animate-pulse'
                  : healthScore >= 40
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500 animate-pulse'
              }`} />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <Link
                to={`/meeting-prep?deal=${selectedDealId}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Sparkles size={14} />
                <span>Prepare Meeting</span>
              </Link>
              <Link
                to={`/agent?deal=${selectedDealId}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-750 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Bot size={14} className="text-purple-600 dark:text-purple-400" />
                <span>Ask Agent</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Snapshot Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Stage</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{dealStage}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Current Phase</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Value</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{dealValue}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Annual Contract</div>
        </div>
        <div className={`border rounded-xl p-3.5 space-y-1 shadow-2xs ${
          isUnscored
            ? 'bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            : healthScore >= 70
            ? 'bg-emerald-50/40 dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60'
            : 'bg-amber-50/40 dark:bg-slate-900 border-amber-200 dark:border-amber-800/60'
        }`}>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Health Score</div>
          <div className={`text-sm font-bold ${
            isUnscored
              ? 'text-slate-700 dark:text-slate-300'
              : healthScore >= 70
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400'
          }`}>
            {isUnscored ? '0% (No Learnings)' : healthDisplay}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {stakeholders.length > 0 ? `${stakeholders.length} Champion${stakeholders.length > 1 ? 's' : ''} Tracked` : 'No Champion Tracked Yet'}
          </div>
        </div>
        <div className="bg-purple-50/40 dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-purple-800 dark:text-purple-400 uppercase">Last Interaction</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {memories.length > 0 && memories[0].mentioned_at
              ? formatDisplayDate(memories[0].mentioned_at, false)
              : intelligence?.last_interaction?.date
              ? formatDisplayDate(intelligence.last_interaction.date, false)
              : 'Recent Activity'}
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium truncate">
            {memories.length > 0 ? (memories[0].type || 'Interaction Recorded') : (intelligence?.last_interaction?.type || 'Recent Activity')}
          </div>
        </div>
        <div className="bg-purple-50/50 dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 uppercase">Next Action</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{nextAction.title}</div>
          <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium truncate">{nextAction.subtitle}</div>
        </div>
      </div>

      {/* Strategies: Current Winning Strategy vs Strategy To Avoid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recommended Strategy */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Current Winning Strategy</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{winningStrategy.title}</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {winningStrategy.description}
          </p>
        </div>

        {/* Strategy to Avoid */}
        <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <XCircle size={16} />
            <span>Strategy To Avoid</span>
          </div>
          <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">{strategyToAvoid.title}</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {strategyToAvoid.description}
          </p>
        </div>
      </div>

      {/* Account Stakeholder Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users size={16} className="text-purple-600 dark:text-purple-400" />
            <span>Stakeholders & Account Map</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {stakeholders.length} Stakeholder{stakeholders.length === 1 ? '' : 's'} Retained in Hindsight
          </span>
        </div>

        {stakeholders.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {stakeholders.map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm border border-purple-200 dark:border-purple-800/60">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{s.role}</div>
                  </div>
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold pt-1">
                  {s.category}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.notes}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Not recorded: No specific stakeholders identified for this deal yet. Record an interaction to capture key stakeholders.
          </div>
        )}
      </div>

      {/* Deal Risk Radar Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Shield size={16} />
            <span>Deal Risk Radar</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Real Stored Intelligence</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {risks.map((r, i) => {
            const isHigh = r.level === 'High';
            const isMed = r.level === 'Medium';
            const isStrong = r.level === 'Strong';
            const cardBg = isHigh
              ? 'bg-rose-50/50 dark:bg-slate-950 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'
              : isMed
              ? 'bg-amber-50/50 dark:bg-slate-950 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
              : isStrong
              ? 'bg-emerald-50/50 dark:bg-slate-950 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';

            return (
              <div key={i} className={`p-3 rounded-xl border space-y-1 ${cardBg}`}>
                <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">{r.category}</div>
                <div className="text-sm font-bold">{r.level}</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{r.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Biggest Risk:</span>{' '}
            <span className="text-slate-700 dark:text-slate-300">{intelligence?.biggest_risk || 'None recorded'}</span>
          </div>
          <div className="text-purple-600 dark:text-purple-400 font-semibold flex items-center space-x-1.5 flex-shrink-0">
            <span>Recommended Action:</span>
            <Link to={`/meeting-prep?deal=${selectedDealId}`} className="underline hover:text-purple-700 dark:hover:text-purple-300">
              {nextAction.subtitle || 'Schedule briefing'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
