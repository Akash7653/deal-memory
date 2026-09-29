import React, { useState, useEffect } from 'react';
import {
  Activity,
  RefreshCw,
  Search,
  Building2,
  User,
  Clock,
  CheckCircle2,
  FileText,
  Bot,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { fetchAdminActivity } from '../../api';

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminActivity();
      setActivities(Array.isArray(data) ? data : (data?.activities || []));
    } catch (e) {
      console.error('Failed to load activity logs:', e);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getActionBadge = (action) => {
    const act = (action || '').toLowerCase();
    if (act.includes('approve')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Approved</span>;
    }
    if (act.includes('register') || act.includes('request')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">Registration</span>;
    }
    if (act.includes('reflect') || act.includes('learn')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Hindsight</span>;
    }
    if (act.includes('ai') || act.includes('ask')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">AI Query</span>;
    }
    if (act.includes('outcome')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Outcome</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-750">Audit</span>;
  };

  const safeActivities = Array.isArray(activities) ? activities : [];
  const filtered = safeActivities.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.action?.toLowerCase().includes(q) ||
      a.company_name?.toLowerCase().includes(q) ||
      a.user_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Platform Activity Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global audit log recording company registrations, access approvals, deal updates, and AI actions.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search activity by action, company, user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all shadow-xs"
        />
      </div>

      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {loading && activities.length === 0 ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading audit trail...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No activity recorded</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((act) => (
              <div key={act.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                    <Activity size={16} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {act.action}
                      </span>
                      {getActionBadge(act.action)}
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-2">
                      <span>Company: <strong className="text-slate-700 dark:text-slate-300">{act.company_name || 'System'}</strong></span>
                      <span>•</span>
                      <span>User: <strong className="text-slate-700 dark:text-slate-300">{act.user_name || 'System Admin'}</strong></span>
                    </div>
                    {act.metadata && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 inline-block">
                        {typeof act.metadata === 'string' ? act.metadata : JSON.stringify(act.metadata)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                  <Clock size={12} />
                  <span>{new Date(act.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
