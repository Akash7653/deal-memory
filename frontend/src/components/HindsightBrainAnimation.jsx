import React, { useState } from 'react';
import { Database, Sparkles, Brain, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HindsightBrainAnimation({ onlyAnimation = false }) {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'interaction',
      label: 'Interaction',
      sub: 'Customer Meeting',
      detail: 'Sarah wants API-first; David doubts security',
      x: 60,
      y: 75,
      color: '#8b5cf6', // Violet
      pulseDelay: '0s',
    },
    {
      id: 'memory',
      label: 'Hindsight Memory',
      sub: 'Persistent Bank',
      detail: 'Retains tenant facts across deal cycle',
      x: 175,
      y: 110,
      color: '#7c3aed', // Brand Violet
      pulseDelay: '0.6s',
    },
    {
      id: 'learning',
      label: 'Autonomous Learning',
      sub: 'Reflect()',
      detail: '15% discount failed: price is proxy for ROI',
      x: 290,
      y: 75,
      color: '#10b981', // Emerald
      pulseDelay: '1.2s',
    },
    {
      id: 'recommendation',
      label: 'Better Action',
      sub: 'Next Meeting Brief',
      detail: 'Do NOT discount; lead with integration ROI',
      x: 230,
      y: 195,
      color: '#059669', // Deep Emerald
      pulseDelay: '1.8s',
    },
  ];

  const svgContent = (
    <svg
      viewBox="0 0 350 240"
      className="w-full h-full select-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Violet to Emerald Gradient for Neural Paths */}
        <linearGradient id="neuralFlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="brainGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.12" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Brain Silhouette Contour in background */}
      <path
        d="M 90,110 C 60,60 120,20 175,45 C 230,20 290,60 260,110 C 290,150 250,210 175,190 C 100,210 60,150 90,110 Z"
        fill="url(#brainGlow)"
        stroke="currentColor"
        className="text-purple-200 dark:text-purple-900/40"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Synaptic Pathway 1: Interaction -> Memory */}
      <path
        d="M 60,75 Q 115,85 175,110"
        fill="none"
        stroke="url(#neuralFlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Animated Synaptic Pulse 1 */}
      <circle r="3.5" fill="#8b5cf6" filter="url(#softGlow)">
        <animateMotion
          path="M 60,75 Q 115,85 175,110"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Synaptic Pathway 2: Memory -> Learning */}
      <path
        d="M 175,110 Q 230,85 290,75"
        fill="none"
        stroke="url(#neuralFlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Animated Synaptic Pulse 2 */}
      <circle r="3.5" fill="#10b981" filter="url(#softGlow)">
        <animateMotion
          path="M 175,110 Q 230,85 290,75"
          dur="2.4s"
          begin="0.8s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Synaptic Pathway 3: Learning -> Better Recommendation */}
      <path
        d="M 290,75 Q 275,150 230,195"
        fill="none"
        stroke="url(#neuralFlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Animated Synaptic Pulse 3 */}
      <circle r="3.5" fill="#059669" filter="url(#softGlow)">
        <animateMotion
          path="M 290,75 Q 275,150 230,195"
          dur="2.4s"
          begin="1.6s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Synaptic Pathway 4: Recommendation Feedback loop back to Memory */}
      <path
        d="M 230,195 Q 185,160 175,110"
        fill="none"
        stroke="currentColor"
        className="text-slate-300 dark:text-slate-700"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Memory Nodes */}
      {nodes.map((n) => {
        const isHovered = activeNode === n.id;
        return (
          <g
            key={n.id}
            className="cursor-pointer transition-transform"
            onMouseEnter={() => setActiveNode(n.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Outer Pulsing Aura */}
            <circle
              cx={n.x}
              cy={n.y}
              r={isHovered ? 24 : 18}
              fill={n.color}
              opacity="0.15"
            >
              <animate
                attributeName="r"
                values="16;22;16"
                dur="3s"
                begin={n.pulseDelay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.25;0.05;0.25"
                dur="3s"
                begin={n.pulseDelay}
                repeatCount="indefinite"
              />
            </circle>

            {/* Node Solid Center */}
            <circle
              cx={n.x}
              cy={n.y}
              r={isHovered ? 13 : 11}
              fill={n.color}
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#softGlow)"
              className="transition-all duration-200"
            />

            {/* Node Text Label */}
            <text
              x={n.x}
              y={n.y > 150 ? n.y + 22 : n.y - 18}
              textAnchor="middle"
              className="text-[11px] font-extrabold fill-slate-900 dark:fill-slate-100"
              style={{ pointerEvents: 'none' }}
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y > 150 ? n.y + 34 : n.y - 7}
              textAnchor="middle"
              className="text-[9px] font-semibold fill-slate-500 dark:fill-slate-400"
              style={{ pointerEvents: 'none' }}
            >
              {n.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );

  // Pure animation only (transparent background that mixes with page)
  if (onlyAnimation) {
    return (
      <div className="relative w-full flex items-center justify-center bg-transparent select-none">
        <div className="w-full max-w-[260px] aspect-[350/240] flex items-center justify-center">
          {svgContent}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-full sm:max-w-md mx-auto p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl transition-all">
      {/* Subtle top indicator */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 mb-1.5 sm:mb-2 border-b border-slate-100 dark:border-slate-800 text-[9px] sm:text-[11px]">
        <div className="flex items-center space-x-1 sm:space-x-1.5 font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
          <Brain size={13} className="text-purple-600 dark:text-purple-400 animate-pulse flex-shrink-0" />
          <span className="truncate">Hindsight Cognitive Flow</span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-semibold flex-shrink-0">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span className="hidden xs:inline">Live Memory</span>
        </div>
      </div>

      {/* SVG Brain & Synaptic Network */}
      <div className="relative h-36 xs:h-44 sm:h-56 md:h-64 w-full flex items-center justify-center">
        {svgContent}
      </div>
      {/* Dynamic Detail Card under animation */}
      <div className="mt-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left transition-all">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="truncate">{activeNode ? nodes.find((n) => n.id === activeNode)?.label : 'Continuous Feedback Loop'}</span>
          <span className="text-[9px] sm:text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex-shrink-0 ml-1">
            {activeNode ? 'Active Stage' : 'Hover a node'}
          </span>
        </div>
        <p className="text-[9px] sm:text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2 sm:line-clamp-none">
          {activeNode
            ? nodes.find((n) => n.id === activeNode)?.detail
            : 'Sarah’s technical blockers and Michael’s price objection are remembered to synthesize an adapted ROI case.'}
        </p>
      </div>

      {/* Bottom 4-stage pill chain */}
      <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[8px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">
        <span className="text-purple-700 dark:text-purple-300">Interact</span>
        <ArrowRight size={10} className="text-slate-400 flex-shrink-0" />
        <span className="text-purple-700 dark:text-purple-300">Memory</span>
        <ArrowRight size={10} className="text-slate-400 flex-shrink-0" />
        <span className="text-emerald-700 dark:text-emerald-300">Learn</span>
        <ArrowRight size={10} className="text-slate-400 flex-shrink-0" />
        <span className="text-emerald-800 dark:text-emerald-200">Adapt</span>
      </div>
    </div>
  );
}
