import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
  Building2,
  PlusCircle,
  Clock,
  BrainCircuit,
  Bot,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { fetchDealMemory, fetchDeals, createDeal, fetchAgentState, fetchDashboardStats } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [agentState, setAgentState] = useState(null);
  const [stats, setStats] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDealValue, setNewDealValue] = useState(75000);
  const [creatingDeal, setCreatingDeal] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [stateData, dealsData, statsData] = await Promise.all([
        fetchAgentState().catch(() => null),
        fetchDeals(true).catch(() => ({ deals: [] })),
        fetchDashboardStats().catch(() => null),
      ]);
      if (stateData) setAgentState(stateData);
      if (dealsData && dealsData.deals) setDeals(dealsData.deals);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setCreatingDeal(true);
    try {
      await createDeal({
        company_name: newCompanyName.trim(),
        deal_value: parseInt(newDealValue) || 50000,
        stage: 'Discovery',
        relationship_health: 0,
      });
      setShowCreateDealModal(false);
      setNewCompanyName('');
      await loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to create deal');
    } finally {
      setCreatingDeal(false);
    }
  };

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const totalPipeline = stats?.pipeline_value != null ? stats.pipeline_value : deals.reduce((acc, d) => acc + (d.deal_value || 0), 0);
  const activeDealsCount = stats?.active_deals_count != null ? stats.active_deals_count : deals.length;
  const evaluationCount = stats?.evaluation_deals_count != null ? stats.evaluation_deals_count : deals.filter((d) => d.stage === 'Evaluation').length;
  const memoryCount = stats?.memories_count ?? agentState?.metrics?.memories_count ?? 0;
  const learnedInsightsCount = stats?.learned_insights_count ?? agentState?.metrics?.learned_insights_count ?? 0;
  const needsAttention = stats?.needs_attention || {
    count: 0,
    deal_name: null,
    reason: activeDealsCount > 0 ? 'All pipeline deals on track' : 'No urgent relationship risks detected.',
    deal_id: null,
  };
  const priorityDeals = stats?.priority_deals || [];
  const continuousLoop = stats?.continuous_loop || {
    remember: 'Hindsight retains key stakeholder mandates, objections, and hidden priorities.',
    outcome: 'Every proposal, pricing negotiation, or pause is logged as a ground-truth outcome.',
    learn: 'Hindsight extracts why deals stall and detects underlying buyer patterns.',
    adapt: 'AI agent prescribes actionable counter-strategies before every executive meeting.',
    deal_context: user?.company_name || 'Continuous Loop',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-7 animate-fade-in">
      {/* Header Profile with dynamic greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name || 'Sales Leader'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Welcome to the {user?.company_name || 'enterprise'} DealMemory workspace.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowCreateDealModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle size={15} />
            <span>New Deal</span>
          </button>
          <Link
            to="/history"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-medium transition-all active:scale-95 shadow-2xs"
          >
            <Clock size={15} />
            <span>Activity History</span>
          </Link>
        </div>
      </div>

      {/* Metrics Strip - 4 Summary Cards with Subtle Theme-Aware Gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Pipeline Value - Subtle Violet Gradient */}
        <div className="bg-gradient-to-br from-white via-white to-purple-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[126px] sm:min-h-[136px] shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <span className="truncate">Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${totalPipeline.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center space-x-1 truncate">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Active ARR</span>
              <span>across {activeDealsCount} deal{activeDealsCount === 1 ? '' : 's'}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Deals - Subtle Slate Gradient */}
        <div className="bg-gradient-to-br from-white via-white to-slate-100/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[126px] sm:min-h-[136px] shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <span className="truncate">Active Deals</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeDealsCount}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 truncate">
              <span>{evaluationCount} in Evaluation stage</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Needs Attention - Subtle Amber Gradient */}
        <div className="bg-gradient-to-br from-white via-white to-amber-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 border border-amber-300/80 dark:border-amber-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[126px] sm:min-h-[136px] shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-bold">
            <span className="truncate">Needs Attention</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-200 tracking-tight">
              {needsAttention.count} {needsAttention.count === 1 ? 'Deal' : 'Deals'}
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-1 font-semibold truncate">
              <span>{needsAttention.deal_name ? `${needsAttention.deal_name} • ${needsAttention.reason}` : needsAttention.reason}</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Learned Insights - Subtle Emerald Gradient */}
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 border border-emerald-300/80 dark:border-emerald-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[126px] sm:min-h-[136px] shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <span className="truncate">Learned Insights</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200 tracking-tight">
              {learnedInsightsCount} {learnedInsightsCount === 1 ? 'Insight' : 'Insights'}
            </div>
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300/90 mt-1 font-semibold truncate">
              <span>{memoryCount > 0 ? `${memoryCount} memories in Hindsight bank` : 'No learned patterns yet.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Deals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Shield size={16} className="text-purple-600 dark:text-purple-400" />
            <span>Priority Deals Requiring Action</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Grounded in Hindsight relationship memory</span>
        </div>

        {/* Priority Deals Rendered Dynamically from Current Authenticated Company */}
        {priorityDeals.map((pDeal) => (
          <div
            key={pDeal.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center font-black text-white text-base shadow-sm flex-shrink-0">
                    {pDeal.short_name || (pDeal.company_name || 'DL').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {pDeal.company_name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 font-semibold">
                        {pDeal.stage}
                      </span>
                      {pDeal.relationship_health > 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
                          {pDeal.relationship_health}% Health
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold">
                          0% Health (Unscored)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                      ${(pDeal.deal_value || 0).toLocaleString()} ARR • Key Champion: {pDeal.champion} • Blocker: {pDeal.blocker}
                    </div>
                  </div>
                </div>

                {/* Risk & Next Action Badges */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-slate-950 border border-rose-200 dark:border-rose-900/40 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center space-x-1.5">
                      <AlertTriangle size={12} />
                      <span>Current Risk</span>
                    </div>
                    <div className="text-xs font-bold text-rose-950 dark:text-slate-200">
                      {pDeal.current_risk_title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pDeal.current_risk_desc}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-950 border border-purple-200 dark:border-purple-900/40 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center space-x-1.5">
                      <CheckCircle2 size={12} />
                      <span>Prescribed Next Action</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {pDeal.next_action_title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pDeal.next_action_desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons for the Deal */}
              <div className="flex lg:flex-col items-center gap-2 self-start lg:self-auto flex-shrink-0">
                <Link
                  to={`/deal?deal=${pDeal.id}`}
                  className="w-full text-center px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <span>Deal Overview</span>
                  <ChevronRight size={14} />
                </Link>
                <Link
                  to={`/meeting-prep?deal=${pDeal.id}`}
                  className="w-full text-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
                  <span>Prepare Brief</span>
                </Link>
                <Link
                  to={`/agent?deal=${pDeal.id}`}
                  className="w-full text-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Bot size={13} className="text-purple-600 dark:text-purple-400" />
                  <span>Ask Agent</span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Clean zero-state for companies with 0 deals */}
        {priorityDeals.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <Building2 size={24} />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No deals recorded in {user?.company_name || 'your company'} yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Create your first enterprise deal or log client interactions to begin populating your company's isolated Hindsight memory bank.
              </p>
            </div>
            <button
              onClick={() => setShowCreateDealModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle size={15} />
              <span>Create First Deal</span>
            </button>
          </div>
        )}
      </div>

      {/* The Hindsight Intelligence Loop Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            <BrainCircuit size={15} />
            <span>The Continuous Relationship Intelligence Loop</span>
          </div>
          <Link to="/timeline" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold flex items-center space-x-1">
            <span>Explore Timeline</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
            <div className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase">1. Remember</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              {continuousLoop.remember}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-slate-950 border border-rose-200 dark:border-rose-500/20">
            <div className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">2. Outcome</div>
            <p className="text-xs text-rose-900 dark:text-rose-200 mt-0.5 font-medium">
              {continuousLoop.outcome}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-slate-950 border border-purple-200 dark:border-purple-500/20">
            <div className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase">3. Learn</div>
            <p className="text-xs text-purple-900 dark:text-purple-200 mt-0.5 font-medium">
              {continuousLoop.learn}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-500/20">
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">4. Adapt</div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 mt-0.5 font-medium">
              {continuousLoop.adapt}
            </p>
          </div>
        </div>
      </div>

      {/* Create New Deal Modal with Light/Dark Mode */}
      {showCreateDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Building2 size={18} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Enterprise Deal</h3>
              </div>
              <button
                onClick={() => setShowCreateDealModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snowflake, Datadog"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Annual Contract Value (ARR in USD)
                </label>
                <input
                  type="number"
                  required
                  min="5000"
                  step="5000"
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateDealModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDeal}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {creatingDeal ? 'Creating...' : 'Initialize Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
