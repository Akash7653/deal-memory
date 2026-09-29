import React, { useState, useEffect } from 'react';
import {
  Clock,
  Filter,
  Trash2,
  Sparkles,
  Bot,
  CalendarCheck2,
  Building2,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { fetchHistory, deleteHistoryItem, fetchDeals } from '../api';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [histData, dealsData] = await Promise.all([
        fetchHistory(selectedType, selectedDeal),
        fetchDeals().catch(() => ({ deals: [] })),
      ]);
      setActivities(histData.activities || []);
      const userCompId = user?.company_id;
      const allDeals = dealsData.deals || [];
      const tenantDeals = userCompId
        ? allDeals.filter((d) => d.company_id === userCompId)
        : allDeals;
      setDeals(tenantDeals);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('User account not found') || msg.includes('Authentication required') || msg.includes('Invalid or expired')) {
        localStorage.removeItem('dealmemory_token');
        setError('Your session has expired or the user account was reset. Please sign in again.');
      } else {
        setError(msg || 'Failed to load activity history');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedType, selectedDeal]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this activity record?')) return;
    try {
      await deleteHistoryItem(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete activity item');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'interaction':
        return <Building2 size={16} className="text-purple-500 dark:text-purple-400" />;
      case 'outcome':
        return <AlertTriangle size={16} className="text-rose-500 dark:text-rose-400" />;
      case 'learning':
        return <Sparkles size={16} className="text-emerald-500 dark:text-emerald-400" />;
      case 'meeting_prep':
        return <CalendarCheck2 size={16} className="text-purple-500 dark:text-purple-400" />;
      case 'ai_question':
        return <Bot size={16} className="text-purple-500 dark:text-purple-400" />;
      default:
        return <Clock size={16} className="text-slate-500 dark:text-slate-400" />;
    }
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case 'interaction':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold uppercase">
            Interaction
          </span>
        );
      case 'outcome':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold uppercase">
            Outcome
          </span>
        );
      case 'learning':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
            Hindsight Reflection
          </span>
        );
      case 'meeting_prep':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold uppercase">
            Meeting Prep
          </span>
        );
      case 'ai_question':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold uppercase">
            AI Question
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 font-semibold uppercase">
            Event
          </span>
        );
    }
  };

  const formatTimestamp = (isoStr) => {
    if (!isoStr) return '';
    let clean = isoStr;
    if (!clean.endsWith('Z') && !clean.includes('+')) {
      clean += 'Z';
    }
    const date = new Date(clean);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Activity History
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
              Isolated Workspace
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Private audit trail of your customer interactions, strategy attempts, AI inquiries, and Hindsight reflections.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-3 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mr-2">
          <Filter size={14} />
          <span>Filter By:</span>
        </div>

        {/* Activity Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="all">All Activities</option>
          <option value="interaction">Interactions</option>
          <option value="outcome">Strategy Outcomes</option>
          <option value="learning">Hindsight Reflections</option>
          <option value="meeting_prep">Meeting Preps</option>
          <option value="ai_question">AI Questions</option>
        </select>

        {/* Deal Filter */}
        <select
          value={selectedDeal}
          onChange={(e) => setSelectedDeal(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="all">All Deals</option>
          {deals.map((d) => (
            <option key={d.id} value={d.id}>
              {d.company_name}
            </option>
          ))}
        </select>

        <div className="ml-auto text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing {activities.length} {activities.length === 1 ? 'record' : 'records'}
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading your activity history...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 p-6 rounded-2xl text-center space-y-3.5 shadow-xs">
          <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-semibold">{error}</p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                localStorage.removeItem('dealmemory_token');
                window.location.href = '/login';
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer active:scale-95"
            >
              Sign In to Refresh
            </button>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer active:scale-95"
            >
              Retry
            </button>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Clock size={36} className="text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No activity records found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your interactions, outcomes, and AI agent questions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700 p-4 rounded-2xl transition-all shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5 flex-1">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getActivityIcon(act.activity_type)}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{act.title}</span>
                    {getActivityBadge(act.activity_type)}
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-medium">
                      {act.company}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{act.description}</p>
                  )}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 pt-1 font-medium">
                    <Clock size={12} />
                    <span>{formatTimestamp(act.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Delete record button */}
              <button
                onClick={() => handleDelete(act.id)}
                title="Delete activity record"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
