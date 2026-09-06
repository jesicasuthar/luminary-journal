import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  X, 
  MessageSquare, 
  RefreshCw, 
  BookOpen, 
  Feather,
  Compass
} from 'lucide-react';
import { ConversationMessage, JournalEntry, TimePhase } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { isDarkPhase } from '../services/timePhaseEngine';

interface GeminiCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: TimePhase;
  contextEntry?: JournalEntry | null;
  history: ConversationMessage[];
  onUpdateHistory: (messages: ConversationMessage[]) => void;
  userId: string;
}

const CONVERSATION_STARTERS = [
  'Help me unpack what is feeling most heavy right now.',
  'What quiet perspective am I overlooking today?',
  'Give me a gentle question to sit with this evening.',
  'Help me reframe this self-doubt with literary grace.'
];

export const GeminiCompanion: React.FC<GeminiCompanionProps> = ({
  isOpen,
  onClose,
  currentPhase,
  contextEntry,
  history,
  onUpdateHistory,
  userId
}) => {
  const isDark = isDarkPhase(currentPhase);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, history]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    setInput('');
    const userMsg: ConversationMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
      entryId: contextEntry?.id
    };

    const updatedWithUser = [...history, userMsg];
    onUpdateHistory(updatedWithUser);
    setIsSending(true);

    try {
      const entryContext = contextEntry ? {
        title: contextEntry.title,
        body: contextEntry.body,
        mood: contextEntry.mood,
        timePhase: contextEntry.timePhase
      } : undefined;

      const response = await sendChatMessage(history, text, entryContext);

      const modelMsg: ConversationMessage = {
        id: `msg_m_${Date.now()}`,
        role: 'model',
        text: response.reply,
        timestamp: Date.now(),
        entryId: contextEntry?.id
      };

      onUpdateHistory([...updatedWithUser, modelMsg]);
    } catch (err) {
      console.error('Companion response error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] shadow-2xl flex flex-col border-l animate-in slide-in-from-right duration-300 backdrop-blur-xl">
      <div className={`flex flex-col h-full ${
        isDark ? 'bg-[#121724]/95 border-[#28354c] text-slate-100 paper-texture-dark' : 'bg-[#fffefb]/95 border-[#dfd5c5] text-[#2c221a] paper-texture'
      }`}>
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-literary text-xl font-bold leading-tight">
                Gemini Companion
              </h3>
              <p className="text-[11px] font-typewriter opacity-60">
                Literary Introspection • Multi-turn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Tag if converse about a specific entry */}
        {contextEntry && (
          <div className={`px-4 py-2 text-xs font-serif-literary border-b flex items-center justify-between ${
            isDark ? 'bg-amber-400/10 border-[#28354c] text-amber-300' : 'bg-[#f8ede0] border-[#decbb7] text-[#71462a]'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Reflecting on: “{contextEntry.title || 'Current Page'}”</span>
            </div>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {history.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-4 rounded-2xl text-sm sm:text-base leading-relaxed font-serif-literary ${
                    isUser
                      ? isDark 
                        ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-xs shadow-sm' 
                        : 'bg-[#503423] text-[#fff8f0] font-medium rounded-tr-xs shadow-sm'
                      : isDark
                        ? 'bg-[#1a2233] border border-[#2f3e5c] text-slate-100 rounded-tl-xs shadow-sm'
                        : 'bg-[#fbf7f0] border border-[#e2d6c5] text-[#2c221a] rounded-tl-xs shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] font-typewriter opacity-40 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 p-3 text-xs font-typewriter opacity-60">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Luminary is reflecting upon your words...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Reflection Prompts */}
        <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 flex gap-1.5 overflow-x-auto text-[11px] font-serif-literary">
          {CONVERSATION_STARTERS.map((starter, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(starter)}
              className={`shrink-0 px-3 py-1 rounded-full border transition-colors ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-black/5 border-black/10 hover:bg-black/10 text-[#4c3b31]'
              }`}
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-black/10 dark:border-white/10">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Speak what is on your mind..."
              disabled={isSending}
              className={`w-full pl-4 pr-12 py-3 rounded-2xl border text-sm font-serif-literary transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                isDark 
                  ? 'bg-[#182030] border-[#2c3b58] placeholder-slate-500' 
                  : 'bg-[#f7f2ea] border-[#dad0bf] placeholder-[#907e71]'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className={`absolute right-2 p-2 rounded-xl transition-all ${
                input.trim() && !isSending
                  ? isDark ? 'bg-amber-400 text-slate-950' : 'bg-[#513625] text-[#fff8f0]'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
