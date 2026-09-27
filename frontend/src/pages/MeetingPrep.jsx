import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarCheck2,
  Users,
  AlertOctagon,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
  Building,
  Target,
  Bot,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { fetchMeetingPrep } from '../api';

export default function MeetingPrep() {
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrep = () => {
    setLoading(true);
    fetchMeetingPrep('acme')
      .then((data) => {
        setPrepData(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPrep();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Executive Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarCheck2 size={15} />
              <span>Executive Briefing</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                NEXT MEETING: ACME Corp
              </h1>
              <span className="text-lg font-bold text-sky-400">$120,000 ARR</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Synthesized from persistent Hindsight relationship memory & past strategy outcomes.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={loadPrep}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs border border-slate-700 transition-colors"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Regenerate Brief</span>
            </button>
            <Link
              to="/agent"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-sky-600/20 transition-all"
            >
              <Bot size={15} />
              <span>Ask Agent</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Sparkles size={24} className="mx-auto text-sky-400 animate-spin" />
          <div className="text-white font-medium text-sm">
            Recalling memories & synthesizing executive meeting intelligence...
          </div>
          <div className="text-slate-400 text-xs">
            Hindsight reflect() evaluating past failures against upcoming strategy
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-2xl text-xs text-rose-300 space-y-2">
          <div className="font-bold">Error loading meeting prep:</div>
          <div>{error}</div>
          <button
            onClick={loadPrep}
            className="px-3 py-1.5 bg-rose-600/30 text-rose-200 rounded border border-rose-500/40 mt-2"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 4 Pillars: WHAT CHANGED, WHAT WE LEARNED, WHAT TO DO, WHAT TO AVOID */}

          {/* 1. WHAT CHANGED */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                <Layers size={15} />
                <span>1. What Changed in the Deal</span>
              </span>
              <span className="text-xs text-slate-400">Account Dynamics</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {prepData.relationship_summary ||
                'The engagement progressed from discovery into technical evaluation. Functional alignment on API-first data sync exists with Sarah (VP Sales), but CTO David introduced major architectural security concerns, and CFO Michael rejected our 15% discount offer.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                <div className="text-[11px] font-bold text-white">Sarah — VP Sales</div>
                <div className="text-[10px] text-sky-400 font-medium">Business Champion</div>
                <p className="text-[11px] text-slate-400">Needs API-first sync to unify internal pipeline data.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                <div className="text-[11px] font-bold text-white">David — CTO</div>
                <div className="text-[10px] text-amber-400 font-medium">Technical Blocker</div>
                <p className="text-[11px] text-slate-400">Concerned about webhook latency and enterprise security.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                <div className="text-[11px] font-bold text-white">Michael — CFO</div>
                <div className="text-[10px] text-rose-400 font-medium">Budget Gatekeeper</div>
                <p className="text-[11px] text-slate-400">Rejected 15% discount due to unproven integration ROI.</p>
              </div>
            </div>
          </div>

          {/* 2. WHAT WE LEARNED (From Failed Outcomes) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                <Lightbulb size={15} />
                <span>2. What Hindsight Learned (Past Failure Analysis)</span>
              </span>
              <span className="text-xs text-rose-400 font-bold uppercase">
                15% Discount Failed
              </span>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <XCircle size={15} className="text-rose-400" />
                <span>Why the Previous Discount Strategy Backfired:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Attempting to overcome Michael's budget objection with a price cut failed because the customer viewed cost as an ROI and risk question, not raw dollar amounts. Discounting made the product look less valuable without addressing the CTO's technical hesitation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">
                Core Cognitive Takeaways:
              </div>
              <ul className="space-y-2">
                {(prepData.learned_insights && prepData.learned_insights.length > 0
                  ? prepData.learned_insights
                  : [
                      'Price is a proxy for value; the customer is value-skeptical rather than price-sensitive.',
                      'Technical buy-in from CTO David is mandatory as security holds equal weight to pricing.',
                      'The discount strategy failed because it treated pricing as raw numbers rather than ROI justification.',
                    ]
                ).map((insight, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-200 flex items-start space-x-2 bg-slate-950/80 p-3 rounded-xl border border-slate-850"
                  >
                    <span className="text-purple-400 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3 & 4: WHAT TO DO vs WHAT TO AVOID */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 3. WHAT TO DO (Recommended Focus) */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 pb-2 border-b border-slate-800">
                <CheckCircle size={15} />
                <span>3. What to Do (Recommended Focus)</span>
              </div>

              <div className="space-y-2.5">
                {[
                  'Build an ROI business case: Quantify manual pipeline sync cost reductions for Michael (CFO).',
                  'Technical deep-dive with David: Present enterprise architecture security documentation to remove CTO blocker.',
                  'Align all three stakeholders: Connect Sarah’s pipeline requirements directly to the technical solution.',
                  'Shift from pricing negotiations to value verification.',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-200 flex items-start space-x-2.5"
                  >
                    <span className="font-black text-emerald-400 flex-shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. WHAT TO AVOID */}
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-rose-400 pb-2 border-b border-slate-800">
                <ShieldAlert size={15} />
                <span>4. What to Avoid (Crucial Pitfalls)</span>
              </div>

              <div className="space-y-2.5">
                {[
                  'Do NOT offer further discounting or use price cuts as a crutch.',
                  'Do NOT repeat the failed pricing strategy that CFO Michael already rejected.',
                  'Do NOT ignore David’s security architecture concerns before commercial discussions.',
                  'Do NOT treat price as the root problem; it is a symptom of unproven ROI.',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-200 flex items-start space-x-2.5"
                  >
                    <span className="font-bold text-rose-400 flex-shrink-0">⚠</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900 border border-sky-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-white font-bold text-sm">
                Ready to simulate the meeting?
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Consult the DealMemory Agent on exact talking points grounded in these memories.
              </p>
            </div>
            <Link
              to="/agent"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-sky-600/20 transition-all self-start sm:self-center"
            >
              <span>Ask DealMemory Agent →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
