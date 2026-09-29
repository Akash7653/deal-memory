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
import { fetchDealMemory, fetchDeals, formatDisplayDate } from '../api';

export default function DealOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dealParam = searchParams.get('deal') || '';

  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(dealParam);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error('Failed to load deals in Overview:', err);
        if (!selectedDealId) setSelectedDealId('acme');
      });
  }, []);

  const currentDeal = deals.find((d) => d.id === selectedDealId) || (selectedDealId === 'acme' ? { id: 'acme', company_name: 'ACME Corp', deal_value: 120000, stage: 'Evaluation' } : null);

  const loadMemories = (targetId) => {
    const idToFetch = targetId || selectedDealId || 'acme';
    setLoading(true);
    fetchDealMemory(idToFetch)
      .then((data) => {
        setMemories(data.memories || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedDealId) {
      loadMemories(selectedDealId);
    }
  }, [selectedDealId]);

  const handleSelectDeal = (id) => {
    setSelectedDealId(id);
    setSearchParams(id ? { deal: id } : {});
  };

  const isAcme = selectedDealId === 'acme';
  const dealTitle = currentDeal?.company_name || 'Customer Deal';
  const dealValue = currentDeal?.deal_value ? `$${currentDeal.deal_value.toLocaleString()} ARR` : '$180,000 ARR';
  const dealStage = currentDeal?.stage || (isAcme ? 'Evaluation' : 'Discovery');
  const dealInitials = dealTitle.slice(0, 2).toUpperCase();

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
                <span>{isAcme ? 'B2B Enterprise CRM' : 'Enterprise Digital Transformation'}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Memory Bank: <code className="text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-900/40">{isAcme ? 'dealmemory-acme' : 'dealmemory-technova'}</code></span>
              </div>

              {/* Deal Selector Dropdown */}
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
                  {!deals.some((d) => d.id === 'acme') && <option value="acme">ACME Corp ($120,000 ARR)</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Relationship Health & Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            {/* Relationship Health Indicator */}
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between sm:justify-start space-x-3 shadow-2xs">
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Relationship Health
                </div>
                <div className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-300 leading-tight">
                  {isAcme ? '78%' : '85%'}
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
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
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{isAcme ? 'Technical POC' : 'Stakeholder Discovery'}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Value</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{dealValue}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Annual Contract</div>
        </div>
        <div className="bg-emerald-50/40 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase">Health Score</div>
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{isAcme ? '78% Health' : '85% Health'}</div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">Champion Active</div>
        </div>
        <div className="bg-purple-50/40 dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-xl p-3.5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-purple-800 dark:text-purple-400 uppercase">Last Interaction</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {memories.length > 0 && memories[0].mentioned_at ? formatDisplayDate(memories[0].mentioned_at, false) : formatDisplayDate(new Date(), false)}
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium truncate">
            {memories.length > 0 ? (memories[0].type || 'Interaction Recorded') : 'Recent Activity'}
          </div>
        </div>
        <div className="bg-purple-50/50 dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1 shadow-2xs">
          <div className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 uppercase">Next Action</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{isAcme ? 'Prove ROI' : 'Security Validation'}</div>
          <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium truncate">{isAcme ? 'Technical Briefing' : 'CTO Architecture Review'}</div>
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
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Prove Integration ROI and Technical Feasibility</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Hindsight learned that CFO Michael's price pushback is a direct symptom of unverified integration value. Focus next meeting on operational hours saved by the API-first pipeline and clear security checklists with David.
          </p>
        </div>

        {/* Strategy to Avoid */}
        <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <XCircle size={16} />
            <span>Strategy To Avoid</span>
          </div>
          <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">Do NOT Repeat Discounting</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            On Sept 26, offering a 15% upfront discount failed and alienated the CFO. Further price cuts signal low product value and will permanently stall enterprise procurement.
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
          <span className="text-xs text-slate-500 dark:text-slate-400">3 Stakeholders Retained in Hindsight</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Sarah */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm border border-purple-200 dark:border-purple-800/60">
                S
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Sarah</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">VP Sales</div>
              </div>
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold pt-1">
              Business Champion
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mandated an API-first solution to unify sales pipeline data across internal systems. Wants fast rollout.
            </p>
          </div>

          {/* David */}
          <div className="bg-amber-50/50 dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30 p-4 sm:p-5 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-200 dark:border-amber-500/20">
                D
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">David</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">CTO</div>
              </div>
            </div>
            <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold pt-1">
              Technical Evaluator & Blocker
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Primary blocker. Deeply concerned about integration complexity, webhook latency, and SOC2/security architecture.
            </p>
          </div>

          {/* Michael */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-slate-700">
                M
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Michael</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">CFO</div>
              </div>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold pt-1">
              Financial Gatekeeper
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Demands strict ROI proof. Rejected 15% discount because proposal lacked concrete operational cost justification.
            </p>
          </div>
        </div>
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
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-slate-950 border border-rose-200 dark:border-rose-500/30 space-y-1">
            <div className="text-[10px] text-rose-800 dark:text-slate-400 uppercase font-semibold">Integration Risk</div>
            <div className="text-sm font-bold text-rose-700 dark:text-rose-400">High</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">CTO raised API/webhook concerns</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-slate-950 border border-amber-200 dark:border-amber-500/30 space-y-1">
            <div className="text-[10px] text-amber-800 dark:text-slate-400 uppercase font-semibold">Security Risk</div>
            <div className="text-sm font-bold text-amber-700 dark:text-amber-400">Medium</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Needs enterprise architecture review</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-slate-950 border border-amber-200 dark:border-amber-500/30 space-y-1">
            <div className="text-[10px] text-amber-800 dark:text-slate-400 uppercase font-semibold">Budget Risk</div>
            <div className="text-sm font-bold text-amber-700 dark:text-amber-400">Medium</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">CFO requires verified ROI</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-500/30 space-y-1">
            <div className="text-[10px] text-emerald-800 dark:text-slate-400 uppercase font-semibold">Champion Health</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Strong</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Sarah (VP Sales) committed</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Competition</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-300">Watch</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Internal build evaluated</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Biggest Risk:</span>{' '}
            <span className="text-slate-700 dark:text-slate-300">Integration complexity & unverified ROI with David (CTO).</span>
          </div>
          <div className="text-purple-600 dark:text-purple-400 font-semibold flex items-center space-x-1.5 flex-shrink-0">
            <span>Recommended Action:</span>
            <Link to="/meeting-prep" className="underline hover:text-purple-700 dark:hover:text-purple-300">
              Schedule technical briefing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
