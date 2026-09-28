import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Building2,
  RefreshCw,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchAdminConversations, sendAdminSupportMessage } from '../../api';

export default function AdminConversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminConversations();
      setConversations(data);
      if (data.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(data[0].company_id);
      }
    } catch (e) {
      console.error('Failed to load support conversations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeConv = conversations.find((c) => c.company_id === selectedCompanyId);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedCompanyId) return;

    setSending(true);
    try {
      await sendAdminSupportMessage(selectedCompanyId, replyText.trim());
      setReplyText('');
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Support Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Admin ↔ Company
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Direct operational support channel. Strictly isolated from the Hindsight sales-learning loop.
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

      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
        {/* Company List Column */}
        <div className="border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Tenant Companies ({conversations.length})
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto max-h-[480px]">
            {loading && conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading channels...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No active support threads.</div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.company_id}
                  onClick={() => setSelectedCompanyId(c.company_id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between transition-colors ${
                    selectedCompanyId === c.company_id
                      ? 'bg-purple-500/10 dark:bg-purple-900/20 border-l-4 border-purple-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs shrink-0">
                      {c.company_name?.slice(0, 2).toUpperCase() || 'CP'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {c.company_name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {c.messages?.[c.messages.length - 1]?.message || 'No messages'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium shrink-0">
                    {c.messages?.length || 0}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation Pane */}
        <div className="md:col-span-2 flex flex-col justify-between h-full bg-slate-50/30 dark:bg-slate-950/20">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeConv.company_name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tenant ID: <span className="font-mono">{activeConv.company_id}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <ShieldCheck size={12} />
                  <span>Isolated Support Thread</span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[380px]">
                {(!activeConv.messages || activeConv.messages.length === 0) ? (
                  <p className="text-center py-12 text-xs text-slate-400">
                    No messages in this support conversation yet. Send a greeting below!
                  </p>
                ) : (
                  activeConv.messages.map((m) => {
                    const isAdmin = m.sender_type === 'admin' || m.is_admin;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {isAdmin ? 'Platform Admin' : (m.user_name || activeConv.company_name)}
                          </span>
                          <span>•</span>
                          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
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
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
                >
                  <Send size={13} />
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a company from the list to view and reply to support inquiries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
