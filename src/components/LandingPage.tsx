import React from 'react';
import { 
  Feather, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Heart, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Sun
} from 'lucide-react';
import { TimePhase, PhaseThemeConfig } from '../types';
import { isDarkPhase } from '../services/timePhaseEngine';

interface LandingPageProps {
  currentPhase: TimePhase;
  phaseConfig: PhaseThemeConfig;
  onBeginWriting: () => void;
  onGoogleSignIn: () => void;
  onSelectPhase: (phase: TimePhase) => void;
  onOpenSecurityWalkthrough?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentPhase,
  phaseConfig,
  onBeginWriting,
  onGoogleSignIn,
  onSelectPhase,
  onOpenSecurityWalkthrough
}) => {
  const isDark = isDarkPhase(currentPhase);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
      isDark ? 'text-[#e9edf5]' : 'text-[#2b221a]'
    }`}>
      
      {/* Decorative Botanical / Atmospheric Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-1000"
        style={{ background: phaseConfig.skyAtmosphere }}
      />

      {/* Subtle paper grain texture */}
      <div className={`absolute inset-0 pointer-events-none opacity-70 ${phaseConfig.paperTextureClass}`} />

      {/* Top Banner Navigation */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${
            isDark ? 'bg-[#1b2233] border-[#364462] text-amber-300' : 'bg-[#f4ecdf] border-[#ded1bf] text-[#8e5239]'
          }`}>
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-literary text-2xl font-bold tracking-widest block leading-tight">
              Luminary
            </span>
            <span className={`text-[10px] uppercase tracking-widest font-typewriter ${
              isDark ? 'text-amber-300/70' : 'text-[#9c755f]'
            }`}>
              Personal Gemini Journal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenSecurityWalkthrough && (
            <button
              onClick={onOpenSecurityWalkthrough}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-typewriter tracking-wide transition-all ${
                isDark 
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20' 
                  : 'bg-[#fffaf2]/90 border-[#ded3c3] text-[#734c38] hover:bg-[#f3ece0]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Security & RBAC</span>
            </button>
          )}

          {/* Phase Pill with subtle glow */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-typewriter tracking-wide shadow-sm ${
            isDark ? 'bg-[#161d2d]/80 border-[#32405d] text-amber-200' : 'bg-[#fffaf2]/90 border-[#ded3c3] text-[#734c38]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Currently {phaseConfig.displayName}</span>
            <span className="opacity-60 hidden sm:inline">• {phaseConfig.timeRange}</span>
          </div>
        </div>
      </header>

      {/* Main Editorial Hero Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        
        {/* Subtle Ornamental Vintage Seal */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-typewriter tracking-widest uppercase opacity-80">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>A Journal That Lives With The Passing Day</span>
        </div>

        {/* Primary Title */}
        <h1 className="font-serif-literary text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
          Your thoughts,<br />
          <span className="italic font-normal font-serif-literary">
            illuminated.
          </span>
        </h1>

        {/* Sub-hero Copy */}
        <p className="font-serif-literary text-xl sm:text-2xl leading-relaxed max-w-2xl mx-auto mb-10 opacity-85">
          A personal, private sanctuary for your reflections. Crafted with aged parchment paper, 
          compassionate multi-turn Gemini reflections, and a tranquil atmosphere in light and dark modes.
        </p>

        {/* Interactive Atmospheric Mode Switcher */}
        <div className="mb-12 inline-block">
          <p className="text-xs uppercase font-typewriter tracking-widest opacity-60 mb-3">
            Choose your journal aesthetic
          </p>
          <div className={`p-1.5 rounded-2xl border backdrop-blur-md inline-flex items-center justify-center gap-2 shadow-lg ${
            isDark ? 'bg-[#141a29]/90 border-[#2a364e]' : 'bg-[#f5ede1]/90 border-[#d8cbb8]'
          }`}>
            <button
              onClick={() => onSelectPhase('light')}
              className={`px-4 py-2 rounded-xl text-xs font-serif-literary font-medium transition-all flex items-center gap-2 ${
                !isDark
                  ? 'bg-[#5a3824] text-[#fff8f0] font-bold shadow-md scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>☀️</span>
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => onSelectPhase('dark')}
              className={`px-4 py-2 rounded-xl text-xs font-serif-literary font-medium transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-amber-400 text-slate-900 font-bold shadow-md scale-105'
                  : 'text-[#6d5b4e] hover:text-[#2c221a] hover:bg-black/5'
              }`}
            >
              <span>🌙</span>
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            id="landing-begin-writing-btn"
            onClick={onBeginWriting}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-serif-literary text-lg font-semibold tracking-wide flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg ${
              isDark 
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-900/30' 
                : 'bg-[#4d3222] text-[#fff9f2] hover:bg-[#382417] shadow-[#4d3222]/20'
            }`}
          >
            <span>{phaseConfig.ctaText}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="landing-google-sign-in-btn"
            onClick={onGoogleSignIn}
            className={`w-full sm:w-auto px-7 py-4 rounded-full font-sans-editorial text-sm font-medium tracking-wide border flex items-center justify-center gap-2.5 transition-all ${
              isDark 
                ? 'bg-[#182030]/80 border-[#32405d] text-slate-200 hover:bg-[#202b40]' 
                : 'bg-white/80 border-[#d9cebe] text-[#3d2e24] hover:bg-[#fbf7f0]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Vintage Literary Card Preview */}
        <div className={`max-w-2xl mx-auto text-left p-8 sm:p-10 rounded-2xl border shadow-2xl relative transition-all ${
          isDark 
            ? 'bg-[#151b2a]/95 border-[#2c3850] shadow-black/60' 
            : 'bg-[#fffefb]/95 border-[#e2d6c4] shadow-[#d6c7b3]/40'
        }`}>
          {/* Postmark stamp in corner */}
          <div className="absolute top-6 right-6 font-typewriter text-[11px] uppercase tracking-widest opacity-60 border border-current px-2.5 py-1 rotate-3 rounded">
            {phaseConfig.displayName} Folio
          </div>

          <p className="font-handwriting text-2xl mb-3 text-amber-600 dark:text-amber-400">
            {phaseConfig.greeting}
          </p>

          <h3 className="font-serif-literary text-2xl sm:text-3xl font-bold mb-4">
            “{phaseConfig.defaultPrompt}”
          </h3>

          <p className="font-serif-literary text-base sm:text-lg opacity-80 leading-relaxed mb-6 italic">
            {phaseConfig.subGreeting}
          </p>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-typewriter opacity-60">
            <span>Encrypted & Private</span>
            <span>Firestore Isolated UID</span>
          </div>
        </div>

        {/* Feature Vignettes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 text-left">
          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-[#141a28]/60 border-[#28344c]' : 'bg-[#fbf7f0]/80 border-[#e3d7c7]'
          }`}>
            <Sun className="w-5 h-5 text-amber-500 mb-3" />
            <h4 className="font-serif-literary text-lg font-bold mb-1">Light & Dark Modes</h4>
            <p className="text-xs opacity-75 leading-relaxed font-sans-editorial">
              Tailored aesthetics for daytime clarity and tranquil nighttime writing, complete with realistic parchment textures.
            </p>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-[#141a28]/60 border-[#28344c]' : 'bg-[#fbf7f0]/80 border-[#e3d7c7]'
          }`}>
            <Sparkles className="w-5 h-5 text-purple-400 mb-3" />
            <h4 className="font-serif-literary text-lg font-bold mb-1">Gemini Reflections</h4>
            <p className="text-xs opacity-75 leading-relaxed font-sans-editorial">
              Multi-turn introspective conversations, poetic summaries, and non-judgmental wisdom tailored to your entries.
            </p>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-[#141a28]/60 border-[#28344c]' : 'bg-[#fbf7f0]/80 border-[#e3d7c7]'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-500 mb-3" />
            <h4 className="font-serif-literary text-lg font-bold mb-1">Strict Isolation</h4>
            <p className="text-xs opacity-75 leading-relaxed font-sans-editorial">
              Protected by Firebase Auth UID ownership, Cloud Firestore security rules, and server-side secret management.
            </p>
          </div>
        </div>

      </main>

      {/* Literary Footer */}
      <footer className="relative z-10 border-t border-black/10 dark:border-white/10 py-8 text-center text-xs font-serif-literary opacity-60">
        <p>Luminary — Personal Gemini Journal • Made with care for the quiet hours.</p>
      </footer>
    </div>
  );
};
