import React, { useState, useMemo } from 'react';
import { Sparkles, BookOpen, Star, ArrowRight, X } from 'lucide-react';
import { JournalEntry, TimePhase } from '../types';
import { isDarkPhase } from '../services/timePhaseEngine';

interface ConstellationOfThoughtsProps {
  entries: JournalEntry[];
  currentPhase: TimePhase;
  onOpenEntry: (entry: JournalEntry) => void;
}

interface ConstellationNode {
  id: string;
  label: string;
  count: number;
  x: number;
  y: number;
  entries: JournalEntry[];
}

export const ConstellationOfThoughts: React.FC<ConstellationOfThoughtsProps> = ({
  entries,
  currentPhase,
  onOpenEntry
}) => {
  const isDark = isDarkPhase(currentPhase);
  const [activeTheme, setActiveTheme] = useState<ConstellationNode | null>(null);

  // Group entries by themes and tags
  const nodes = useMemo<ConstellationNode[]>(() => {
    const themeMap: Record<string, JournalEntry[]> = {};

    entries.forEach(entry => {
      const tokens = [
        ...(entry.tags || []),
        ...(entry.suggestedThemes || []),
        entry.mood
      ];

      tokens.forEach(raw => {
        const token = raw.trim().toLowerCase();
        if (token.length > 2) {
          if (!themeMap[token]) themeMap[token] = [];
          if (!themeMap[token].some(e => e.id === entry.id)) {
            themeMap[token].push(entry);
          }
        }
      });
    });

    // Pick top recurring themes (between 6 and 14)
    const sorted = Object.entries(themeMap)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);

    // Position them organically in an SVG canvas space (width 700, height 400)
    const positions = [
      { x: 350, y: 190 }, // center star
      { x: 210, y: 110 },
      { x: 490, y: 110 },
      { x: 140, y: 260 },
      { x: 560, y: 260 },
      { x: 260, y: 310 },
      { x: 440, y: 320 },
      { x: 130, y: 130 },
      { x: 570, y: 140 },
      { x: 350, y: 60 }
    ];

    return sorted.map(([theme, items], index) => {
      const pos = positions[index] || {
        x: 100 + ((index * 90) % 500),
        y: 80 + ((index * 60) % 280)
      };
      return {
        id: `node_${theme}`,
        label: theme.charAt(0).toUpperCase() + theme.slice(1),
        count: items.length,
        x: pos.x,
        y: pos.y,
        entries: items
      };
    });
  }, [entries]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border text-[11px] font-typewriter uppercase tracking-widest opacity-80">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span>Nocturnal Celestial Map</span>
        </div>
        <h2 className="font-serif-literary text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Constellation of Thoughts
        </h2>
        <p className="font-serif-literary text-base sm:text-lg opacity-80 italic">
          Witness recurring themes and memories connect like stars across your internal galaxy. Click any star to unfurl its story.
        </p>
      </div>

      {/* Interactive Constellation SVG Sky Chart */}
      <div className={`p-6 sm:p-10 rounded-3xl border shadow-xl relative overflow-hidden mb-12 ${
        isDark 
          ? 'bg-[#0b0f19] border-[#253046] shadow-black/80' 
          : 'bg-[#182133] border-[#374562] text-slate-100 shadow-slate-900/30'
      }`}>
        
        {/* Subtle background ambient celestial stars */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <svg viewBox="0 0 700 400" className="w-full h-auto overflow-visible select-none">
          {/* Constellation Connecting Lines */}
          <g stroke="rgba(251, 191, 36, 0.25)" strokeWidth="1.2" strokeDasharray="3 3">
            {nodes.map((node, i) => {
              if (i === 0) return null;
              // Connect to center or adjacent node
              const target = nodes[(i + 1) % nodes.length];
              return (
                <line
                  key={`line_${node.id}_${target.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                />
              );
            })}
            {/* Center spokes */}
            {nodes.length > 0 && nodes.slice(1, 5).map(node => (
              <line
                key={`center_${node.id}`}
                x1={nodes[0].x}
                y1={nodes[0].y}
                x2={node.x}
                y2={node.y}
                stroke="rgba(251, 191, 36, 0.35)"
              />
            ))}
          </g>

          {/* Constellation Star Nodes */}
          {nodes.map(node => {
            const isSelected = activeTheme?.id === node.id;
            const radius = Math.min(18, 8 + node.count * 2.5);

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setActiveTheme(node)}
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Glow ring */}
                <circle
                  r={radius + 8}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? 'fill-amber-400/30 stroke-amber-400 stroke-1 scale-125'
                      : 'fill-amber-400/5 group-hover:fill-amber-400/20'
                  }`}
                />

                {/* Core star */}
                <circle
                  r={radius}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? 'fill-amber-300 stroke-white stroke-2'
                      : 'fill-amber-400/90 group-hover:fill-amber-300'
                  }`}
                />

                {/* Text label */}
                <text
                  y={radius + 16}
                  textAnchor="middle"
                  className="font-serif-literary text-[12px] fill-slate-200 font-semibold tracking-wide pointer-events-none drop-shadow"
                >
                  {node.label} ({node.count})
                </text>
              </g>
            );
          })}
        </svg>

        <p className="text-center text-[11px] font-typewriter opacity-50 mt-4">
          Click any celestial node above to inspect converging journal reflections.
        </p>
      </div>

      {/* Selected Theme Journal Entries Drawer / List */}
      {activeTheme && (
        <div className={`p-8 rounded-3xl border shadow-lg animate-in fade-in duration-200 ${
          isDark ? 'bg-[#151b2a] border-[#293750]' : 'bg-[#fffefc] border-[#ded5c5]'
        }`}>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-literary text-2xl font-bold">
                  Pages Aligned with “{activeTheme.label}”
                </h3>
                <p className="text-xs font-typewriter opacity-60">
                  {activeTheme.entries.length} reflections orbiting this theme
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTheme(null)}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTheme.entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => onOpenEntry(entry)}
                className={`p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${
                  isDark ? 'bg-[#1a2336] border-[#314060]' : 'bg-[#faf6ee] border-[#dfd4c4]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-typewriter opacity-60 mb-2">
                  <span>{entry.date}</span>
                  <span className="uppercase">{isDarkPhase(entry.timePhase) ? '🌙 Dark' : '☀️ Light'}</span>
                </div>
                <h4 className="font-serif-literary text-lg font-bold mb-1">
                  {entry.title || 'Untitled'}
                </h4>
                <p className="font-serif-literary text-xs opacity-80 line-clamp-2 italic mb-3">
                  “{entry.body}”
                </p>
                <div className="flex items-center justify-between text-xs font-serif-literary text-amber-600 dark:text-amber-400 font-semibold">
                  <span>Read full page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
