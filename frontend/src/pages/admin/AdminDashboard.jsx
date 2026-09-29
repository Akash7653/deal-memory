import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  UserCheck,
  Users,
  Activity,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { fetchAdminStats, fetchAdminRequests, approveAdminRequest, rejectAdminRequest } from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (companyId) => {
    setActionLoading((prev) => ({ ...prev, [companyId]: 'approving' }));
    try {
      await approveAdminRequest(companyId);
      setMessage({ type: 'success', text: `Company approved successfully!` });
      await loadData();
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Failed to approve request' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [companyId]: null }));
    }
  };

  const handleReject = async (companyId) => {
    if (!window.confirm('Are you sure you want to reject this company access request?')) return;
    setActionLoading((prev) => ({ ...prev, [companyId]: 'rejecting' }));
    try {
      await rejectAdminRequest(companyId);
      setMessage({ type: 'success', text: `Company request rejected.` });
      await loadData();
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Failed to reject request' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [companyId]: null }));
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading Admin Dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Companies',
      value: stats?.total_companies ?? 0,
      icon: Building2,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Pending Requests',
      value: stats?.pending_requests ?? 0,
      icon: UserCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Active Companies',
      value: stats?.active_companies ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Users',
      value: stats?.total_users ?? 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Admin Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status of multi-tenant workspaces, company access requests, and support channels.
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

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.bg}`}>
                <Icon size={22} className={card.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Access Requests Section (Central hackathon demo component) */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <UserCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Pending Access Requests ({stats?.pending_requests_list?.length || 0})
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Companies waiting for admin approval to activate their workspace
              </p>
            </div>
          </div>
          <NavLink
            to="/admin/requests"
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </NavLink>
        </div>

        {(!stats?.pending_requests_list || stats.pending_requests_list.length === 0) ? (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              All access requests reviewed!
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              No companies currently waiting for approval.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.pending_requests_list.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {req.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Pending Approval
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                    <span>Contact: <strong className="text-slate-700 dark:text-slate-300">{req.contact_person || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>Email: <strong className="text-slate-700 dark:text-slate-300">{req.contact_email || req.email}</strong></span>
                    <span>•</span>
                    <span>Industry: <span className="text-slate-700 dark:text-slate-300">{req.industry}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={actionLoading[req.id]}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>{actionLoading[req.id] === 'approving' ? 'Approving...' : 'Approve'}</span>
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={actionLoading[req.id]}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Recent Companies + Recent Support Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Companies */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Companies</h3>
            </div>
            <NavLink to="/admin/companies" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
              View All
            </NavLink>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {stats?.recent_companies?.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {c.industry || 'Enterprise'} • {c.size || '50-200'} employees
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                    c.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : c.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {c.status}
                  </span>
                  <NavLink
                    to={`/admin/companies/${c.id}`}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <ArrowRight size={14} />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Conversations */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Support Messages</h3>
            </div>
            <NavLink to="/admin/conversations" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
              Open Support Hub
            </NavLink>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {(!stats?.recent_support || stats.recent_support.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No support messages yet.</p>
            ) : (
              stats.recent_support.map((msg) => (
                <div key={msg.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {msg.company_name || 'Enterprise Workspace'}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
