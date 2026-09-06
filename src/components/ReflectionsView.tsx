import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Sparkles, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  BookOpen, 
  X, 
  Feather,
  Trash2,
  Edit3
} from 'lucide-react';
import { JournalEntry, TimePhase } from '../types';
import { isDarkPhase } from '../services/timePhaseEngine';

interface ReflectionsViewProps {
  entries: JournalEntry[];
  currentPhase: TimePhase;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => Promise<void>;
  onNewEntry: () => void;
}

export const ReflectionsView: React.FC<ReflectionsViewProps> = ({
  entries,
  currentPhase,
  onEditEntry,
  onDeleteEntry,
  onNewEntry
}) => {
  const isDark = isDarkPhase(currentPhase);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [selectedMood, setSelectedMood] = useState<string>('ALL');
  const [onlyWithMemories, setOnlyWithMemories] = useState(false);
  const [onlyWithAiReflections, setOnlyWithAiReflections] = useState(false);
  const [activeModalEntry, setActiveModalEntry] = useState<JournalEntry | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesBody = e.body.toLowerCase().includes(q);
        const matchesTag = (e.tags || []).some(t => t.toLowerCase().includes(q));
        const matchesLocation = e.location?.name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBody && !matchesTag && !matchesLocation) {
          return false;
        }
      }

      // Phase match
      if (selectedPhase !== 'ALL') {
        const isEntryDark = isDarkPhase(e.timePhase);
        if (selectedPhase === 'dark' && !isEntryDark) return false;
        if (selectedPhase === 'light' && isEntryDark) return false;
      }

      // Mood match
      if (selectedMood !== 'ALL' && e.mood !== selectedMood) {
        return false;
      }

      // Memory filter
      if (onlyWithMemories && (!e.photos || e.photos.length === 0)) {
        return false;
      }

      // AI Reflection filter
      if (onlyWithAiReflections && !e.aiSummary) {
        return false;
      }

      return true;
    });
  }, [entries, searchQuery, selectedPhase, selectedMood, onlyWithMemories, onlyWithAiReflections]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header & Masthead */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold tracking-tight">
            Folio of Reflections
          </h2>
          <p className="text-xs font-typewriter opacity-60 mt-1">
            {entries.length} recorded {entries.length === 1 ? 'page' : 'pages'} across the tides of time
          </p>
        </div>

        <button
          onClick={onNewEntry}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-serif-literary font-semibold text-sm shadow-md transition-transform hover:-translate-y-0.5 ${
            isDark 
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' 
              : 'bg-[#513625] text-[#fff8f0] hover:bg-[#3c271a]'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Write New Page</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 sm:p-5 rounded-2xl border mb-8 shadow-sm ${
        isDark ? 'bg-[#151b2a]/80 border-[#2a3754]' : 'bg-[#fffdf9] border-[#e2d8c9]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search thoughts, memories, tags, cities..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs sm:text-sm font-serif-literary transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                isDark 
                  ? 'bg-[#1b2338] border-[#313f60] placeholder-slate-500' 
                  : 'bg-[#f7f2ea] border-[#dad0c1] placeholder-[#8d7c71]'
              }`}
            />
          </div>

          {/* Phase Filter */}
          <div>
            <select
              value={selectedPhase}
              onChange={e => setSelectedPhase(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-typewriter cursor-pointer focus:outline-none ${
                isDark ? 'bg-[#1b2338] border-[#313f60]' : 'bg-[#f7f2ea] border-[#dad0c1]'
              }`}
            >
              <option value="ALL">All Atmospheres (Light & Dark)</option>
              <option value="light">☀️ Light Mode</option>
              <option value="dark">🌙 Dark Mode</option>
            </select>
          </div>

          {/* Mood Filter */}
          <div>
            <select
              value={selectedMood}
              onChange={e => setSelectedMood(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-typewriter cursor-pointer focus:outline-none ${
                isDark ? 'bg-[#1b2338] border-[#313f60]' : 'bg-[#f7f2ea] border-[#dad0c1]'
              }`}
            >
              <option value="ALL">All Moods & Tones</option>
              <option value="peaceful">Peaceful</option>
              <option value="gentle">Gentle</option>
              <option value="focused">Focused</option>
              <option value="grateful">Grateful</option>
              <option value="nostalgic">Nostalgic</option>
              <option value="introspective">Introspective</option>
              <option value="dreamy">Dreamy</option>
              <option value="creative">Creative</option>
              <option value="hopeful">Hopeful</option>
            </select>
          </div>

        </div>

        {/* Checkbox Toggles */}
        <div className="flex items-center gap-6 flex-wrap text-xs font-serif-literary opacity-85">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyWithMemories}
              onChange={e => setOnlyWithMemories(e.target.checked)}
              className="rounded accent-amber-600"
            />
            <span>With Polaroid Memories</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyWithAiReflections}
              onChange={e => setOnlyWithAiReflections(e.target.checked)}
              className="rounded accent-amber-600"
            />
            <span>With Gemini Reflections</span>
          </label>

          {(searchQuery || selectedPhase !== 'ALL' || selectedMood !== 'ALL' || onlyWithMemories || onlyWithAiReflections) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPhase('ALL');
                setSelectedMood('ALL');
                setOnlyWithMemories(false);
                setOnlyWithAiReflections(false);
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline font-typewriter text-[11px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Vintage Journal Cards */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-3xl border-current/20 opacity-70">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-serif-literary text-2xl font-semibold mb-2">No pages found matching this inquiry</p>
          <p className="text-xs font-typewriter opacity-60">Try clearing filters or begin a new reflection page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map(entry => (
            <article
              key={entry.id}
              onClick={() => setActiveModalEntry(entry)}
              className={`group cursor-pointer p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 relative flex flex-col justify-between ${
                isDark 
                  ? 'bg-[#141a28]/95 border-[#28354e] paper-texture-dark' 
                  : 'bg-[#fffefc] border-[#dfd4c4] paper-texture vintage-border'
              }`}
            >
              <div>
                
                {/* Top Card Masthead: Phase & Date */}
                <div className="flex items-center justify-between text-[11px] font-typewriter opacity-65 mb-3 border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="uppercase tracking-widest">{isDarkPhase(entry.timePhase) ? '🌙 Dark' : '☀️ Light'}</span>
                  <span>{entry.date}</span>
                </div>

                {/* Optional Polaroid Thumbnail */}
                {entry.photos && entry.photos.length > 0 && (
                  <div className="mb-4 overflow-hidden rounded-lg shadow-sm border border-black/10 dark:border-white/10">
                    <img
                      src={entry.photos[0]}
                      alt={entry.title}
                      className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Entry Title */}
                <h3 className="font-serif-literary text-xl font-bold tracking-tight mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {entry.title || 'Untitled Hour'}
                </h3>

                {/* Body Excerpt */}
                <p className="font-serif-literary text-sm opacity-80 line-clamp-4 leading-relaxed mb-4">
                  {entry.body}
                </p>

                {/* AI Reflection Snippet */}
                {entry.aiSummary && (
                  <div className={`p-3 rounded-xl border text-xs font-serif-literary italic mb-4 ${
                    isDark ? 'bg-[#1b2438]/80 border-[#303f60]' : 'bg-[#fbf7f0] border-[#e4d9c9]'
                  }`}>
                    <div className="flex items-center gap-1.5 text-[10px] font-typewriter uppercase tracking-widest text-amber-600 dark:text-amber-400 not-italic mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Reflection</span>
                    </div>
                    <p className="line-clamp-2">“{entry.aiSummary}”</p>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer: Tags, Location, Mood */}
              <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-serif-literary">
                <div className="flex items-center gap-1.5 flex-wrap max-w-[70%]">
                  {entry.location?.name && (
                    <span className="flex items-center gap-1 opacity-70 text-[11px] font-sans-editorial">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span className="truncate max-w-[100px]">{entry.location.name}</span>
                    </span>
                  )}
                  {entry.tags?.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[11px] opacity-60 font-typewriter">
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="capitalize text-[11px] font-handwriting text-base text-amber-700 dark:text-amber-300">
                  {entry.mood}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Full Page Reading & Editing Modal */}
      {activeModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border p-8 sm:p-10 shadow-2xl relative ${
            isDark ? 'bg-[#131824] border-[#2a3754] text-slate-100 paper-texture-dark' : 'bg-[#fffefc] border-[#ded5c5] text-[#2c221a] paper-texture vintage-border'
          }`}>
            
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10 dark:border-white/10">
              <div className="text-xs font-typewriter opacity-60 flex items-center gap-3">
                <span className="uppercase">{isDarkPhase(activeModalEntry.timePhase) ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
                <span>•</span>
                <span>{activeModalEntry.date}</span>
                <span>•</span>
                <span className="capitalize">{activeModalEntry.mood}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = activeModalEntry;
                    setActiveModalEntry(null);
                    onEditEntry(toEdit);
                  }}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="Edit Page"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {confirmDeleteId === activeModalEntry.id ? (
                  <div className="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs">
                    <span className="text-rose-600 dark:text-rose-400 font-serif-literary">Tear page?</span>
                    <button
                      onClick={() => {
                        onDeleteEntry(activeModalEntry.id);
                        setConfirmDeleteId(null);
                        setActiveModalEntry(null);
                      }}
                      className="px-1.5 py-0.5 rounded bg-rose-600 text-white hover:bg-rose-700 text-[10px] font-semibold"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 text-[10px]"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(activeModalEntry.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setActiveModalEntry(null)}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Polaroid if attached */}
            {activeModalEntry.photos && activeModalEntry.photos.length > 0 && (
              <div className="mb-6 flex justify-center">
                <div className={`p-3 pb-8 rounded-lg shadow-polaroid rotate-[-1deg] border max-w-sm ${
                  isDark ? 'bg-[#1c2333] border-[#313f5c]' : 'bg-[#fffefb] border-[#e0d6c7]'
                }`}>
                  <img
                    src={activeModalEntry.photos[0]}
                    alt={activeModalEntry.title}
                    className="w-full h-56 object-cover rounded mb-2 shadow-inner"
                  />
                  <p className="font-handwriting text-xl text-center text-amber-700 dark:text-amber-300">
                    {activeModalEntry.location?.name || 'Moment in time'}
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif-literary text-3xl sm:text-4xl font-bold mb-6">
              {activeModalEntry.title}
            </h1>

            {/* Full Body Text */}
            <div className="font-serif-literary text-lg sm:text-xl leading-relaxed whitespace-pre-line mb-8 opacity-90">
              {activeModalEntry.body}
            </div>

            {/* AI Reflection Full Box */}
            {activeModalEntry.aiSummary && (
              <div className={`p-6 rounded-2xl border mb-6 ${
                isDark ? 'bg-[#1a2233] border-[#32405d]' : 'bg-[#fbf7f0] border-[#e2d6c5]'
              }`}>
                <div className="flex items-center gap-2 text-xs font-typewriter uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini Literary Reflection</span>
                </div>
                <p className="font-serif-literary text-base italic mb-3">
                  “{activeModalEntry.aiSummary}”
                </p>
                {activeModalEntry.reflectionQuestions && activeModalEntry.reflectionQuestions.length > 0 && (
                  <p className="font-handwriting text-lg text-amber-700 dark:text-amber-300">
                    Inquiry: {activeModalEntry.reflectionQuestions[0]}
                  </p>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-typewriter opacity-60">
              {activeModalEntry.location?.name && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeModalEntry.location.name}</span>
                </span>
              )}
              <span>UID Encrypted Private Folio</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
