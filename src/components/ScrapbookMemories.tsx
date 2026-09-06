import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Trash2, 
  Plus, 
  X, 
  Maximize2 
} from 'lucide-react';
import { JournalEntry, TimePhase } from '../types';
import { isDarkPhase } from '../services/timePhaseEngine';

interface ScrapbookMemoriesProps {
  entries: JournalEntry[];
  currentPhase: TimePhase;
  onOpenEntry: (entry: JournalEntry) => void;
  onRemoveFromMemories: (entryId: string) => Promise<void>;
  onNewMemoryEntry: () => void;
}

export const ScrapbookMemories: React.FC<ScrapbookMemoriesProps> = ({
  entries,
  currentPhase,
  onOpenEntry,
  onRemoveFromMemories,
  onNewMemoryEntry
}) => {
  const isDark = isDarkPhase(currentPhase);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<{ url: string; caption: string; entry: JournalEntry } | null>(null);

  // Filter entries that have photos or are marked as memories
  const memoryEntries = entries.filter(e => (e.photos && e.photos.length > 0) || e.isMemory);

  // Pre-calculated subtle artistic tilt angles for realistic physical scrapbook look
  const tiltRotations = [-2.2, 1.4, -1.1, 2.5, -1.8, 1.9, -2.5, 1.2];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold tracking-tight">
            Scrapbook of Memories
          </h2>
          <p className="text-xs font-typewriter opacity-60 mt-1">
            Polaroids, pressed moments, and handwritten remnants of lived hours
          </p>
        </div>

        <button
          onClick={onNewMemoryEntry}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-serif-literary font-semibold text-sm shadow-md transition-transform hover:-translate-y-0.5 ${
            isDark 
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' 
              : 'bg-[#513625] text-[#fff8f0] hover:bg-[#3c271a]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Memory Page</span>
        </button>
      </div>

      {/* Masonry / Scrapbook Grid */}
      {memoryEntries.length === 0 ? (
        <div className="text-center py-24 border border-dashed rounded-3xl border-current/20 opacity-70">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40 text-amber-500" />
          <p className="font-serif-literary text-2xl font-semibold mb-2">The Scrapbook is Quiet</p>
          <p className="text-xs font-typewriter opacity-60 max-w-md mx-auto mb-6">
            Attach photos or mark your journal entries as memories to fill this album with physical polaroids.
          </p>
          <button
            onClick={onNewMemoryEntry}
            className="px-4 py-2 rounded-xl text-xs font-serif-literary font-semibold bg-amber-500 text-white"
          >
            Create First Memory
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {memoryEntries.map((entry, idx) => {
            const photo = entry.photos && entry.photos.length > 0
              ? entry.photos[0]
              : 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80';
            
            const rotation = tiltRotations[idx % tiltRotations.length];

            return (
              <div
                key={entry.id}
                className="break-inside-avoid relative group transition-transform duration-300 hover:scale-[1.02] hover:z-20"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Vintage Washi Tape Top Accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-200/50 dark:bg-amber-800/40 backdrop-blur-xs rotate-[-1deg] shadow-xs z-10 border border-black/5" />

                {/* Polaroid Frame Container */}
                <div className={`p-4 pb-7 rounded-lg shadow-polaroid border transition-colors ${
                  isDark 
                    ? 'bg-[#182030] border-[#2f3d5c] text-slate-100 shadow-polaroid-dark' 
                    : 'bg-[#fffefc] border-[#dfd5c5] text-[#2c221a]'
                }`}>
                  
                  {/* Photo Canvas */}
                  <div className="relative overflow-hidden rounded mb-3 bg-black/10 aspect-4/3">
                    <img
                      src={photo}
                      alt={entry.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Lightbox trigger */}
                    <button
                      onClick={() => setActiveLightboxPhoto({ url: photo, caption: entry.title, entry })}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Enlarge Polaroid"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Handwritten Caption */}
                  <h3 className="font-handwriting text-2xl font-bold leading-tight mb-1 text-center text-amber-700 dark:text-amber-300">
                    {entry.title || 'A Preserved Moment'}
                  </h3>

                  {/* Short snippet */}
                  <p className="font-serif-literary text-xs opacity-75 text-center line-clamp-2 px-2 italic mb-3">
                    “{entry.body}”
                  </p>

                  {/* Polaroid Details & Postmarks */}
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] font-typewriter opacity-60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{entry.date}</span>
                    </div>

                    {entry.location?.name && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className="truncate max-w-[90px]">{entry.location.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="mt-3 pt-2 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-serif-literary">
                    <button
                      onClick={() => onOpenEntry(entry)}
                      className="flex items-center gap-1 hover:underline text-amber-600 dark:text-amber-400 font-semibold"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Page</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromMemories(entry.id)}
                      className="flex items-center gap-1 hover:underline text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Detach</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-3xl w-full text-center relative">
            <button
              onClick={() => setActiveLightboxPhoto(null)}
              className="absolute -top-10 right-0 text-white opacity-80 hover:opacity-100 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <div className={`p-4 pb-8 rounded-xl shadow-2xl border inline-block max-w-full ${
              isDark ? 'bg-[#182030] border-[#2f3d5c]' : 'bg-[#fffefc] border-[#dfd5c5]'
            }`}>
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption}
                className="max-h-[70vh] rounded object-contain mx-auto mb-4"
              />
              <p className="font-handwriting text-3xl text-amber-700 dark:text-amber-300">
                {activeLightboxPhoto.caption}
              </p>
              <button
                onClick={() => {
                  const e = activeLightboxPhoto.entry;
                  setActiveLightboxPhoto(null);
                  onOpenEntry(e);
                }}
                className="mt-3 px-4 py-1.5 rounded-full text-xs font-serif-literary font-semibold bg-amber-500 text-white"
              >
                Open Original Journal Page
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
