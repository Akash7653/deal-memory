import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Building2,
  RefreshCw,
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Mail,
  ExternalLink,
  ChevronRight,
  Search,
  Info,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { fetchAdminConversations, sendAdminSupportMessage } from '../../api';

export default function AdminConversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTab, setMobileTab] = useState('chat'); // 'channels' | 'chat' | 'details'
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminConversations();
      const list = Array.isArray(data) ? data : (data?.conversations || []);
      const normalized = list.map((c) => ({
        ...c,
        company_id: c.company_id || c.id,
        company_name: c.company_name || c.name,
        users: c.users || [],
        messages: c.messages || [],
      }));
      setConversations(normalized);
      if (normalized.length > 0) {
        setSelectedCompanyId((prev) =>
          prev && normalized.some((c) => c.company_id === prev) ? prev : normalized[0].company_id
        );
      }
    } catch (e) {
      console.error('Failed to load support conversations:', e);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeConv = conversations.find((c) => c.company_id === selectedCompanyId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesName = c.company_name?.toLowerCase().includes(q);
    const matchesUser = c.users?.some((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    return matchesName || matchesUser;
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    setSending(true);
    try {
      await sendAdminSupportMessage(activeConv.company_id, replyText.trim());
      setReplyText('');
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Support Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Admin ↔ Tenant Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Direct operational support channel with tenant company users. Strictly isolated from the Hindsight sales-learning loop.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Threads</span>
        </button>
      </div>

      {/* Mobile/Tablet View Segmented Switcher (Visible below lg) */}
      <div className="flex lg:hidden items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-bold">
        <button
          onClick={() => setMobileTab('channels')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
            mobileTab === 'channels'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Channels ({conversations.length})
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
            mobileTab === 'chat'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Support Chat
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
            mobileTab === 'details'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Users & Org ({activeConv?.users?.length || 0})
        </button>
      </div>

      {/* Main 3-Area Layout Container: Channels List | Live Chat Pane | Tenant Users & Profile */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* AREA 1: Tenant Companies Sidebar (cols 1-3 on lg/xl) */}
        <div
          className={`lg:col-span-3 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
            mobileTab === 'channels' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tenant Channels ({conversations.length})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                Active
              </span>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter companies or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto flex-1 max-h-[540px]">
            {loading && conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw size={16} className="animate-spin text-purple-600" />
                <span>Loading tenant channels...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No channels found.</div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = activeConv?.company_id === c.company_id;
                const userCount = c.users?.length || 0;
                const primaryUser = c.users?.[0]?.name || (userCount > 0 ? `${userCount} Users` : 'No users');
                const lastMsg = c.messages?.[c.messages.length - 1];

                return (
                  <button
                    key={c.company_id}
                    onClick={() => {
                      setSelectedCompanyId(c.company_id);
                      setMobileTab('chat');
                    }}
                    className={`w-full text-left p-3.5 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 dark:bg-purple-900/20 border-l-4 border-purple-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-extrabold text-xs shrink-0 mt-0.5">
                        {c.company_name?.slice(0, 2).toUpperCase() || 'CP'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {c.company_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 font-medium truncate mt-0.5">
                          <User size={11} className="shrink-0" />
                          <span className="truncate">{primaryUser}</span>
                          {userCount > 1 && <span className="text-[10px] text-slate-400">+{userCount - 1}</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-1">
                          {lastMsg ? lastMsg.message : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium shrink-0 mt-1">
                      {c.messages?.length || 0}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* AREA 2: Live Support Chat Thread (cols 4-8 or 4-9 on lg/xl) */}
        <div
          className={`lg:col-span-5 xl:col-span-6 flex flex-col justify-between h-full bg-slate-50/30 dark:bg-slate-950/20 border-r border-slate-200 dark:border-slate-800 ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-600/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm shrink-0">
                    {activeConv.company_name?.slice(0, 2).toUpperCase() || 'CP'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {activeConv.company_name}
                      </h3>
                      <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        {activeConv.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <span>Users:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {activeConv.users?.length > 0
                          ? activeConv.users.map((u) => u.name).join(', ')
                          : 'No users registered yet'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck size={12} />
                    <span>Isolated Thread</span>
                  </div>
                  {/* Shortcut to switch to Details on tablet */}
                  <button
                    onClick={() => setMobileTab('details')}
                    className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900"
                    title="View Company Users"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[440px]">
                {(!activeConv.messages || activeConv.messages.length === 0) ? (
                  <div className="text-center py-16 px-4">
                    <MessageSquare size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      No support messages exchanged with {activeConv.company_name} yet.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Send a message below to initiate communication with their team.
                    </p>
                  </div>
                ) : (
                  activeConv.messages.map((m) => {
                    const isAdmin = m.sender_role === 'admin' || m.sender_type === 'admin' || m.is_admin || m.sender_name === 'Platform Admin';
                    const senderName = isAdmin ? 'Platform Admin' : (m.sender_name || m.user_name || activeConv.company_name);

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                          <span className={`font-semibold ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {senderName}
                          </span>
                          <span>•</span>
                          <span>
                            {m.created_at
                              ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'Recent'}
                          </span>
                        </div>
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isAdmin
                              ? 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {m.message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeConv.company_name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Send size={13} />
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 p-8">
              Select a tenant company from the channels list to view and reply to support inquiries.
            </div>
          )}
        </div>

        {/* AREA 3: Tenant Organization & Registered Users Profile (cols 9-12 on lg/xl) */}
        <div
          className={`lg:col-span-4 xl:col-span-3 p-4 sm:p-5 flex flex-col justify-between space-y-5 bg-white dark:bg-slate-900/90 overflow-y-auto ${
            mobileTab === 'details' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeConv ? (
            <div className="space-y-5">
              {/* Profile Card Header */}
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-600/20 shrink-0">
                    {activeConv.company_name?.slice(0, 2).toUpperCase() || 'CP'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {activeConv.company_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {activeConv.industry || 'Technology'} • {activeConv.size || '100-500'}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {activeConv.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Memory Isolation Info */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                  <ShieldCheck size={14} />
                  <span>Isolation Bank</span>
                </div>
                <code className="block px-2 py-1 rounded bg-purple-600/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold break-all">
                  dealmemory-{activeConv.company_id}
                </code>
              </div>

              {/* Registered Users Section (Explicitly requested by user) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-purple-600 dark:text-purple-400" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Registered Users ({activeConv.users?.length || 0})
                    </h5>
                  </div>
                  <span className="text-[10px] text-slate-400">Team Seats</span>
                </div>

                <div className="space-y-2">
                  {(!activeConv.users || activeConv.users.length === 0) ? (
                    <div className="p-3 text-center bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-400">No users registered for this company.</p>
                    </div>
                  ) : (
                    activeConv.users.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name?.slice(0, 1).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                            <a
                              href={`mailto:${u.email}`}
                              className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 truncate"
                            >
                              <Mail size={11} className="shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </a>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            {u.role || 'Member'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                            {u.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* View Full Company Link */}
              <div className="pt-2">
                <NavLink
                  to={`/admin/companies/${activeConv.company_id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  <Building2 size={13} />
                  <span>View Full Organization Hub</span>
                  <ExternalLink size={12} />
                </NavLink>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              Select a channel to view company users and metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
