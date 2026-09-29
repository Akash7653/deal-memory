import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Search,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Users,
  Briefcase,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { fetchAdminCompanies, deleteAdminCompany } from '../../api';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCompanies();
      setCompanies(Array.isArray(data) ? data : (data?.companies || []));
    } catch (e) {
      console.error('Failed to load companies:', e);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to permanently delete company "${companyName}" and all associated workspace data (users, deals, memories)?`)) return;
    try {
      await deleteAdminCompany(companyId);
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    } catch (e) {
      alert(e.message || 'Failed to delete company');
    }
  };

  const safeCompanies = Array.isArray(companies) ? companies : [];
  const filtered = safeCompanies.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Companies ({companies.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered tenant organizations, memory namespaces, and workspace configurations.
          </p>
        </div>

        <button
          onClick={loadCompanies}
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
          placeholder="Search by company name, industry, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && companies.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading companies...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No companies found</p>
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-500/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    c.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : c.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.industry || 'Enterprise SaaS'} • {c.size || '50-200'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:divide-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Tenant ID</span>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate block">
                      {c.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Hindsight Bank</span>
                    <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 truncate block">
                      dealmemory-{c.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteCompany(c.id, c.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete Company"
                  >
                    <Trash2 size={13} />
                  </button>
                  <NavLink
                    to={`/admin/companies/${c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    <span>Details</span>
                    <ArrowRight size={14} />
                  </NavLink>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
