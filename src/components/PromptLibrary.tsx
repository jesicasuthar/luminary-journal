import React, { useState } from 'react';
import { 
  Scroll, 
  Sparkles, 
  Feather, 
  Sun, 
  Sunset, 
  Moon, 
  Heart, 
  Compass, 
  ArrowRight 
} from 'lucide-react';
import { TimePhase, PromptItem } from '../types';
import { PROMPTS, getRecommendedPromptsForPhase } from '../services/promptLibrary';
import { isDarkPhase } from '../services/timePhaseEngine';

interface PromptLibraryProps {
  currentPhase: TimePhase;
  onSelectPrompt: (promptText: string) => void;
}

const CATEGORIES = [
  'Recommended',
  'Light',
  'Dark',
  'Gratitude',
  'Self Reflection',
  'Growth',
  'Relationships',
  'Dreams',
  'Creativity'
];

export const PromptLibrary: React.FC<PromptLibraryProps> = ({
  currentPhase,
  onSelectPrompt
}) => {
  const isDark = isDarkPhase(currentPhase);
  const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

  const displayedPrompts: PromptItem[] = selectedCategory === 'Recommended'
    ? getRecommendedPromptsForPhase(currentPhase)
    : PROMPTS.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border text-[11px] font-typewriter uppercase tracking-widest opacity-80">
          <Scroll className="w-3.5 h-3.5 text-amber-500" />
          <span>Inspirational Inquiries</span>
        </div>
        <h2 className="font-serif-literary text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          The Prompt Archive
        </h2>
        <p className="font-serif-literary text-base sm:text-lg opacity-80 italic">
          Curated questions to unlock memories, unburden nocturnal thoughts, and honor the changing light of your days.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap mb-10">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif-literary transition-all ${
                isSelected
                  ? isDark 
                    ? 'bg-amber-400 text-slate-900 font-bold shadow-md' 
                    : 'bg-[#503423] text-[#fff8f0] font-bold shadow-md'
                  : isDark
                    ? 'bg-[#182030] border border-[#2f3c58] text-slate-300 hover:text-white'
                    : 'bg-[#f4efe5] border border-[#ded5c5] text-[#554336] hover:text-[#2c221a]'
              }`}
            >
              {cat === 'Recommended' && '✦ '}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Recommended Banner if on Recommended */}
      {selectedCategory === 'Recommended' && (
        <div className={`p-6 rounded-2xl border mb-8 flex items-center justify-between gap-4 ${
          isDark ? 'bg-amber-400/10 border-amber-400/30 text-amber-200' : 'bg-[#fbeedf] border-[#e7caa8] text-[#714629]'
        }`}>
          <div>
            <span className="text-[10px] font-typewriter uppercase tracking-widest block mb-1">
              Synchronized Atmosphere
            </span>
            <h4 className="font-serif-literary text-xl font-bold">
              Inquiries for {isDark ? 'Dark Mode' : 'Light Mode'}
            </h4>
            <p className="text-xs opacity-85 mt-0.5">
              Reflecting the calm stillness of dark mode or the bright clarity of light mode.
            </p>
          </div>
          <Sparkles className="w-6 h-6 shrink-0 opacity-80" />
        </div>
      )}

      {/* Prompts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPrompts.map(prompt => (
          <div
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt.text)}
            className={`group cursor-pointer p-7 rounded-2xl border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative flex flex-col justify-between ${
              isDark 
                ? 'bg-[#141a28]/95 border-[#293750] paper-texture-dark' 
                : 'bg-[#fffefc] border-[#e0d6c6] paper-texture vintage-border'
            }`}
          >
            <div>
              {/* Category Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-typewriter uppercase tracking-widest opacity-60 px-2 py-0.5 rounded border border-current/20">
                  {prompt.category}
                </span>
                <Feather className="w-3.5 h-3.5 opacity-30 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Prompt Text */}
              <h3 className="font-serif-literary text-xl sm:text-2xl font-bold leading-snug mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                “{prompt.text}”
              </h3>

              {/* Subtext */}
              {prompt.subtext && (
                <p className="font-serif-literary text-xs sm:text-sm opacity-75 italic leading-relaxed mb-6">
                  {prompt.subtext}
                </p>
              )}
            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-serif-literary">
              <span className="font-typewriter text-[11px] opacity-60">
                Click to write
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Begin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
