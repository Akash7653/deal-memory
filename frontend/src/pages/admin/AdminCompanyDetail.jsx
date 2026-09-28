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

  const { company, users, customers, deals } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <NavLink
          to="/admin/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          <span>Back to Companies</span>
        </NavLink>
      </div>

      {/* Company Header Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-600/20">
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
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
              {company.industry || 'Technology'} • {company.size || '50-200'} employees • Registered {new Date(company.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action buttons if pending */}
        {company.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <CheckCircle2 size={14} />
              <span>Approve Company</span>
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs"
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
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Deterministic Hindsight Isolation Bank:</span>{' '}
            <code className="px-2 py-0.5 rounded-md bg-purple-600/20 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold">
              dealmemory-{company.id}
            </code>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Strict tenant memory namespace active
        </span>
      </div>

      {/* Grid of Sections: Users, Customers, Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Users Section */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Users ({users?.length || 0})
              </h3>
            </div>
          </div>
          <div className="space-y-2">
            {(!users || users.length === 0) ? (
              <p className="text-xs text-slate-400 py-3 text-center">No users registered.</p>
            ) : (
              users.map((u) => (
                <div key={u.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                  <div className="text-[11px] text-slate-500">{u.email}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{u.role}</span>
                    <span className="uppercase text-slate-400">{u.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customers Section */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-blue-500" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Customers ({customers?.length || 0})
              </h3>
            </div>
          </div>
          <div className="space-y-2">
            {(!customers || customers.length === 0) ? (
              <p className="text-xs text-slate-400 py-3 text-center">No customers recorded yet.</p>
            ) : (
              customers.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.industry || 'Enterprise'}</div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{c.contact_information}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deals Section */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-500" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Deals ({deals?.length || 0})
              </h3>
            </div>
          </div>
          <div className="space-y-2">
            {(!deals || deals.length === 0) ? (
              <p className="text-xs text-slate-400 py-3 text-center">No deals in pipeline.</p>
            ) : (
              deals.map((d) => (
                <div key={d.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{d.title || d.company_name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{d.arr || d.value || '$120K'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{d.stage || 'Discovery / Validation'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
