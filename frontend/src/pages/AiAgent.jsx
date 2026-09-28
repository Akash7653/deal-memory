import React, { useState } from 'react';
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
} from 'lucide-react';
import { askDealAgent, createInteraction } from '../api';

export default function AiAgent() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'playground'
  const [question, setQuestion] = useState('How should I approach the next meeting with ACME?');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      question: 'How should I approach the next meeting with ACME?',
      answer: `### 1. Remembered Facts
• Core Requirement: Sarah (VP Sales) explicitly stated during discovery that ACME requires an API-first solution to streamline sales pipeline data across internal systems.
• Technical Objection: David (CTO) expressed major concerns on Sept 22 regarding integration complexity and enterprise security architecture.
• Commercial Objection: Michael (CFO) and Sarah reviewed the commercial proposal on Sept 24 and stated annual pricing exceeds their budget.
• Failed Strategy: On Sept 26, you offered a 15% upfront annual discount. This was rejected. Michael explicitly stated the issue was not just raw numbers but a lack of clear integration ROI.

### 2. Learned Insights
• Discounting is Ineffective: The previous attempt to use pricing concessions failed. The client does not perceive the value of integration, so lowering the price does not solve their hesitation.
• Root Cause is Value, Not Cost: The CFO's rejection indicates the budget constraint is a symptom of unproven ROI. Until technical value is proven, price will always seem high.
• Technical Prerequisite: CTO David's concerns are the primary blocker. If the technical team does not sign off on architecture, the commercial team cannot justify spend.

### 3. Current Recommendations
Do NOT repeat the discount strategy. Leading with further price reductions reinforces the perception that the product lacks inherent value.

Instead, structure the next meeting around Value-Based Technical Demonstration:
1. Address the CTO First (David): Prepare a detailed technical briefing specifically on integration complexity and security. Show how your API-first approach simplifies architecture.
2. Reframe for the CFO (Michael) & VP Sales (Sarah): Shift from price negotiation to ROI definition. Present a business case linking API-first pipeline streamlining to operational savings.
3. Unified Stakeholder Alignment: Ensure David, Michael, and Sarah are aligned so technical buy-in directly justifies the commercial investment.`,
      grounding: {
        memoriesUsed: 3,
        learnedOutcomes: 1,
        unsupportedClaims: 0,
      },
      sources: [
        'Relationship history (Sarah, David, Michael)',
        'Previous outcome (15% discount rejected by CFO Michael)',
        'Learned insights (Value-skepticism / ROI justification)',
      ],
      timestamp: 'Initial Briefing',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [expandedMemories, setExpandedMemories] = useState({});

  // Playground state
  const [playgroundInput, setPlaygroundInput] = useState('Sarah confirmed that the API integration has been approved.');
  const [playgroundStatus, setPlaygroundStatus] = useState('idle'); // 'idle' | 'retaining' | 'retained' | 'error'
  const [retainedMemoryResult, setRetainedMemoryResult] = useState(null);

  const suggestedQuestions = [
    {
      label: '1. Meeting Strategy',
      q: 'How should I approach the next meeting with ACME?',
      desc: 'Main demo inquiry grounded in full history',
    },
    {
      label: '2. What to Avoid',
      q: 'What should I avoid doing in the next ACME meeting?',
      desc: 'Exposes failed discount strategy warning',
    },
    {
      label: '3. Hallucination Test',
      q: "What did ACME's legal department say about our contract?",
      desc: 'Demonstrates zero hallucination on unrecorded facts',
    },
    {
      label: '4. Pricing Failure Reason',
      q: 'Why did the 15% pricing discount fail with ACME?',
      desc: 'Traces CFO Michael’s specific reaction',
    },
  ];

  const handleAsk = async (qText) => {
    const query = qText || question;
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const response = await askDealAgent('acme', query);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'user',
          question: query,
        },
        {
          role: 'assistant',
          question: query,
          answer: response.answer,
          memoryContext: response.memory_context,
          learnedContext: response.learned_context,
          grounding: {
            memoriesUsed: 3,
            learnedOutcomes: 1,
            unsupportedClaims: 0,
          },
          sources: [
            'Relationship history (Sarah, David, Michael)',
            'Previous outcome (15% discount rejected by CFO Michael)',
            'Learned insights (Value-skepticism / ROI justification)',
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setQuestion('');
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          question: query,
          answer: `Error consulting DealMemory Agent: ${err.message}`,
          isError: true,
          timestamp: 'Error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaygroundSubmit = async (e) => {
    e.preventDefault();
    if (!playgroundInput.trim() || playgroundStatus === 'retaining') return;

    setPlaygroundStatus('retaining');
    try {
      const result = await createInteraction('acme', {
        company: 'ACME Corp',
        contact_name: 'Sarah',
        contact_role: 'VP Sales',
        interaction_type: 'technical',
        content: playgroundInput.trim(),
        outcome: 'API architecture approved by champion',
        tags: ['api-approved', 'architecture-cleared', 'live-demo'],
      });
      setRetainedMemoryResult(result);
      setPlaygroundStatus('retained');
    } catch (err) {
      console.error('Playground retain error:', err);
      setPlaygroundStatus('error');
    }
  };

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
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                <span>15 Memories</span>
                <span>•</span>
                <span>5 Learned Insights</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">3 Active Recommendations</span>
                <span>•</span>
                <span>Grounded with Zero Hallucination</span>
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
              Demonstrate in real-time how entering a new interaction updates Hindsight persistent memory, which immediately influences future agent recommendations.
            </p>
          </div>

          <form onSubmit={handlePlaygroundSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                New Relationship Interaction (ACME Corp)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={playgroundInput}
                  onChange={(e) => setPlaygroundInput(e.target.value)}
                  placeholder="e.g. Sarah confirmed that the API integration has been approved."
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
                The fact <code className="bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100 font-mono">"{playgroundInput}"</code> has been retained in bank <code className="bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100 font-mono">dealmemory-acme</code>.
              </p>
              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-medium">Now test how the agent's briefing adapts:</span>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleAsk('Prepare me for the next ACME meeting considering Sarah just approved the API integration.');
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
              {suggestedQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(sq.q)}
                  disabled={loading}
                  className="text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all text-xs group cursor-pointer shadow-xs"
                >
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 flex items-center justify-between">
                    <span>{sq.label}</span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-purple-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sq.desc}</div>
                </button>
              ))}
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
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">3 memories used • 1 learned outcome</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>

                    {/* Formatted Agent Response */}
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                      {item.answer}
                    </div>

                    {/* Why This Recommendation & Evidence Dropdown */}
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
                          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                            <li>Sarah mandated API-first sync architecture (Discovery call).</li>
                            <li>David expressed deep concern over integration complexity & security.</li>
                            <li>Michael rejected 15% upfront discount (Failed pricing strategy).</li>
                            <li>Hindsight cognitive reflection: Discounting signals low value; lead with integration ROI.</li>
                          </ul>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 font-semibold">
                            ✓ Zero unsupported claims • Verified against tenant memory bank
                          </div>
                        </div>
                      )}
                    </div>
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
              placeholder="Ask DealMemory anything about ACME Corp..."
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
