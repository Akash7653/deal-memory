import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  GitBranch,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { fetchAdminCompanyDetail, approveAdminRequest, rejectAdminRequest } from '../../api';

export default function AdminCompanyDetail() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminCompanyDetail(companyId);
      setData(res);
    } catch (e) {
      console.error('Failed to load company details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveAdminRequest(companyId);
      await loadData();
    } catch (e) {
      alert(e.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Reject this company access?')) return;
    setActionLoading(true);
    try {
      await rejectAdminRequest(companyId);
      await loadData();
    } catch (e) {
      alert(e.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading company details...</p>
      </div>
    );
  }

  if (!data || !data.company) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Company not found.</p>
        <NavLink to="/admin/companies" className="text-xs text-purple-600 underline mt-2 inline-block">
          Return to Companies
        </NavLink>
      </div>
    );
  }

  const company = data?.company || {};
  const users = data?.users || company?.users || [];
  const customers = data?.customers || company?.customers || [];
  const deals = data?.deals || company?.deals || [];
  const activities = data?.activities || company?.activities || [];

  const totalPipeline = deals.reduce((sum, d) => sum + (Number(d.deal_value) || 0), 0);
  const formattedPipeline = totalPipeline > 0 ? `$${(totalPipeline / 1000).toFixed(0)}K` : '$0';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <NavLink
          to="/admin/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Companies</span>
        </NavLink>
      </div>

      {/* Company Header Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-600/20 shrink-0">
            {company.name?.slice(0, 2).toUpperCase() || 'CP'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{company.name}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                company.status === 'approved'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : company.status === 'pending'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {company.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {company.industry || 'Enterprise Software'} • {company.size || '100-500'} employees • Registered {company.created_at ? new Date(company.created_at).toLocaleDateString() : 'Active'}
            </p>
          </div>
        </div>

        {/* Action buttons if pending */}
        {company.status === 'pending' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <CheckCircle2 size={14} />
              <span>Approve Company</span>
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs transition-colors"
            >
              <XCircle size={14} />
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>

      {/* Tenant Security Banner */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-purple-600 dark:text-purple-400 shrink-0" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Deterministic Hindsight Isolation Bank:</span>
            <code className="px-2 py-0.5 rounded-md bg-purple-600/20 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold">
              dealmemory-{company.id}
            </code>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Strict tenant memory namespace active
        </span>
      </div>

      {/* 3 Areas: Users, Customers, Deals - Perfectly Aligned and Fully Responsive across all screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {/* Area 1: Users Section Card */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full hover:border-purple-500/30 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Users size={15} />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Users
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {users.length} {users.length === 1 ? 'Registered' : 'Registered'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {users.length === 0 ? (
                <div className="py-8 text-center">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">No users registered.</p>
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {u.name?.slice(0, 1).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{u.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
                        {u.role || 'Member'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        {u.status || 'Active'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Platform Seats</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{users.length} Active User{users.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Area 2: Customers Section Card */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full hover:border-blue-500/30 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Building2 size={15} />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Customers
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {customers.length} Recorded
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {customers.length === 0 ? (
                <div className="py-8 text-center">
                  <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">No customers recorded yet.</p>
                </div>
              ) : (
                customers.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{c.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shrink-0">
                        {c.industry || 'Enterprise'}
                      </span>
                    </div>
                    {c.contact_information && (
                      <p className="text-[11px] text-slate-500 mt-1.5 truncate">
                        {c.contact_information}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Accounts Managed</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{customers.length} Accounts</span>
          </div>
        </div>

        {/* Area 3: Deals Section Card */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-500/30 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Briefcase size={15} />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Deals
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {deals.length} Active
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {deals.length === 0 ? (
                <div className="py-8 text-center">
                  <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">No deals in pipeline.</p>
                </div>
              ) : (
                deals.map((d) => {
                  const val = d.deal_value ? `$${Number(d.deal_value).toLocaleString()}` : (d.arr || d.value || '$0');
                  return (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                        <span className="truncate">{d.company_name || d.title}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold shrink-0">
                          {val}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                          {d.stage || 'Discovery'}
                        </span>
                        {d.relationship_health && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Health: {d.relationship_health}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pipeline Volume</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formattedPipeline} Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
