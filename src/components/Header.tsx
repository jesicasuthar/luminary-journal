import React, { useState } from 'react';
import { 
  Feather, 
  BookOpen, 
  Image as ImageIcon, 
  Clock, 
  Sparkles, 
  Scroll, 
  ShieldCheck, 
  LogOut, 
  Sun, 
  Sunset, 
  Moon, 
  Compass, 
  ChevronDown,
  MessageSquare,
  Key
} from 'lucide-react';
import { TimePhase, PhaseThemeConfig } from '../types';
import { PHASE_CONFIGS, isDarkPhase } from '../services/timePhaseEngine';

interface HeaderProps {
  currentPhase: TimePhase;
  actualLocalPhase: TimePhase;
  phaseConfig: PhaseThemeConfig;
  activeView: string;
  onSelectView: (view: string) => void;
  onSelectPhase: (phase: TimePhase | 'AUTO') => void;
  isAutoPhase: boolean;
  user: any;
  isAdmin: boolean;
  onSignOut: () => void;
  onOpenSignIn: () => void;
  onToggleGemini: () => void;
  isGeminiOpen: boolean;
  onOpenSecurityWalkthrough?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPhase,
  actualLocalPhase,
  phaseConfig,
  activeView,
  onSelectView,
  onSelectPhase,
  isAutoPhase,
  user,
  isAdmin,
  onSignOut,
  onOpenSignIn,
  onToggleGemini,
  isGeminiOpen,
  onOpenSecurityWalkthrough
}) => {
  const [phaseDropdownOpen, setPhaseDropdownOpen] = useState(false);
  const isDark = isDarkPhase(currentPhase);

  const getPhaseIcon = (phase: TimePhase) => {
    return isDarkPhase(phase) ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-600" />;
  };

  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-500 ${
      isDark 
        ? 'bg-[#121622]/85 border-[#283247] text-[#e8ecf5]' 
        : 'bg-[#faf7f2]/90 border-[#e3dacf] text-[#2c241e]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Masthead */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView('write')}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm transition-transform hover:scale-105 ${
            isDark ? 'bg-[#1b2233] border-[#364462] text-amber-300' : 'bg-[#f4ecdf] border-[#ded1bf] text-[#8e5239]'
          }`}>
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif-literary text-2xl font-bold tracking-wider">
                Luminary
              </span>
              <span className={`text-[11px] uppercase tracking-widest hidden sm:inline font-typewriter ${
                isDark ? 'text-amber-300/70' : 'text-[#9c755f]'
              }`}>
                Vol. I
              </span>
            </div>
            <p className={`text-xs font-handwriting text-sm leading-none hidden md:block ${
              isDark ? 'text-slate-400' : 'text-[#877265]'
            }`}>
              Your thoughts, illuminated.
            </p>
          </div>
        </div>

        {/* Center Navigation Navbars */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/10">
          <button
            id="nav-write-btn"
            onClick={() => onSelectView('write')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              activeView === 'write'
                ? isDark ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#2a221b] shadow-sm border border-[#e0d6c7]'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-[#7a6a5d] hover:text-[#2c241e]'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>

          <button
            id="nav-reflections-btn"
            onClick={() => onSelectView('reflections')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              activeView === 'reflections'
                ? isDark ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#2a221b] shadow-sm border border-[#e0d6c7]'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-[#7a6a5d] hover:text-[#2c241e]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reflections</span>
          </button>

          <button
            id="nav-scrapbook-btn"
            onClick={() => onSelectView('memories')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              activeView === 'memories'
                ? isDark ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#2a221b] shadow-sm border border-[#e0d6c7]'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-[#7a6a5d] hover:text-[#2c241e]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Scrapbook</span>
          </button>

          <button
            id="nav-timeline-btn"
            onClick={() => onSelectView('timeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              activeView === 'timeline'
                ? isDark ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#2a221b] shadow-sm border border-[#e0d6c7]'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-[#7a6a5d] hover:text-[#2c241e]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            id="nav-constellation-btn"
            onClick={() => onSelectView('constellation')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              activeView === 'constellation'
                ? isDark ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#2a221b] shadow-sm border border-[#e0d6c7]'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-[#7a6a5d] hover:text-[#2c241e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Constellation</span>
          </button>

          <button
            id="nav-prompts-btn"
            onClick={() => onSelectView('prompts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
              activeView === 'prompts'
                ? isDark ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#2a221b] shadow-sm border border-[#e0d6c7]'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-[#7a6a5d] hover:text-[#2c241e]'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>Prompts</span>
          </button>

          {onOpenSecurityWalkthrough && (
            <button
              id="nav-security-btn"
              onClick={onOpenSecurityWalkthrough}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                isDark 
                  ? 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10' 
                  : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Security</span>
            </button>
          )}

          {isAdmin && (
            <button
              id="nav-admin-btn"
              onClick={() => onSelectView('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-500 hover:text-amber-600'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right Section: Time Phase Selector & User Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Light / Dark Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => onSelectPhase(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
              isDark 
                ? 'bg-[#182030] border-[#2c3850] text-amber-300 hover:border-amber-400/50 hover:bg-[#202b40]' 
                : 'bg-[#f4efe6] border-[#ded6c8] text-[#47392e] hover:border-[#b89b78] hover:bg-[#ede5d8]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-600" />}
            <span className="font-serif-literary font-semibold tracking-wide">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {/* Gemini Companion Toggle Button */}
          <button
            id="gemini-companion-toggle"
            onClick={onToggleGemini}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              isGeminiOpen
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : isDark 
                  ? 'bg-[#1c2233] border-[#313c54] text-amber-300 hover:bg-[#252e44]' 
                  : 'bg-[#f4efe5] border-[#dcd3c3] text-[#7a4e39] hover:bg-[#ece4d4]'
            }`}
            title="Ask Gemini Companion"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-serif-literary font-medium">Gemini</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </button>

          {/* Authentication & User Info */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-black/10 dark:border-white/10">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-amber-500/40 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-700/30 text-amber-400 flex items-center justify-center text-xs font-semibold">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <button
                id="sign-out-btn"
                onClick={onSignOut}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                title="Sign out of Luminary"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="google-sign-in-btn"
              onClick={onOpenSignIn}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform active:scale-95 ${
                isDark 
                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' 
                  : 'bg-[#53392a] text-[#fbf7f0] hover:bg-[#3c291e]'
              }`}
            >
              Sign In
            </button>
          )}

        </div>

      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-inherit px-2 py-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => onSelectView('write')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'write' ? 'font-bold underline' : 'opacity-70'}`}
        >
          Write
        </button>
        <button
          onClick={() => onSelectView('reflections')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'reflections' ? 'font-bold underline' : 'opacity-70'}`}
        >
          Reflections
        </button>
        <button
          onClick={() => onSelectView('memories')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'memories' ? 'font-bold underline' : 'opacity-70'}`}
        >
          Scrapbook
        </button>
        <button
          onClick={() => onSelectView('timeline')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'timeline' ? 'font-bold underline' : 'opacity-70'}`}
        >
          Timeline
        </button>
        <button
          onClick={() => onSelectView('constellation')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'constellation' ? 'font-bold underline' : 'opacity-70'}`}
        >
          Constellation
        </button>
        <button
          onClick={() => onSelectView('prompts')}
          className={`px-2.5 py-1 rounded-md ${activeView === 'prompts' ? 'font-bold underline' : 'opacity-70'}`}
        >
          Prompts
        </button>
        {onOpenSecurityWalkthrough && (
          <button
            onClick={onOpenSecurityWalkthrough}
            className="px-2.5 py-1 rounded-md text-amber-500 opacity-90"
          >
            Security
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => onSelectView('admin')}
            className={`px-2.5 py-1 rounded-md text-amber-500 font-semibold ${activeView === 'admin' ? 'underline' : ''}`}
          >
            Admin
          </button>
        )}
      </div>
    </header>
  );
};
