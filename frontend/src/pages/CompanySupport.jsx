import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  RefreshCw,
  User,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { fetchCompanySupportMessages, sendCompanySupportMessage } from '../api';
import { useAuth } from '../context/AuthContext';

export default function CompanySupport() {
  const { user, company } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchCompanySupportMessages();
      setMessages(data);
    } catch (e) {
      console.error('Failed to load support messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      await sendCompanySupportMessage(inputText.trim());
      setInputText('');
      await loadMessages();
    } catch (e) {
      alert(e.message || 'Failed to send message to platform admin.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Support Chat
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Admin Support
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Direct operational support channel with DealMemory platform engineers.
          </p>
        </div>

        <button
          onClick={loadMessages}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Critical Isolation Distinction Callout */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs">
        <HelpCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-slate-100">
            Support Chat vs. DealMemory AI
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This chat is strictly for technical and administrative inquiries with DealMemory administrators. Messages sent here <strong>never enter your sales-learning Hindsight memory</strong>. For sales deal recommendations, use the <a href="/agent" className="text-purple-600 dark:text-purple-400 font-semibold underline">DealMemory AI Agent</a>.
          </p>
        </div>
      </div>

      {/* Chat Box Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              DealMemory Platform Support
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Company: {company?.name || 'TechNova Solutions'}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
          {loading && messages.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No support messages yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Need help setting up integration or importing deals? Ask us below!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isAdmin = m.sender_type === 'admin' || m.is_admin;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {isAdmin ? 'DealMemory Platform Admin' : (m.user_name || user?.name || 'You')}
                    </span>
                    <span>•</span>
                    <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      isAdmin
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700/80 shadow-xs'
                        : 'bg-purple-600 text-white rounded-br-xs shadow-xs'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
          <input
            type="text"
            placeholder="Type your support message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-all"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
          >
            <Send size={13} />
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
