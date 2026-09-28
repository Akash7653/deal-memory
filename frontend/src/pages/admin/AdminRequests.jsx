import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  User,
  Clock,
  RefreshCw,
  Search,
  Eye,
  AlertCircle
} from 'lucide-react';
import { fetchAdminRequests, approveAdminRequest, rejectAdminRequest } from '../../api';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminRequests();
      setRequests(data);
    } catch (e) {
      console.error('Failed to load requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (companyId) => {
    setActionLoading((prev) => ({ ...prev, [companyId]: 'approving' }));
    try {
      await approveAdminRequest(companyId);
      setMessage({ type: 'success', text: 'Company has been successfully approved and workspace activated.' });
      await loadRequests();
      if (selectedRequest?.id === companyId) {
        setSelectedRequest((prev) => ({ ...prev, status: 'approved' }));
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Approval failed' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [companyId]: null }));
    }
  };

  const handleReject = async (companyId) => {
    if (!window.confirm('Are you sure you want to reject this company access request?')) return;
    setActionLoading((prev) => ({ ...prev, [companyId]: 'rejecting' }));
    try {
      await rejectAdminRequest(companyId);
      setMessage({ type: 'success', text: 'Company access request was marked as rejected.' });
      await loadRequests();
      if (selectedRequest?.id === companyId) {
        setSelectedRequest((prev) => ({ ...prev, status: 'rejected' }));
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Rejection failed' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [companyId]: null }));
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.contact_person?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.industry?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Company Access Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {requests.filter((r) => r.status === 'pending').length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review company registrations, verify tenant legitimacy, and grant access to DealMemory intelligence.
          </p>
        </div>

        <button
          onClick={loadRequests}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, contact, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all"
          />
        </div>
      </div>

      {/* Table of Requests */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {loading && requests.length === 0 ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading company requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No requests found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Industry / Size</th>
                  <th className="py-3 px-4">Requested Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-purple-500 shrink-0" />
                        <span>{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{r.contact_person || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{r.contact_email || r.email}</td>
                    <td className="py-3.5 px-4">
                      <div>{r.industry || 'Enterprise'}</div>
                      <div className="text-[10px] text-slate-400">{r.size || '50-200'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : r.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setSelectedRequest(r)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(r.id)}
                            disabled={actionLoading[r.id]}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 size={13} />
                            <span>{actionLoading[r.id] === 'approving' ? '...' : 'Approve'}</span>
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(r.id)}
                            disabled={actionLoading[r.id]}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-[11px] cursor-pointer disabled:opacity-50"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedRequest.name}
                </h3>
                <p className="text-xs text-slate-500">Access Request Details</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Status</span>
                  <span className="font-bold capitalize text-slate-900 dark:text-white">{selectedRequest.status}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Industry</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRequest.industry || 'SaaS'}</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Person:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedRequest.contact_person || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedRequest.contact_email || selectedRequest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Size:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedRequest.size || '50-200'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{new Date(selectedRequest.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              {selectedRequest.status !== 'approved' && (
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={actionLoading[selectedRequest.id]}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Approve Company
                </button>
              )}
              {selectedRequest.status !== 'rejected' && (
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={actionLoading[selectedRequest.id]}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Reject Request
                </button>
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
