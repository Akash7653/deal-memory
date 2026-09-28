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
import { fetchDealMemory, fetchDeals, createDeal } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [memoryCount, setMemoryCount] = useState(15);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDealValue, setNewDealValue] = useState(75000);
  const [creatingDeal, setCreatingDeal] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [memData, dealsData] = await Promise.all([
        fetchDealMemory('acme').catch(() => ({ count: 15 })),
        fetchDeals(true).catch(() => ({ deals: [] })),
      ]);
      if (memData && memData.count) setMemoryCount(memData.count);
      if (dealsData && dealsData.deals) setDeals(dealsData.deals);
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
        relationship_health: 80,
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

  const totalPipeline = deals.reduce((acc, d) => acc + (d.deal_value || 0), 0) || 120000;
  const activeDealsCount = deals.length || 1;
  const dealsNeedingAttention = 1; // ACME has failed discount strategy needing ROI shift
  const learnedInsightsCount = 5;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-7 animate-fade-in">
      {/* Header Profile with dynamic greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {getGreeting()}, {user?.name || 'Sales Leader'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what needs your attention today.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowCreateDealModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>New Deal</span>
          </button>
          <Link
            to="/history"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Clock size={15} />
            <span>Activity History</span>
          </Link>
        </div>
      </div>

      {/* Metrics Strip - Refined Visual Hierarchy, Not Clumsy Giant Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Pipeline Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pipeline Value</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ${totalPipeline.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
              <span className="text-emerald-400 font-medium">Active ARR</span>
              <span>across enterprise deals</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Deals */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Deals</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeDealsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              <span>{deals.filter((d) => d.stage === 'Evaluation').length || 1} in Evaluation stage</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Deals Needing Attention */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm bg-amber-500/5">
          <div className="flex items-center justify-between text-amber-300 text-xs font-medium">
            <span>Needs Attention</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight">
              {dealsNeedingAttention} Deal
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">
              <span>ACME Corp • Stalled on ROI</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Learned Insights */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm bg-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Learned Insights</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lightbulb size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-emerald-200 tracking-tight">
              {learnedInsightsCount} Insights
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">
              <span>Hindsight outcome reflection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Deals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Shield size={16} className="text-indigo-400" />
            <span>Priority Deals Requiring Action</span>
          </h2>
          <span className="text-xs text-slate-400">Grounded in Hindsight relationship memory</span>
        </div>

        {/* ACME Corp Flagship Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-sm">
                  AC
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-lg font-bold text-white">ACME Corp</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                      Evaluation
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      78% Health
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    $120,000 ARR • Key Champion: Sarah (VP Sales) • Blocker: David (CTO)
                  </div>
                </div>
              </div>

              {/* Risk & Next Action Badges */}
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                    <AlertTriangle size={12} />
                    <span>Current Risk</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200">Integration Complexity & Security</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    David (CTO) paused talks after failed 15% discount; requires proof of enterprise API architecture.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 bg-indigo-500/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                    <CheckCircle2 size={12} />
                    <span>Prescribed Next Action</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Prove Integration ROI • Do NOT Discount</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Lead next meeting with operational savings modeling for CFO Michael and architecture briefing for David.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons for the Deal */}
            <div className="flex lg:flex-col items-center gap-2 self-start lg:self-auto flex-shrink-0">
              <Link
                to="/deal"
                className="w-full text-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Deal Overview</span>
                <ChevronRight size={14} />
              </Link>
              <Link
                to="/meeting-prep"
                className="w-full text-center px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles size={13} className="text-indigo-400" />
                <span>Prepare Brief</span>
              </Link>
              <Link
                to="/agent"
                className="w-full text-center px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 text-xs font-medium transition-all flex items-center justify-center space-x-1.5"
              >
                <Bot size={13} className="text-indigo-600 dark:text-indigo-400" />
                <span>Ask Agent</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Any custom deals created by user */}
        {deals.filter((d) => d.id !== 'acme').map((deal) => (
          <div
            key={deal.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                {deal.company_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">{deal.company_name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {deal.stage}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ${(deal.deal_value || 0).toLocaleString()} ARR • Health: {deal.relationship_health || 80}%
                </div>
              </div>
            </div>
            <Link
              to="/add-interaction"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Add Notes</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      {/* The Hindsight Intelligence Loop Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <BrainCircuit size={15} />
            <span>The Continuous Relationship Intelligence Loop</span>
          </div>
          <Link to="/timeline" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1">
            <span>Explore Timeline</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">1. Remember</div>
            <p className="text-xs text-slate-300 mt-0.5">Hindsight stores Sarah's API mandate and David's security doubts.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/20 bg-rose-500/5">
            <div className="text-[10px] font-bold text-rose-400 uppercase">2. Outcome</div>
            <p className="text-xs text-rose-200 mt-0.5">15% discount rejected by CFO Michael as unproven ROI.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/20 bg-indigo-500/5">
            <div className="text-[10px] font-bold text-indigo-400 uppercase">3. Learn</div>
            <p className="text-xs text-indigo-200 mt-0.5">Price was a proxy for technical value skepticism.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-[10px] font-bold text-emerald-400 uppercase">4. Adapt</div>
            <p className="text-xs text-emerald-200 mt-0.5">Agent prescribes ROI business case instead of discounting.</p>
          </div>
        </div>
      </div>

      {/* Create New Deal Modal */}
      {showCreateDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Building2 size={18} className="text-indigo-400" />
                <h3 className="text-base font-bold text-white">Create New Enterprise Deal</h3>
              </div>
              <button
                onClick={() => setShowCreateDealModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snowflake, Datadog"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Annual Contract Value (ARR in USD)
                </label>
                <input
                  type="number"
                  required
                  min="5000"
                  step="5000"
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateDealModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDeal}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
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
