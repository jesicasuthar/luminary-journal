import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Sparkles, 
  MapPin, 
  Image as ImageIcon, 
  Share2, 
  Trash2, 
  BookOpen, 
  Calendar, 
  Clock, 
  Smile, 
  Check, 
  Send,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { JournalEntry, TimePhase, PhaseThemeConfig, LocationData } from '../types';
import { isDarkPhase } from '../services/timePhaseEngine';
import { generateEntryReflection } from '../services/geminiService';
import { sendEntryNotification } from '../services/notificationService';
import { LocationPickerModal } from './LocationPickerModal';

interface JournalEditorProps {
  currentPhase: TimePhase;
  phaseConfig: PhaseThemeConfig;
  activeEntry: JournalEntry | null;
  onSaveEntry: (entry: JournalEntry) => Promise<void>;
  onDeleteEntry?: (id: string) => Promise<void>;
  onOpenGeminiWithContext: (entry: JournalEntry) => void;
  userId: string;
}

const MOOD_OPTIONS = [
  { id: 'gentle', label: 'Gentle', color: 'bg-rose-100 text-rose-800' },
  { id: 'peaceful', label: 'Peaceful', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'focused', label: 'Focused', color: 'bg-blue-100 text-blue-800' },
  { id: 'grateful', label: 'Grateful', color: 'bg-amber-100 text-amber-800' },
  { id: 'nostalgic', label: 'Nostalgic', color: 'bg-orange-100 text-orange-800' },
  { id: 'introspective', label: 'Introspective', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'dreamy', label: 'Dreamy', color: 'bg-purple-100 text-purple-800' },
  { id: 'creative', label: 'Creative', color: 'bg-teal-100 text-teal-800' },
  { id: 'hopeful', label: 'Hopeful', color: 'bg-yellow-100 text-yellow-800' }
];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  currentPhase,
  phaseConfig,
  activeEntry,
  onSaveEntry,
  onDeleteEntry,
  onOpenGeminiWithContext,
  userId
}) => {
  const isDark = isDarkPhase(currentPhase);

  // Form states
  const [title, setTitle] = useState(activeEntry?.title || '');
  const [body, setBody] = useState(activeEntry?.body || '');
  const [date, setDate] = useState(activeEntry?.date || new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState(activeEntry?.mood || 'peaceful');
  const [tags, setTags] = useState<string[]>(activeEntry?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [location, setLocation] = useState<LocationData | null>(activeEntry?.location || null);
  const [photoUrl, setPhotoUrl] = useState(activeEntry?.photos?.[0] || '');
  const [photoInput, setPhotoInput] = useState(false);
  const [isMemory, setIsMemory] = useState(activeEntry?.isMemory ?? true);
  const [aiSummary, setAiSummary] = useState(activeEntry?.aiSummary || '');
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>(activeEntry?.reflectionQuestions || []);
  const [suggestedThemes, setSuggestedThemes] = useState<string[]>(activeEntry?.suggestedThemes || []);

  // UI state
  const [isReflecting, setIsReflecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync when active entry changes
  useEffect(() => {
    if (activeEntry) {
      setTitle(activeEntry.title);
      setBody(activeEntry.body);
      setDate(activeEntry.date);
      setMood(activeEntry.mood);
      setTags(activeEntry.tags || []);
      setLocation(activeEntry.location || null);
      setPhotoUrl(activeEntry.photos?.[0] || '');
      setIsMemory(activeEntry.isMemory);
      setAiSummary(activeEntry.aiSummary || '');
      setReflectionQuestions(activeEntry.reflectionQuestions || []);
      setSuggestedThemes(activeEntry.suggestedThemes || []);
    } else {
      // New blank page
      setTitle('');
      setBody('');
      setDate(new Date().toISOString().split('T')[0]);
      setMood('peaceful');
      setTags([currentPhase.toLowerCase()]);
      setLocation(null);
      setPhotoUrl('');
      setIsMemory(true);
      setAiSummary('');
      setReflectionQuestions([]);
      setSuggestedThemes([]);
    }
  }, [activeEntry, currentPhase]);

  // Tag helper
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.replace(/^#/, '').trim().toLowerCase();
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // AI Reflection
  const handleGenerateReflection = async () => {
    if (!body.trim()) {
      setFeedbackMessage('Please write a few lines in your journal first so Gemini has thoughts to reflect upon.');
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }
    setFeedbackMessage(null);
    setIsReflecting(true);
    try {
      const result = await generateEntryReflection(title, body, mood, currentPhase);
      setAiSummary(result.summary);
      if (result.reflectionQuestion) {
        setReflectionQuestions([result.reflectionQuestion]);
      }
      if (result.keyThemes) {
        setSuggestedThemes(result.keyThemes);
      }
      if (result.suggestedTags) {
        const merged = Array.from(new Set([...tags, ...result.suggestedTags]));
        setTags(merged);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReflecting(false);
    }
  };

  // Save entry
  const handleSave = async () => {
    if (!title.trim() && !body.trim()) return;

    setIsSaving(true);
    const entryToSave: JournalEntry = {
      id: activeEntry?.id || `entry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      title: title.trim() || 'Untitled Page',
      body: body.trim(),
      date,
      timestamp: activeEntry?.timestamp || Date.now(),
      timePhase: activeEntry?.timePhase || currentPhase,
      mood,
      tags,
      location: location?.name ? location : null,
      photos: photoUrl ? [photoUrl] : [],
      isMemory,
      aiSummary,
      reflectionQuestions,
      suggestedThemes,
      createdAt: activeEntry?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await onSaveEntry(entryToSave);
    setIsSaving(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);

    // If tagged with #share, auto-trigger external notification
    if (tags.includes('share') && !activeEntry?.shareNotificationSent) {
      handleSendNotification(entryToSave);
    }
  };

  // External notification dispatch
  const handleSendNotification = async (customEntry?: JournalEntry) => {
    const entry = customEntry || {
      id: activeEntry?.id || 'draft',
      title: title || 'Untitled',
      body,
      mood,
      timePhase: currentPhase
    };

    setIsNotifying(true);
    const res = await sendEntryNotification({
      entryId: entry.id,
      entryTitle: entry.title,
      timePhase: entry.timePhase,
      mood: entry.mood,
      excerpt: (entry.body || '').slice(0, 150),
      channel: 'slack',
      userId
    });
    setIsNotifying(false);
    setNotificationStatus(res.message);
    setTimeout(() => setNotificationStatus(null), 4000);
  };

  // Word count & estimate
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Status & Atmospheric Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-literary text-2xl font-bold tracking-tight">
              {activeEntry ? 'Revisiting Page' : 'New Journal Page'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-typewriter uppercase tracking-wider ${
              isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-[#ebd8c5] text-[#784630]'
            }`}>
              {phaseConfig.displayName} Edition
            </span>
          </div>
          <p className="text-xs font-serif-literary italic opacity-70 mt-1">
            "{phaseConfig.defaultPrompt}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeEntry && onDeleteEntry && (
            showDeleteConfirm ? (
              <div className="flex items-center gap-1.5 p-1 px-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
                <span className="text-rose-600 dark:text-rose-400 font-serif-literary">Tear page out?</span>
                <button
                  id="confirm-delete-entry-btn"
                  onClick={async () => {
                    await onDeleteEntry(activeEntry.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors font-medium text-[11px]"
                >
                  Confirm
                </button>
                <button
                  id="cancel-delete-entry-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-0.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="delete-entry-btn"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Tear out page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )
          )}

          <button
            id="gemini-chat-about-entry-btn"
            onClick={() => {
              onOpenGeminiWithContext({
                id: activeEntry?.id || 'current',
                userId,
                title,
                body,
                date,
                timestamp: Date.now(),
                timePhase: currentPhase,
                mood,
                tags,
                isMemory,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-serif-literary font-medium transition-all ${
              isDark 
                ? 'bg-[#182030] border-[#313e5c] text-amber-300 hover:bg-[#222c44]' 
                : 'bg-[#f4efe5] border-[#d8cdbd] text-[#734a35] hover:bg-[#ece4d4]'
            }`}
            title="Converse with Gemini about this page"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Gemini</span>
          </button>

          <button
            id="reflect-gemini-btn"
            onClick={handleGenerateReflection}
            disabled={isReflecting}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-serif-literary font-medium transition-all ${
              isDark 
                ? 'bg-[#1c2438] border-[#374768] text-purple-300 hover:bg-[#25304a]' 
                : 'bg-[#f6eff7] border-[#dfcce0] text-[#69396f] hover:bg-[#eeddee]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isReflecting ? 'animate-spin' : ''}`} />
            <span>{isReflecting ? 'Reflecting...' : 'Reflect & Summarize'}</span>
          </button>

          <button
            id="save-journal-entry-btn"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-serif-literary font-bold text-sm shadow-md transition-transform active:scale-95 ${
              isDark 
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' 
                : 'bg-[#4d3222] text-[#fff9f2] hover:bg-[#382417]'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Preserving...' : 'Save Page'}</span>
          </button>
        </div>
      </div>

      {/* Feedback warning/validation banner */}
      {feedbackMessage && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-serif-literary flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Save feedback banner */}
      {saveSuccessMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-typewriter flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Page preserved into your journal folio securely.</span>
        </div>
      )}

      {/* Notification feedback banner */}
      {notificationStatus && (
        <div className="mb-4 p-3 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-700 dark:text-blue-300 text-xs font-typewriter flex items-center gap-2 animate-in fade-in">
          <Share2 className="w-4 h-4" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* The Physical Sheet of Parchment / Paper Container */}
      <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl relative transition-all ${
        isDark 
          ? 'bg-[#131722]/95 border-[#28334a] shadow-black/60 paper-texture-dark' 
          : 'bg-[#fffefc] border-[#dfd5c5] shadow-[#cfbfab]/30 paper-texture vintage-border'
      }`}>
        
        {/* Top Metadata Bar on Paper: Date, Mood, Phase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 mb-6 border-b border-black/10 dark:border-white/10 text-xs font-typewriter">
          
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-50" />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-transparent border-b border-dashed border-current/40 focus:outline-none py-0.5"
            />
          </div>

          {/* Time Phase indicator */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-50" />
            <span className="capitalize">{currentPhase.toLowerCase()} Hour</span>
          </div>

          {/* Mood Selector Dropdown */}
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 opacity-50" />
            <select
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="bg-transparent border-b border-dashed border-current/40 focus:outline-none py-0.5 cursor-pointer"
            >
              {MOOD_OPTIONS.map(m => (
                <option key={m.id} value={m.id} className="text-slate-900 bg-white">
                  Mood: {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Entry Title */}
        <div className="mb-6">
          <input
            id="journal-title-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What would you like to name this hour?"
            className="w-full bg-transparent font-serif-literary text-3xl sm:text-4xl font-bold tracking-tight focus:outline-none placeholder:opacity-35 leading-tight"
          />
        </div>

        {/* Entry Body (Lined or Clean Parchment) */}
        <div className="mb-8">
          <textarea
            id="journal-body-input"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write freely. The ink remembers what the heart holds..."
            rows={14}
            className={`w-full bg-transparent font-serif-literary text-lg sm:text-xl leading-relaxed focus:outline-none resize-y placeholder:opacity-35 ${
              isDark ? 'lined-paper-dark' : 'lined-paper'
            }`}
          />
        </div>

        {/* AI Reflection Box (if generated) */}
        {aiSummary && (
          <div className={`p-6 rounded-2xl border mb-8 transition-all relative ${
            isDark 
              ? 'bg-[#182133]/90 border-[#324366]' 
              : 'bg-[#fbf6ed]/95 border-[#e2d5c3]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-typewriter uppercase tracking-widest text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini Reflection</span>
              </div>
              <button
                onClick={() => setAiSummary('')}
                className="text-[10px] opacity-50 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>

            <p className="font-serif-literary text-base sm:text-lg italic leading-relaxed mb-4">
              “{aiSummary}”
            </p>

            {reflectionQuestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                <span className="text-[11px] font-typewriter uppercase tracking-widest opacity-60 block mb-1">
                  Inquiry for your journey:
                </span>
                <p className="font-handwriting text-xl text-amber-700 dark:text-amber-300">
                  {reflectionQuestions[0]}
                </p>
              </div>
            )}

            {suggestedThemes.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {suggestedThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-typewriter bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300"
                  >
                    ✦ {theme}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Polaroid Memory Attachment Preview */}
        {photoUrl && (
          <div className="mb-8 flex justify-center sm:justify-start">
            <div className={`p-3 pb-8 rounded-lg shadow-polaroid rotate-[-1.5deg] border max-w-xs transition-transform hover:rotate-0 ${
              isDark ? 'bg-[#1f2738] border-[#394868]' : 'bg-[#fffef8] border-[#dfd4c4]'
            }`}>
              <img
                src={photoUrl}
                alt="Scrapbook moment"
                className="w-full h-48 object-cover rounded shadow-inner mb-3"
              />
              <p className="font-handwriting text-lg text-center text-amber-700 dark:text-amber-300">
                {location?.name || 'A captured remembrance'}
              </p>
              <button
                onClick={() => setPhotoUrl('')}
                className="text-[10px] text-rose-500 hover:underline block text-center mt-1"
              >
                Remove Photo
              </button>
            </div>
          </div>
        )}

        {/* Bottom Paper Controls: Location, Photos, Tags, Memories */}
        <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Metadata Attachments */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Location Attachment Button */}
            <button
              id="attach-location-btn"
              type="button"
              onClick={() => setShowLocationModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-serif-literary transition-colors ${
                location?.name
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{location?.name ? location.name : 'Add Sanctuary / Location'}</span>
            </button>

            {/* Photo / Memory attachment */}
            <button
              id="attach-photo-btn"
              type="button"
              onClick={() => setPhotoInput(!photoInput)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-serif-literary transition-colors ${
                photoUrl
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{photoUrl ? 'Change Photo' : 'Attach Polaroid'}</span>
            </button>

            {/* Add to Memories Scrapbook Toggle */}
            <label className="flex items-center gap-1.5 text-xs font-serif-literary cursor-pointer opacity-80 ml-2">
              <input
                type="checkbox"
                checked={isMemory}
                onChange={e => setIsMemory(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span>Keep in Scrapbook Memories</span>
            </label>
          </div>

          {/* Word Count Ticker */}
          <div className="text-[11px] font-typewriter opacity-50 flex items-center gap-3">
            <span>{words} words</span>
            <span>•</span>
            <span>~{readMinutes} min reading</span>
          </div>

        </div>

        {/* Photo URL Input Bar (if open) */}
        {photoInput && (
          <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex gap-2">
            <input
              type="url"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              placeholder="Paste photo URL (e.g. Unsplash or personal photo link)..."
              className={`flex-1 px-3 py-1.5 rounded-lg border text-xs ${
                isDark ? 'bg-[#1a2233] border-[#32405d]' : 'bg-[#f7f2ea] border-[#d8cebe]'
              }`}
            />
            <button
              onClick={() => setPhotoInput(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-serif-literary font-semibold bg-amber-500 text-white"
            >
              Done
            </button>
          </div>
        )}

        {/* Tags Section */}
        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[11px] font-typewriter uppercase tracking-widest opacity-60">
              Tags:
            </span>
            {tags.map((t, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-serif-literary border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-[#ebd8c5]/40 border-[#d1bfad]'
                }`}
              >
                #{t}
                <button
                  onClick={() => handleRemoveTag(t)}
                  className="opacity-50 hover:opacity-100 hover:text-rose-500 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag + Enter (e.g. #stillness, #share)"
              className="bg-transparent text-xs font-serif-literary border-b border-dashed border-current/40 focus:outline-none px-1 py-0.5 placeholder:opacity-40"
            />
          </div>
          <p className="text-[10px] font-typewriter opacity-50">
            Tip: Tagging with <span className="font-bold">#share</span> will automatically dispatch a secure notification upon saving.
          </p>
        </div>

      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={loc => setLocation(loc)}
        currentLocation={location}
        isDark={isDark}
      />

    </div>
  );
};
