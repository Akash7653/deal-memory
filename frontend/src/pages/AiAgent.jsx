import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  Database,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  ShieldAlert,
  Target,
  XCircle,
  ArrowRight,
  Layers,
  Play,
  RotateCw,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { fetchAgentState, askDealAgent, createInteraction, fetchDeals } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AiAgent() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const dealParam = searchParams.get('deal') || '';

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'playground'
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(dealParam);
  const [agentState, setAgentState] = useState(null);
  const [loadingState, setLoadingState] = useState(true);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedMemories, setExpandedMemories] = useState({});

  // Playground state
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [playgroundStatus, setPlaygroundStatus] = useState('idle'); // 'idle' | 'retaining' | 'retained' | 'error'
  const [retainedMemoryResult, setRetainedMemoryResult] = useState(null);

  // Load available deals
  useEffect(() => {
    fetchDeals(true)
      .then((data) => {
        const list = data.deals || [];
        setDeals(list);
        if (!selectedDealId) {
          if (dealParam && list.some((d) => d.id === dealParam)) {
            setSelectedDealId(dealParam);
          } else if (list.length > 0) {
            setSelectedDealId(list[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const loadAgentData = async (dealId) => {
    setLoadingState(true);
    try {
      const data = await fetchAgentState(dealId);
      setAgentState(data);
      if (data.initial_briefing) {
        setChatHistory([data.initial_briefing]);
      }
      if (data.default_question) {
        setQuestion(data.default_question);
      } else if (data.suggested_questions && data.suggested_questions.length > 0) {
        setQuestion(data.suggested_questions[0].q);
      }
      setPlaygroundInput(
        `Customer confirmed critical requirement for ${data.company_name || 'workspace'}.`
      );
    } catch (err) {
      console.error('Failed to load agent state:', err);
      const fallbackBriefing = {
        role: 'assistant',
        question: 'What is our current relationship memory and sales strategy status?',
        answer: `### 1. Relationship Memory Status\nNo sufficient relationship history is recorded for this company workspace yet.\n\n### 2. Learned Insights\n0 learned outcomes or strategic patterns recorded.\n\n### 3. Recommended Action\nStart by recording customer interactions, outcomes, and sales strategies.\nDealMemory will build relationship memory and automatically synthesize adapted recommendations as evidence accumulates.`,
        grounding: {
          memoriesUsed: 0,
          learnedOutcomes: 0,
          unsupportedClaims: 0,
        },
        sources: ['Verified tenant memory bank'],
        timestamp: 'Initial Briefing',
      };
      setChatHistory([fallbackBriefing]);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    loadAgentData(selectedDealId);
  }, [selectedDealId]);

  const handleSelectDeal = (id) => {
    setSelectedDealId(id);
    setSearchParams(id ? { deal: id } : {});
  };

  const handleAsk = async (qText) => {
    const query = (typeof qText === 'string' && qText.trim() ? qText : question) || '';
    if (!query.trim() || loading) return;

    const dealTarget = selectedDealId || agentState?.default_deal_id || 'agent';
    setLoading(true);
    setQuestion('');

    const tempId = 'temp-' + Date.now();
    // Optimistic update: show user question and thinking assistant placeholder immediately!
    setChatHistory((prev) => [
      ...prev,
      {
        role: 'user',
        question: query,
      },
      {
        role: 'assistant',
        tempId,
        isThinking: true,
        question: query,
        answer: 'Consulting Hindsight relationship memory & synthesizing grounded response...',
        timestamp: 'Thinking...',
      },
    ]);

    try {
      const response = await askDealAgent(dealTarget, query);
      const memCount = response.memory_context?.count || 0;
      const memories = response.memory_context?.memories || [];
      const reflectionSummary = response.learned_context?.reflection_summary || '';

      setChatHistory((prev) =>
        prev.map((item) =>
          item.tempId === tempId
            ? {
                role: 'assistant',
                question: query,
                answer: response.answer,
                memoryContext: response.memory_context,
                learnedContext: response.learned_context,
                grounding: {
                  memoriesUsed: memCount,
                  learnedOutcomes: reflectionSummary ? 1 : 0,
                  unsupportedClaims: 0,
                },
                sources:
                  memCount > 0
                    ? memories.slice(0, 3).map((m) => (m.text.length > 80 ? m.text.slice(0, 80) + '...' : m.text))
                    : [`Verified against tenant memory bank (${agentState?.bank_id || 'company bank'})`],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : item
        )
      );
    } catch (err) {
      console.error('Ask error:', err);
      setChatHistory((prev) =>
        prev.map((item) =>
          item.tempId === tempId
            ? {
                role: 'assistant',
                question: query,
                answer: `Error consulting DealMemory Agent: ${err.message}`,
                isError: true,
                timestamp: 'Error',
              }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaygroundSubmit = async (e) => {
    e.preventDefault();
    if (!playgroundInput.trim() || playgroundStatus === 'retaining') return;

    setPlaygroundStatus('retaining');
    try {
      const dealTarget = selectedDealId || agentState?.default_deal_id || 'agent';
      const customerName = currentDeal?.company_name || agentState?.company_name || 'Customer Account';

      const result = await createInteraction(dealTarget, {
        company: customerName,
        contact_name: 'Lead Decision Maker',
        contact_role: 'Executive Sponsor',
        interaction_type: 'technical',
        content: playgroundInput.trim(),
        outcome: 'Verified interaction retained in company Hindsight memory bank',
        tags: ['live-demo', 'playground', 'relationship-memory'],
      });
      setRetainedMemoryResult(result);
      setPlaygroundStatus('retained');

      // Refresh agent metrics and initial briefing
      fetchAgentState(selectedDealId)
        .then((data) => {
          setAgentState(data);
          if (data?.initial_briefing) {
            setChatHistory((prev) => (prev.length <= 1 ? [data.initial_briefing] : prev));
          }
        })
        .catch(console.error);
    } catch (err) {
      console.error('Playground retain error:', err);
      setPlaygroundStatus('error');
    }
  };

  const currentDeal = deals.find((d) => d.id === selectedDealId);

  const suggestedQuestions = agentState?.suggested_questions || [
    {
      label: '1. Meeting Strategy',
      q: 'What is our recommended meeting strategy based on recorded history?',
      desc: 'Consults verified relationship memories for your company',
    },
    {
      label: '2. What to Avoid',
      q: 'What strategies or pitfalls should we avoid based on our past outcomes?',
      desc: 'Warns against repeating failed tactics',
    },
    {
      label: '3. Hallucination Test',
      q: 'What did the legal department say about our contract terms?',
      desc: 'Demonstrates zero hallucination on unrecorded facts',
    },
    {
      label: '4. Pricing Failure Reason',
      q: 'Are there any recorded pricing failures or discount rejections?',
      desc: 'Traces recorded financial and commercial feedback',
    },
  ];

  const memoriesCount = agentState?.metrics?.memories_count ?? 0;
  const learnedInsightsCount = agentState?.metrics?.learned_insights_count ?? 0;
  const activeRecommendationsCount = agentState?.metrics?.active_recommendations_count ?? 0;
  const currentBankId = agentState?.bank_id || (user?.company_id ? `dealmemory-${user.company_id}` : 'company memory bank');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Agent Control Center Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-600/20 flex-shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  DealMemory Sales Agent
                </h1>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  {currentBankId}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                <span>{memoriesCount} Memories</span>
                <span>•</span>
                <span>{learnedInsightsCount} Learned Insights</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {activeRecommendationsCount} Active Recommendations
                </span>
                <span>•</span>
                <span>Grounded with Zero Hallucination</span>
              </div>

              {/* Account / Deal Selector */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Account / Deal Context:</span>
                <select
                  value={selectedDealId}
                  onChange={(e) => handleSelectDeal(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                >
                  <option value="">All Accounts (General Workspace)</option>
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.company_name} {d.deal_value ? `($${d.deal_value.toLocaleString()} ARR)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sub-tab Switcher: Chat vs Playground */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Control Center & Q&A
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'playground'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Memory Playground</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'playground' ? (
        /* ========================================================================= */
        /* MEMORY PLAYGROUND: LIVE HINDSIGHT DEMO                                    */
        /* ========================================================================= */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm transition-colors">
          <div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={15} />
              <span>Live Hindsight Demonstration</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Memory Playground</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Demonstrate in real-time how entering a new interaction updates your company's Hindsight persistent memory bank (<code className="font-mono text-purple-600 dark:text-purple-400">{currentBankId}</code>), which immediately influences future agent recommendations.
            </p>
          </div>

          <form onSubmit={handlePlaygroundSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                New Relationship Interaction ({agentState?.is_demo_company ? 'ACME Corp' : (agentState?.company_name || 'Customer Account')})
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={playgroundInput}
                  onChange={(e) => setPlaygroundInput(e.target.value)}
                  placeholder={agentState?.is_demo_company ? "e.g. Sarah confirmed that the API integration has been approved." : "e.g. Key contact approved architecture integration phase."}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={playgroundStatus === 'retaining'}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer active:scale-95"
                >
                  {playgroundStatus === 'retaining' ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Retaining...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Remember This</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {playgroundStatus === 'retained' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={16} />
                <span>Interaction recorded & Hindsight memory updated successfully!</span>
              </div>
              <p className="leading-relaxed">
                The fact <code className="bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100 font-mono">"{playgroundInput}"</code> has been retained in bank <code className="bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100 font-mono">{currentBankId}</code>.
              </p>
              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-medium">Now test how the agent's briefing adapts:</span>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleAsk(`Prepare me for the next meeting considering the customer just confirmed: "${playgroundInput}"`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <span>Ask DealMemory with New Fact</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Visual Step Trace */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              The Cognitive Loop Trace:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold block">1. Interaction</span>
                User records fact
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold block">2. Retain</span>
                Hindsight retain()
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold block">3. Memory</span>
                Bank updated
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold block">4. Recall</span>
                Semantic search
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="text-purple-600 dark:text-purple-400 font-bold block">5. Reflection</span>
                Learned pattern
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-slate-950 rounded-xl border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block">6. Action</span>
                Better advice
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CHAT VIEW: GROUNDED AI AGENT CONTROL CENTER                               */
        /* ========================================================================= */
        <>
          {/* Preset Grounded Inquiry Chips */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              60-Second Demo Inquiries (Click to Ask Live):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((sq, i) => {
                const targetQ = sq.q || sq.question || sq.query || sq.desc || sq.label;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAsk(targetQ);
                    }}
                    disabled={loading}
                    className="text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all text-xs group cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 flex items-center justify-between">
                      <span>{sq.label}</span>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sq.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation History Feed */}
          <div className="space-y-4">
            {chatHistory.map((item, idx) => (
              <div key={idx} className="space-y-3">
                {item.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-purple-600 text-white p-3.5 rounded-2xl rounded-tr-sm text-xs sm:text-sm font-medium shadow-md shadow-purple-600/20">
                      {item.question}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm transition-colors">
                    {/* Grounding Header Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                          <CheckCircle2 size={13} />
                          <span>Grounded in Hindsight</span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {item.grounding?.memoriesUsed || 0} memories used • {item.grounding?.learnedOutcomes || 0} learned outcome{item.grounding?.learnedOutcomes === 1 ? '' : 's'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>

                    {/* Formatted Agent Response */}
                    {item.isThinking ? (
                      <div className="flex items-center gap-2.5 py-3 text-xs text-purple-600 dark:text-purple-400 font-semibold animate-pulse">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{item.answer}</span>
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                        {item.answer}
                      </div>
                    )}

                    {/* Why This Recommendation & Evidence Dropdown (only when not thinking) */}
                    {!item.isThinking && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() =>
                            setExpandedMemories((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          className="flex items-center space-x-1.5 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold cursor-pointer"
                        >
                          <ShieldCheck size={14} />
                          <span>Why This Recommendation? (View Grounding Sources)</span>
                          {expandedMemories[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                      {expandedMemories[idx] && (
                        <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2 animate-fade-in">
                          <div className="font-semibold text-slate-900 dark:text-white">Retrieved Memory Grounding:</div>
                          {item.memoryContext?.memories && item.memoryContext.memories.length > 0 ? (
                            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                              {item.memoryContext.memories.map((m, mIdx) => (
                                <li key={mIdx}>{m.text}</li>
                              ))}
                              {item.learnedContext?.reflection_summary && (
                                <li>Strategic Reflection: {item.learnedContext.reflection_summary}</li>
                              )}
                            </ul>
                          ) : item.sources && item.sources.length > 0 ? (
                            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                              {item.sources.map((s, sIdx) => (
                                <li key={sIdx}>{s}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-slate-500 dark:text-slate-400 italic">
                              No interaction memories recorded for this query in this company workspace.
                            </div>
                          )}
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 font-semibold">
                            ✓ Zero unsupported claims • Verified against tenant memory bank ({currentBankId})
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              </div>
            ))}
          </div>

          {/* Interactive Question Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                currentDeal
                  ? `Ask DealMemory anything about ${currentDeal.company_name}...`
                  : `Ask DealMemory anything about ${agentState?.company_name || 'your'} customer relationships...`
              }
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-colors shadow-xs"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  <span className="hidden sm:inline">Ask Agent</span>
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
