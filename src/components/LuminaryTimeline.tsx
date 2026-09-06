import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { JournalEntry, TimePhase } from '../types';
import { isDarkPhase } from '../services/timePhaseEngine';

interface LuminaryTimelineProps {
  entries: JournalEntry[];
  currentPhase: TimePhase;
  onOpenEntry: (entry: JournalEntry) => void;
}

export const LuminaryTimeline: React.FC<LuminaryTimelineProps> = ({
  entries,
  currentPhase,
  onOpenEntry
}) => {
  const isDark = isDarkPhase(currentPhase);

  // Group entries by chronological sequence
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  // Extract unique moods & theme trends
  const initialMoodCounts: Record<string, number> = {};
  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, initialMoodCounts);

  const topThemes = Array.from(new Set(entries.flatMap(e => e.suggestedThemes || []))).slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border text-[11px] font-typewriter uppercase tracking-widest opacity-80">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Chronicle of Becoming</span>
        </div>
        <h2 className="font-serif-literary text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          The Luminary Timeline
        </h2>
        <p className="font-serif-literary text-base sm:text-lg opacity-80 italic">
          “How my days have felt.” An unbroken tapestry of thoughts, shifting sky phases, and emotional currents.
        </p>
      </div>

      {/* Atmospheric Mood Currents Strip */}
      <div className={`p-6 rounded-3xl border mb-12 shadow-sm ${
        isDark ? 'bg-[#151b2a]/90 border-[#2a364e]' : 'bg-[#fffefb] border-[#dfd4c4]'
      }`}>
        <h3 className="font-serif-literary text-lg font-bold mb-3 flex items-center gap-2">
          <span>Emotional Currents Across Time</span>
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {Object.entries(moodCounts).map(([mood, count]) => (
            <span
              key={mood}
              className={`px-3 py-1 rounded-full text-xs font-serif-literary border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-[#ebd8c5]/40 border-[#d1bfad]'
              }`}
            >
              <span className="font-handwriting text-base font-bold text-amber-600 dark:text-amber-300 mr-1.5 capitalize">
                {mood}
              </span>
              <span className="font-typewriter text-[10px] opacity-60">({count} pages)</span>
            </span>
          ))}
        </div>

        {topThemes.length > 0 && (
          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-typewriter uppercase tracking-widest opacity-60">
              Recurring AI Themes:
            </span>
            {topThemes.map((theme, i) => (
              <span
                key={i}
                className="text-xs font-serif-literary px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium"
              >
                ✦ {theme}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Vertical Vintage Chronicle Timeline */}
      <div className="relative border-l-2 border-amber-600/30 dark:border-amber-400/20 ml-4 sm:ml-32 space-y-12 pb-12">
        {sortedEntries.map((entry, idx) => (
          <div key={entry.id} className="relative pl-6 sm:pl-10 group">
            
            {/* Left Date Stamp (Desktop) */}
            <div className="hidden sm:block absolute -left-32 top-0.5 w-24 text-right">
              <span className="font-typewriter text-xs font-bold block">
                {entry.date}
              </span>
              <span className="text-[10px] uppercase font-typewriter opacity-60 block tracking-widest">
                {isDarkPhase(entry.timePhase) ? '🌙 Dark' : '☀️ Light'}
              </span>
            </div>

            {/* Timeline Node Icon */}
            <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
              isDark 
                ? 'bg-[#182032] border-amber-400 text-amber-300' 
                : 'bg-[#fffefc] border-[#8a533b] text-[#8a533b]'
            }`}>
              <span className="text-xs font-serif-literary font-bold">
                {idx + 1}
              </span>
            </div>

            {/* Timeline Entry Card */}
            <div
              onClick={() => onOpenEntry(entry)}
              className={`cursor-pointer p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 ${
                isDark 
                  ? 'bg-[#141a28]/95 border-[#28354e] paper-texture-dark' 
                  : 'bg-[#fffefc] border-[#dfd4c4] paper-texture vintage-border'
              }`}
            >
              {/* Mobile date header */}
              <div className="sm:hidden flex items-center justify-between text-[11px] font-typewriter opacity-60 mb-2">
                <span>{entry.date}</span>
                <span className="uppercase">{entry.timePhase}</span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="flex-1">
                  
                  {/* Title & Mood */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-serif-literary text-2xl font-bold tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {entry.title || 'Untitled Page'}
                    </h3>
                    <span className="font-handwriting text-lg text-amber-700 dark:text-amber-300 capitalize">
                      — {entry.mood}
                    </span>
                  </div>

                  {/* Body preview */}
                  <p className="font-serif-literary text-sm sm:text-base opacity-80 line-clamp-3 leading-relaxed mb-4">
                    {entry.body}
                  </p>

                  {/* AI Summary excerpt if present */}
                  {entry.aiSummary && (
                    <div className="text-xs font-serif-literary italic opacity-75 border-l-2 border-amber-500/50 pl-3 mb-3">
                      “{entry.aiSummary}”
                    </div>
                  )}

                  {/* Metadata line */}
                  <div className="flex items-center gap-3 text-xs font-serif-literary opacity-60 flex-wrap">
                    {entry.location?.name && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{entry.location.name}</span>
                      </span>
                    )}
                    {entry.tags?.map((t, i) => (
                      <span key={i} className="font-typewriter text-[11px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Optional Polaroid snippet */}
                {entry.photos && entry.photos.length > 0 && (
                  <div className="shrink-0 w-full sm:w-32 h-28 rounded-lg overflow-hidden border shadow-sm rotate-1">
                    <img
                      src={entry.photos[0]}
                      alt={entry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
