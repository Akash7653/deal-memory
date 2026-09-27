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
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  ShieldAlert,
} from 'lucide-react';
import { askDealAgent } from '../api';

export default function AiAgent() {
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

### 3. Recommendations
Do NOT repeat the discount strategy. Leading with further price reductions reinforces the perception that the product lacks inherent value.

Instead, structure the next meeting around Value-Based Technical Demonstration:
1. Address the CTO First (David): Prepare a detailed technical briefing specifically on integration complexity and security. Show how your API-first approach simplifies architecture.
2. Reframe for the CFO (Michael) & VP Sales (Sarah): Shift from price negotiation to ROI definition. Present a business case linking API-first pipeline streamlining to operational savings.
3. Unified Stakeholder Alignment: Ensure David, Michael, and Sarah are aligned so technical buy-in directly justifies the commercial investment.`,
      sources: [
        'Relationship history (Sarah, David, Michael)',
        'Previous outcome (15% discount rejected by CFO)',
        'Learned insights (Value-skepticism / ROI justification)',
      ],
      timestamp: 'Initial Briefing',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [expandedMemories, setExpandedMemories] = useState({});

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
          sources: [
            'Relationship history (Sarah, David, Michael)',
            'Previous outcome (15% discount rejected by CFO)',
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

  const toggleMemoryDrawer = (idx) => {
    setExpandedMemories((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/20 flex-shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  DealMemory Sales Agent
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Ask about ACME Corp. The agent checks persistent Hindsight memories and past outcomes before answering.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Database size={13} className="text-sky-400" />
              <span>Hindsight 0.10.1 + Groq</span>
            </div>
          </div>
        </div>

        {/* Suggested Quick Inquiries with Labels */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            60-Second Demo Inquiries:
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(sq.q);
                  handleAsk(sq.q);
                }}
                disabled={loading}
                className="text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{sq.label}</span>
                  <span className="text-[10px] text-sky-400 font-normal">Click to Ask →</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                  "{sq.q}"
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {sq.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-4">
        {chatHistory.map((item, idx) => (
          <div key={idx} className="space-y-2">
            {item.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-xl bg-sky-600 text-white p-3.5 rounded-2xl rounded-tr-none text-xs font-semibold shadow-md">
                  {item.question}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
                {/* Compact Hindsight Memory Source Panel */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Database size={14} className="text-sky-400" />
                    <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
                      Hindsight Memory Used:
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <span>✓ Relationship history</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <span>✓ Previous outcome (Failed 15% discount)</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <span>✓ Learned insights</span>
                    </span>
                  </div>
                </div>

                {/* Structured Answer */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                  {item.answer}
                </div>

                {/* Recalled Memories Drawer Toggle */}
                {item.memoryContext && item.memoryContext.memories && (
                  <div className="pt-2 border-t border-slate-850">
                    <button
                      onClick={() => toggleMemoryDrawer(idx)}
                      className="flex items-center space-x-1.5 text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                      <Database size={12} />
                      <span>
                        {expandedMemories[idx] ? 'Hide' : 'Inspect'} {item.memoryContext.memories.length} recalled Hindsight memories
                      </span>
                      {expandedMemories[idx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {expandedMemories[idx] && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-[11px]">
                        <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          Grounding Evidence in Memory Bank:
                        </div>
                        {item.memoryContext.memories.slice(0, 5).map((mem, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2 rounded bg-slate-900 border border-slate-850 text-slate-300 flex items-start space-x-2"
                          >
                            <span className="text-sky-400 font-bold">#{mIdx + 1}</span>
                            <span className="leading-relaxed">{mem.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2.5 animate-pulse">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold">
              <Sparkles size={14} className="animate-spin" />
              <span>Querying Hindsight memory bank & synthesizing grounded intelligence...</span>
            </div>
            <div className="h-3 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-2 shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask DealMemory about ACME (e.g., 'How should I approach the next meeting?')..."
            className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-sky-600/20 transition-all flex-shrink-0"
          >
            <span>Ask</span>
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
