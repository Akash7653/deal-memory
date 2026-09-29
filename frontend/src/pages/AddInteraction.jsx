import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  Database,
  CheckCircle2,
  Calendar,
  User,
  Building,
  Tag,
  FileText,
  ArrowRight,
  Sparkles,
  Target,
  XCircle,
  BrainCircuit,
  Bot,
  Layers,
} from 'lucide-react';
import { createInteraction, createOutcome, fetchLearnedInsights, fetchDeals } from '../api';
import { useAuth } from '../context/AuthContext';

const getTodayLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AddInteraction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealQueryParam = searchParams.get('deal');
  const customerQueryParam = searchParams.get('customer');

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'outcome' ? 'outcome' : 'interaction');

  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [loadingDeals, setLoadingDeals] = useState(true);

  // Tab 1: Interaction state
  const [interactionForm, setInteractionForm] = useState({
    company: customerQueryParam || '',
    contact_name: '',
    contact_role: 'CTO',
    interaction_type: 'technical',
    date: getTodayLocalDate(),
    content: '',
    outcome: '',
    tags: 'api-first, integration, security, architecture',
  });

  // Tab 2: Outcome state
  const [outcomeForm, setOutcomeForm] = useState({
    company: customerQueryParam || '',
    strategy: 'Technical Deep Dive',
    result: 'successful',
    details: '',
    date: getTodayLocalDate(),
    tags: 'technical-validation, security-review',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [learnedInsights, setLearnedInsights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDeals() {
      setLoadingDeals(true);
      try {
        const res = await fetchDeals(true);
        const list = res?.deals || [];
        setDeals(list);

        let activeId = '';
        if (dealQueryParam && list.some((d) => d.id === dealQueryParam)) {
          activeId = dealQueryParam;
        } else if (customerQueryParam) {
          const match = list.find((d) => (d.company_name || '').toLowerCase().includes(customerQueryParam.toLowerCase()));
          if (match) activeId = match.id;
        }

        if (!activeId && list.length > 0) {
          activeId = list[0].id;
        }

        setSelectedDealId(activeId);

        const dealObj = list.find((d) => d.id === activeId);
        if (dealObj) {
          setInteractionForm((prev) => ({ ...prev, company: dealObj.company_name }));
          setOutcomeForm((prev) => ({ ...prev, company: dealObj.company_name }));
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoadingDeals(false);
      }
    }
    loadDeals();
  }, [dealQueryParam, customerQueryParam]);

  const handleDealSelect = (id) => {
    setSelectedDealId(id);
    const dealObj = deals.find((d) => d.id === id);
    if (dealObj) {
      setInteractionForm((prev) => ({ ...prev, company: dealObj.company_name }));
      setOutcomeForm((prev) => ({ ...prev, company: dealObj.company_name }));
    }
  };

  const handleInteractionSubmit = async (e) => {
    e.preventDefault();
    if (!interactionForm.content.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessResponse(null);

    const targetDealId = selectedDealId || 'general';
    const payload = {
      company: interactionForm.company || 'Customer Account',
      contact_name: interactionForm.contact_name.trim() || 'Stakeholder',
      contact_role: interactionForm.contact_role.trim() || 'Decision Maker',
      interaction_type: interactionForm.interaction_type,
      date: interactionForm.date || getTodayLocalDate(),
      content: interactionForm.content.trim(),
      outcome: interactionForm.outcome.trim() || undefined,
      tags: interactionForm.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    try {
      const res = await createInteraction(targetDealId, payload);
      setSuccessResponse({
        type: 'interaction',
        data: res,
        dealId: targetDealId,
        company: payload.company,
      });
    } catch (err) {
      setError(err.message || 'Failed to save interaction');
    } finally {
      setLoading(false);
    }
  };

  const handleOutcomeSubmit = async (e) => {
    e.preventDefault();
    if (!outcomeForm.details.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessResponse(null);
    setLearnedInsights(null);

    const targetDealId = selectedDealId || 'general';
    const payload = {
      company: outcomeForm.company || 'Customer Account',
      strategy: outcomeForm.strategy.trim(),
      result: outcomeForm.result,
      details: outcomeForm.details.trim(),
      date: outcomeForm.date || getTodayLocalDate(),
      tags: outcomeForm.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    try {
      const res = await createOutcome(targetDealId, payload);
      let insights = [];
      try {
        const reflectRes = await fetchLearnedInsights(targetDealId);
        insights = reflectRes?.learned_insights || [];
      } catch (refErr) {
        console.warn('Reflection error:', refErr);
      }

      setSuccessResponse({
        type: 'outcome',
        data: res,
        dealId: targetDealId,
        company: payload.company,
        strategy: payload.strategy,
        result: payload.result,
        details: payload.details,
      });
      setLearnedInsights(insights);
    } catch (err) {
      setError(err.message || 'Failed to record strategy outcome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Database size={15} />
          <span>Hindsight Relationship Memory Loop</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Record Sales Activity & Outcomes
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Log client interactions, objection handling, or strategy outcomes into Hindsight memory.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveTab('interaction');
            setSuccessResponse(null);
            setError(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'interaction'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText size={14} />
          <span>1. Log Interaction</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('outcome');
            setSuccessResponse(null);
            setError(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'outcome'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Target size={14} />
          <span>2. Record Strategy Outcome (Learning Loop)</span>
        </button>
      </div>

      {/* Deal / Account Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Deal / Account
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select which customer deal memory bank this entry belongs to.
            </p>
          </div>
          <select
            value={selectedDealId}
            onChange={(e) => handleDealSelect(e.target.value)}
            className="bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-600"
          >
            {deals.map((d) => (
              <option key={d.id} value={d.id}>
                {d.company_name} (${(d.deal_value || 0).toLocaleString()} ARR • {d.stage})
              </option>
            ))}
            {!deals.some((d) => d.id === 'general') && (
              <option value="general">Workspace General Intelligence</option>
            )}
          </select>
        </div>
      </div>

      {/* Success Notification Card */}
      {successResponse && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 p-6 rounded-2xl space-y-4 shadow-xl animate-fade-in">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 size={20} />
            <span>
              {successResponse.type === 'outcome'
                ? 'Strategy Outcome Retained & Hindsight Reflection Complete!'
                : 'Customer Interaction Stored in Hindsight Memory!'}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {successResponse.type === 'outcome' ? (
              <>
                Retained strategy outcome: <strong>"{successResponse.strategy}"</strong> ({successResponse.result.toUpperCase()}) for{' '}
                <strong>{successResponse.company}</strong>. Hindsight has digested this result into actionable intelligence.
              </>
            ) : (
              <>
                Successfully stored interaction notes for <strong>{successResponse.company}</strong>. The AI Agent now has access to this ground-truth evidence.
              </>
            )}
          </p>

          {learnedInsights && learnedInsights.length > 0 && (
            <div className="p-4 bg-purple-50/50 dark:bg-slate-950 rounded-xl border border-purple-200 dark:border-purple-900/40 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">
                <BrainCircuit size={14} />
                <span>Extracted Hindsight Insights</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                {learnedInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to={`/timeline?deal=${successResponse.dealId}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
            >
              <span>View Memory Timeline</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to={`/agent?deal=${successResponse.dealId}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              <Bot size={13} />
              <span>Ask AI Agent About Next Meeting</span>
            </Link>
            <Link
              to={`/meeting-prep?deal=${successResponse.dealId}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
            >
              <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
              <span>Prepare Meeting Brief</span>
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-semibold flex items-center space-x-2">
          <XCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: LOG INTERACTION FORM (6.3) */}
      {activeTab === 'interaction' && (
        <form onSubmit={handleInteractionSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Account Name *
              </label>
              <input
                type="text"
                required
                value={interactionForm.company}
                onChange={(e) => setInteractionForm({ ...interactionForm, company: e.target.value })}
                placeholder="e.g. Globex Industries"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Interaction Type *
              </label>
              <select
                value={interactionForm.interaction_type}
                onChange={(e) => setInteractionForm({ ...interactionForm, interaction_type: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              >
                <option value="technical">Technical Architecture Review</option>
                <option value="discovery">Discovery & Requirements</option>
                <option value="pricing">Commercial / Pricing Proposal</option>
                <option value="executive">Executive Stakeholder Briefing</option>
                <option value="security">Security & Compliance</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={interactionForm.contact_name}
                onChange={(e) => setInteractionForm({ ...interactionForm, contact_name: e.target.value })}
                placeholder="e.g. Rohan Mehta"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Role *
              </label>
              <input
                type="text"
                required
                value={interactionForm.contact_role}
                onChange={(e) => setInteractionForm({ ...interactionForm, contact_role: e.target.value })}
                placeholder="e.g. CTO"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Interaction Date *
              </label>
              <input
                type="date"
                required
                value={interactionForm.date}
                onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Interaction Notes & Customer Voice *
            </label>
            <textarea
              required
              rows={4}
              value={interactionForm.content}
              onChange={(e) => setInteractionForm({ ...interactionForm, content: e.target.value })}
              placeholder="e.g. Rohan Mehta, CTO, said Globex needs an API-first integration with their existing ERP and CRM systems. He is concerned about implementation complexity, security compliance, and migration risk. He asked for proof that the integration can be completed without disrupting current operations."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags / Keywords
            </label>
            <input
              type="text"
              value={interactionForm.tags}
              onChange={(e) => setInteractionForm({ ...interactionForm, tags: e.target.value })}
              placeholder="e.g. api-first, integration, security, migration-risk, cto"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading || !interactionForm.content.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Database size={14} />
              <span>{loading ? 'Retaining in Hindsight...' : 'Save Interaction to Memory'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: RECORD STRATEGY OUTCOME FORM (6.6) */}
      {activeTab === 'outcome' && (
        <form onSubmit={handleOutcomeSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Account *
              </label>
              <input
                type="text"
                required
                value={outcomeForm.company}
                onChange={(e) => setOutcomeForm({ ...outcomeForm, company: e.target.value })}
                placeholder="e.g. Globex Industries"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Outcome Date *
              </label>
              <input
                type="date"
                required
                value={outcomeForm.date}
                onChange={(e) => setOutcomeForm({ ...outcomeForm, date: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sales Strategy Attempted *
              </label>
              <input
                type="text"
                required
                value={outcomeForm.strategy}
                onChange={(e) => setOutcomeForm({ ...outcomeForm, strategy: e.target.value })}
                placeholder="e.g. Technical Deep Dive"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Strategy Result *
              </label>
              <select
                value={outcomeForm.result}
                onChange={(e) => setOutcomeForm({ ...outcomeForm, result: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-bold"
              >
                <option value="successful">Successful (Advanced deal / Resolved objection)</option>
                <option value="unsuccessful">Unsuccessful (Rejected / Stalled deal)</option>
                <option value="partial">Partial (Mixed reaction / Conditional)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Measurable Outcome & Customer Feedback *
            </label>
            <textarea
              required
              rows={4}
              value={outcomeForm.details}
              onChange={(e) => setOutcomeForm({ ...outcomeForm, details: e.target.value })}
              placeholder="e.g. Technical deep dive was successful. Rohan confirmed the API architecture addresses the integration concerns, but requested a detailed security review before moving to commercial discussions."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading || !outcomeForm.details.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Sparkles size={14} />
              <span>{loading ? 'Retaining & Reflecting...' : 'Record Outcome & Trigger Hindsight Learning'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
