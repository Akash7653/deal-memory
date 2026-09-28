import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { createInteraction } from '../api';

export default function AddInteraction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: 'ACME Corp',
    contact_name: '',
    contact_role: '',
    interaction_type: 'technical',
    date: new Date().toISOString().split('T')[0],
    content: '',
    outcome: '',
    tags: 'integration, evaluation',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setLoading(true);
    setError(null);

    const payload = {
      company: formData.company,
      contact_name: formData.contact_name || 'Stakeholder',
      contact_role: formData.contact_role || 'Evaluator',
      interaction_type: formData.interaction_type,
      date: formData.date,
      content: formData.content,
      outcome: formData.outcome || undefined,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    try {
      const res = await createInteraction('acme', payload);
      setSuccessResponse(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center space-x-2 text-purple-500 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Database size={15} />
          <span>Hindsight Memory Ingestion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Log Customer Interaction
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Record call notes, objections, commitments, or outcomes into persistent memory bank <code className="text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold">dealmemory-acme</code>.
        </p>
      </div>

      {successResponse ? (
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 size={20} />
            <span>Interaction Successfully Retained in Hindsight!</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Stored Memory Narrative:
            </div>
            <p className="leading-relaxed text-slate-800 dark:text-slate-200">
              {successResponse.stored_memory?.narrative}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {successResponse.stored_memory?.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-[10px] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Link
              to="/timeline"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <span>View in Memory Timeline</span>
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => {
                setSuccessResponse(null);
                setFormData({
                  company: 'ACME Corp',
                  contact_name: '',
                  contact_role: '',
                  interaction_type: 'technical',
                  date: new Date().toISOString().split('T')[0],
                  content: '',
                  outcome: '',
                  tags: 'integration, evaluation',
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Log Another Interaction
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-5 shadow-xl transition-colors"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Company / Deal
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Interaction Type
              </label>
              <select
                value={formData.interaction_type}
                onChange={(e) =>
                  setFormData({ ...formData, interaction_type: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="discovery">Discovery Call</option>
                <option value="technical">Technical Evaluation</option>
                <option value="pricing">Commercial / Pricing</option>
                <option value="competitor">Competitor Discussion</option>
                <option value="proposal">Proposal Review</option>
                <option value="outcome">Strategy Outcome</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. David"
                value={formData.contact_name}
                onChange={(e) =>
                  setFormData({ ...formData, contact_name: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                placeholder="e.g. CTO"
                value={formData.contact_role}
                onChange={(e) =>
                  setFormData({ ...formData, contact_role: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Interaction Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Detailed Interaction Notes / Objections
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. David (CTO) asked whether our API supports asynchronous batching and expressed concern about webhook delivery latency..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed placeholder-slate-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Outcome / Next Step / Reaction (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Agreed to provide API architecture benchmark documentation by Friday."
              value={formData.outcome}
              onChange={(e) =>
                setFormData({ ...formData, outcome: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. api, latency, security, benchmark"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Retains to Hindsight bank via <code className="text-purple-600 dark:text-purple-400 font-mono">aretain()</code>
            </span>

            <button
              type="submit"
              disabled={loading || !formData.content.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              <span>{loading ? 'Retaining in Hindsight...' : 'Retain in Memory'}</span>
              <Sparkles size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
