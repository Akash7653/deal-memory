import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  RefreshCw,
  User,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  PhoneOff,
  Download,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import {
  fetchCompanySupportMessages,
  sendCompanySupportMessage,
  endCompanySupportSession,
  clearCompanySupportMessages
} from '../api';
import { useAuth } from '../context/AuthContext';

export default function CompanySupport() {
  const { user, company } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const messagesEndRef = useRef(null);

  const loadMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchCompanySupportMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load support messages:', e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load + silent auto-refresh every 3 seconds
  useEffect(() => {
    loadMessages(false);
    const interval = setInterval(() => {
      loadMessages(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setSending(true);
    try {
      await sendCompanySupportMessage(messageText);
      setInputText('');
      await loadMessages(true);
    } catch (e) {
      alert(e.message || 'Failed to send message to platform admin.');
    } finally {
      setSending(false);
    }
  };

  // End active support session
  const handleEndChat = async () => {
    if (
      !window.confirm(
        'Are you sure you want to end this support session? A closure notice will be recorded, and you can send a message at any time to reopen.'
      )
    ) {
      return;
    }

    setActionInProgress(true);
    try {
      await endCompanySupportSession();
      await loadMessages(true);
    } catch (e) {
      alert(e.message || 'Failed to end support session.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Save / export chat transcript as text file
  const handleSaveChat = () => {
    if (!messages || messages.length === 0) {
      alert('No support messages to export yet.');
      return;
    }

    const companyTitle = company?.name || user?.company_name || user?.company || 'Workspace';
    const lines = [
      '=======================================================',
      'DEALMEMORY OPERATIONAL SUPPORT CHAT TRANSCRIPT',
      `Company: ${companyTitle}`,
      `Exported: ${new Date().toLocaleString()}`,
      `Total Messages: ${messages.length}`,
      '=======================================================\n',
    ];

    messages.forEach((m) => {
      const isSys = m.sender_role === 'system';
      const isAdm =
        m.sender_role === 'admin' ||
        m.sender_type === 'admin' ||
        m.is_admin === true ||
        m.sender_name === 'Platform Admin' ||
        m.sender_name === 'DealMemory Platform Admin';

      const sender = isSys
        ? '[SYSTEM]'
        : isAdm
        ? 'DealMemory Platform Admin'
        : m.sender_name || m.user_name || user?.name || 'You';

      const time = m.created_at ? new Date(m.created_at).toLocaleString() : 'Recent';
      lines.push(`[${time}] ${sender}:`);
      lines.push(`${m.message}\n`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealmemory-support-${companyTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear chat history
  const handleClearChat = async () => {
    if (
      !window.confirm(
        'Clear all conversation history from this workspace? All current messages will be removed. (Tip: You can use "Save Chat" to download a transcript first).'
      )
    ) {
      return;
    }

    setActionInProgress(true);
    try {
      await clearCompanySupportMessages();
      await loadMessages(true);
    } catch (e) {
      alert(e.message || 'Failed to clear chat.');
    } finally {
      setActionInProgress(false);
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
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Auto-Sync</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Direct operational support channel with DealMemory platform engineers.
          </p>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSaveChat}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-40"
            title="Download full chat transcript"
          >
            <Download size={13} />
            <span>Save Chat</span>
          </button>

          <button
            onClick={handleEndChat}
            disabled={actionInProgress || messages.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors shadow-2xs cursor-pointer disabled:opacity-40"
            title="End active support conversation session"
          >
            <PhoneOff size={13} />
            <span>End Chat</span>
          </button>

          <button
            onClick={() => loadMessages(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            title="Force refresh chat"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
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
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[530px]">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              DealMemory Platform Support
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-medium">
              Company: {company?.name || user?.company_name || user?.company || 'Your Workspace'}
            </span>
            <button
              onClick={handleClearChat}
              disabled={actionInProgress || messages.length === 0}
              className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors disabled:opacity-30 cursor-pointer"
              title="Clear conversation history"
            >
              <Trash2 size={11} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
          {loading && messages.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No support messages yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Need help setting up integration or importing deals? Ask us below!</p>
            </div>
          ) : (
            messages.map((m) => {
              // System Message
              if (m.sender_role === 'system') {
                return (
                  <div key={m.id} className="flex justify-center my-2.5">
                    <div className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 size={12} className="text-amber-500" />
                      <span>{m.message}</span>
                    </div>
                  </div>
                );
              }

              const isAdmin =
                m.sender_role === 'admin' ||
                m.sender_type === 'admin' ||
                m.is_admin === true ||
                m.sender_name === 'Platform Admin' ||
                m.sender_name === 'DealMemory Platform Admin';

              const senderLabel = isAdmin
                ? 'DealMemory Platform Admin'
                : (m.sender_name || m.user_name || (user?.company_id === m.company_id ? user?.name : 'Company User') || 'You');

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    {isAdmin && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-0.5" />
                    )}
                    <span className={`font-semibold ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {senderLabel}
                    </span>
                    <span>•</span>
                    <span>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isAdmin
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700/80 shadow-xs'
                        : 'bg-purple-600 text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
          <input
            type="text"
            placeholder="Type your support message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
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
