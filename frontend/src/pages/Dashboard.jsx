import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  History,
  Lightbulb,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
  Building,
  ArrowDown,
  XCircle,
  Database,
  BrainCircuit,
  PlusCircle,
  Clock,
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
      const res = await createDeal({
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

  // Calculate total pipeline
  const totalPipeline = deals.reduce((acc, d) => acc + (d.deal_value || 0), 0) || 120000;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Sales Leader'}
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {user?.company || 'Personal Workspace'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Your personal relationship intelligence dashboard grounded in Hindsight persistent memory.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowCreateDealModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all"
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

      {/* Visual Hook: Traditional CRM vs DealMemory */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <BrainCircuit size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Cognitive Sales Layer
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Hindsight by Vectorize
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              <span className="text-slate-400">Traditional CRMs store static notes.</span>{' '}
              <strong className="text-white font-semibold">
                DealMemory remembers what happened, learns from previous outcomes, and advises your next move.
              </strong>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-start md:self-auto text-xs font-semibold">
          <Link
            to="/timeline"
            className="px-3.5 py-2 rounded-xl bg-sky-600/15 border border-sky-500/30 text-sky-400 hover:bg-sky-600/25 transition-colors flex items-center space-x-1.5"
          >
            <span>See Memory Timeline</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* KPI Cards: Responsive Grid (Mobile stacked, tablet 2-col, desktop 4-col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Pipeline</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <DollarSign size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black tracking-tight text-white">
              ${totalPipeline.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">ARR</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{deals.length || 1} Deals</span>
            <span>in active evaluation</span>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-slate-900 border border-rose-500/30 p-4 sm:p-5 rounded-2xl relative overflow-hidden bg-rose-500/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Needs Strategy Attention</span>
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black tracking-tight text-white">1 Deal</span>
            <span className="text-xs font-semibold text-rose-400">Failed Strategy</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-rose-300/80">
            <span>ACME Corp • 15% discount rejected</span>
          </div>
        </div>

        {/* Persistent Memories */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Persistent Memories</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <History size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black tracking-tight text-white">
              {loading ? '...' : memoryCount}
            </span>
            <span className="text-xs text-purple-400 font-semibold">Live in Bank</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hindsight Recall Active</span>
          </div>
        </div>

        {/* Learned Lessons */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Learned Insights</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Lightbulb size={17} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black tracking-tight text-white">2</span>
            <span className="text-xs text-amber-400 font-semibold">Reflections</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-400">
            <span>Price resistance is proxy for ROI</span>
          </div>
        </div>
      </div>

      {/* STRATEGIC BANNER: PREVIOUS STRATEGY FAILED -> HINDSIGHT LEARNED -> NEW STRATEGY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Strategic Pivot in Action: ACME Corp
            </h2>
          </div>
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>Evaluation Stage</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">78% Health</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Failed Strategy */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  Previous Strategy: Failed
                </span>
                <span className="text-slate-400 text-[11px]">Sept 26</span>
              </div>
              <h3 className="font-bold text-white text-sm">15% Upfront Annual Discount</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Salesperson attempted a 15% discount to address Michael's budget objection. Michael rejected it because the proposal failed to quantify integration ROI.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center text-[11px] text-rose-300">
              <XCircle size={14} className="mr-1.5 flex-shrink-0 text-rose-400" />
              <span>Discounting failed to close the deal</span>
            </div>
          </div>

          {/* Step 2: Hindsight Learned */}
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  Hindsight Learned
                </span>
                <span className="text-slate-400 text-[11px]">Autonomous Reflect</span>
              </div>
              <h3 className="font-bold text-white text-sm">Value Gap Identified</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Price is merely a proxy for value skepticism. David's unresolved security concerns are blocking Michael's financial approval. Technical validation is required first.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center text-[11px] text-purple-300">
              <Sparkles size={14} className="mr-1.5 flex-shrink-0 text-purple-400" />
              <span>Cognitive reflection extracted core blocker</span>
            </div>
          </div>

          {/* Step 3: Adaptive New Strategy */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  New Recommended Strategy
                </span>
                <span className="text-emerald-400 text-[11px] font-semibold">Active</span>
              </div>
              <h3 className="font-bold text-white text-sm">Do NOT Discount. Prove ROI.</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                1. Build quantified integration ROI case for Michael.<br />
                2. Conduct technical security briefing with David.<br />
                3. Demonstrate API-first workflow to Sarah.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center text-[11px] text-emerald-300">
              <CheckCircle2 size={14} className="mr-1.5 flex-shrink-0 text-emerald-400" />
              <span>Grounded actionable sales guidance</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Hindsight Bank: <strong className="text-slate-200">dealmemory-acme</strong> • Persistent Memory ID: <code className="text-sky-400">bank:acme</code>
          </span>
          <div className="flex items-center space-x-3">
            <Link
              to="/meeting-prep"
              className="text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
            >
              <span>Open Executive Meeting Prep</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* User's Deals List Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Building size={18} className="text-sky-400" />
            <h3 className="font-bold text-white text-base">Your Active Deals</h3>
          </div>
          <button
            onClick={() => setShowCreateDealModal(true)}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
          >
            <PlusCircle size={14} />
            <span>Add Deal</span>
          </button>
        </div>

        <div className="space-y-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sky-400 text-sm">
                  {deal.company_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{deal.company_name}</span>
                    {deal.is_demo && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                        Demo Account
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                    <span>${(deal.deal_value || 0).toLocaleString()} ARR</span>
                    <span>•</span>
                    <span className="capitalize">{deal.stage} Stage</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:self-auto self-end">
                <Link
                  to="/deal"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs text-slate-200 font-medium transition-colors"
                >
                  Deal Overview
                </Link>
                <Link
                  to="/timeline"
                  className="px-3 py-1.5 rounded-lg bg-sky-600/15 hover:bg-sky-600/25 border border-sky-500/30 text-xs text-sky-400 font-medium transition-colors"
                >
                  Memory Timeline
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Deal */}
      {showCreateDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Deal</h3>
            <p className="text-xs text-slate-400">
              Each deal will receive an isolated Hindsight memory bank for your account.
            </p>
            <form onSubmit={handleCreateDeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Datadog"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Deal Value (USD)</label>
                <input
                  type="number"
                  required
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDealModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDeal}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 disabled:opacity-50"
                >
                  {creatingDeal ? 'Creating...' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
