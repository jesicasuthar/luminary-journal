import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import { 
  TimePhase, 
  JournalEntry, 
  ConversationMessage, 
  PhaseThemeConfig 
} from './types';
import { 
  PHASE_CONFIGS, 
  getCurrentTimePhase, 
  isDarkPhase 
} from './services/timePhaseEngine';
import { 
  loadUserEntries, 
  saveUserEntry, 
  deleteUserEntry, 
  subscribeUserEntries,
  loadConversationHistory,
  saveConversationHistory
} from './services/firestoreService';

import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { JournalEditor } from './components/JournalEditor';
import { ReflectionsView } from './components/ReflectionsView';
import { ScrapbookMemories } from './components/ScrapbookMemories';
import { PromptLibrary } from './components/PromptLibrary';
import { LuminaryTimeline } from './components/LuminaryTimeline';
import { ConstellationOfThoughts } from './components/ConstellationOfThoughts';
import { GeminiCompanion } from './components/GeminiCompanion';
import { AdminDashboard } from './components/AdminDashboard';
import { SecurityWalkthrough } from './components/SecurityWalkthrough';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isSecurityWalkthroughOpen, setIsSecurityWalkthroughOpen] = useState(false);

  // Time & Theme State (Light and Dark modes only)
  const [actualLocalPhase, setActualLocalPhase] = useState<TimePhase>(getCurrentTimePhase());
  const [activePhase, setActivePhase] = useState<TimePhase>(() => {
    const saved = localStorage.getItem('luminary_theme_mode');
    if (saved === 'light' || saved === 'dark') return saved as TimePhase;
    return getCurrentTimePhase();
  });
  const [isAutoPhase, setIsAutoPhase] = useState(() => !localStorage.getItem('luminary_theme_mode'));

  // View state: 'write' | 'reflections' | 'memories' | 'timeline' | 'constellation' | 'prompts' | 'admin'
  const [activeView, setActiveView] = useState<string>('write');
  const [activeEntryToEdit, setActiveEntryToEdit] = useState<JournalEntry | null>(null);

  // Data state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [geminiContextEntry, setGeminiContextEntry] = useState<JournalEntry | null>(null);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkPhase(activePhase)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [activePhase]);

  // Keep actual browser time in sync if in auto mode
  useEffect(() => {
    const checkTime = () => {
      const detected = getCurrentTimePhase();
      setActualLocalPhase(detected);
      if (isAutoPhase) {
        setActivePhase(detected);
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [isAutoPhase]);

  // Handle theme mode toggle / selection
  const handleSelectPhase = (phase: TimePhase | 'AUTO') => {
    if (phase === 'AUTO') {
      setIsAutoPhase(true);
      localStorage.removeItem('luminary_theme_mode');
      setActivePhase(actualLocalPhase);
    } else {
      setIsAutoPhase(false);
      localStorage.setItem('luminary_theme_mode', phase);
      setActivePhase(phase);
    }
  };

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Determine current active UID
  const currentUid = user ? user.uid : 'guest_writer';

  // Load and subscribe entries for current UID
  useEffect(() => {
    let unsubSnapshot = () => {};

    const initializeData = async () => {
      const initial = await loadUserEntries(currentUid);
      setEntries(initial);

      // Load conversation history
      const hist = loadConversationHistory(currentUid);
      setConversationHistory(hist);

      if (user) {
        unsubSnapshot = subscribeUserEntries(currentUid, updated => {
          setEntries(updated);
        });
      }
    };

    initializeData();

    return () => unsubSnapshot();
  }, [currentUid, user]);

  // Auth actions
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsGuestMode(false);
    } catch (err: any) {
      console.warn('Google Sign In popup closed or failed:', err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setIsGuestMode(false);
    setActiveView('write');
  };

  // Entry operations
  const handleSaveEntry = async (entry: JournalEntry) => {
    await saveUserEntry(currentUid, entry);
    // Refresh local list
    const updated = await loadUserEntries(currentUid);
    setEntries(updated);
    setActiveEntryToEdit(null);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteUserEntry(currentUid, id);
    const updated = await loadUserEntries(currentUid);
    setEntries(updated);
    if (activeEntryToEdit?.id === id) {
      setActiveEntryToEdit(null);
    }
  };

  const handleRemoveFromMemories = async (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      const updated = { ...entry, isMemory: false, photos: [] };
      await handleSaveEntry(updated);
    }
  };

  // Conversation operations
  const handleUpdateConversation = (newHistory: ConversationMessage[]) => {
    setConversationHistory(newHistory);
    saveConversationHistory(currentUid, newHistory);
  };

  // Open Gemini Companion with specific entry context
  const handleOpenGeminiWithContext = (entry: JournalEntry) => {
    setGeminiContextEntry(entry);
    setIsGeminiOpen(true);
  };

  // Check admin status
  const adminEmails = ['jesica.s.suthar@gmail.com'];
  const isAdmin = Boolean((user && user.email && adminEmails.includes(user.email.toLowerCase())) || (!user && isGuestMode) || !user);

  // Active theme configuration
  const phaseConfig: PhaseThemeConfig = PHASE_CONFIGS[activePhase];
  const isDark = isDarkPhase(activePhase);

  // If user is neither signed in nor in guest mode, show the stunning atmospheric landing page
  if (!user && !isGuestMode && !authLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#0e121d]' : 'bg-[#fbf7f1]'}`}>
        <LandingPage
          currentPhase={activePhase}
          phaseConfig={phaseConfig}
          onBeginWriting={() => setIsGuestMode(true)}
          onGoogleSignIn={handleGoogleSignIn}
          onSelectPhase={p => handleSelectPhase(p)}
          onOpenSecurityWalkthrough={() => setIsSecurityWalkthroughOpen(true)}
        />
        <SecurityWalkthrough
          isOpen={isSecurityWalkthroughOpen}
          onClose={() => setIsSecurityWalkthroughOpen(false)}
          currentPhase={activePhase}
          userEmail={user?.email || 'jesica.s.suthar@gmail.com'}
          userRole={isAdmin ? 'super_admin' : 'user'}
          onOpenAdmin={() => {
            setIsGuestMode(true);
            setActiveView('admin');
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 relative ${
      isDark ? 'bg-[#0d121c] text-[#e8edf6]' : 'bg-[#fbf8f2] text-[#2c221a]'
    }`}>
      
      {/* Dynamic Time Atmospheric Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 transition-opacity duration-1000 z-0"
        style={{ background: phaseConfig.skyAtmosphere }}
      />

      {/* Parchment / Paper grain texture */}
      <div className={`fixed inset-0 pointer-events-none opacity-60 z-0 ${phaseConfig.paperTextureClass}`} />

      {/* Persistent Luminary Masthead & Navigation */}
      <Header
        currentPhase={activePhase}
        actualLocalPhase={actualLocalPhase}
        phaseConfig={phaseConfig}
        activeView={activeView}
        onSelectView={view => {
          if (view === 'write') setActiveEntryToEdit(null);
          setActiveView(view);
        }}
        onSelectPhase={handleSelectPhase}
        isAutoPhase={isAutoPhase}
        user={user}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
        onOpenSignIn={handleGoogleSignIn}
        onToggleGemini={() => setIsGeminiOpen(!isGeminiOpen)}
        isGeminiOpen={isGeminiOpen}
        onOpenSecurityWalkthrough={() => setIsSecurityWalkthroughOpen(true)}
      />

      {/* Guest Mode Banner */}
      {!user && isGuestMode && (
        <div className={`relative z-20 px-4 py-2 text-center text-xs font-typewriter border-b flex items-center justify-center gap-3 ${
          isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-200' : 'bg-[#faebd9] border-[#e4ccb0] text-[#714629]'
        }`}>
          <span>Writing as Guest • Your pages are preserved in local memory.</span>
          <button
            onClick={handleGoogleSignIn}
            className="underline font-bold hover:text-amber-500"
          >
            Sign in with Google for Cloud Firestore Sync
          </button>
        </div>
      )}

      {/* Main View Container */}
      <main className="relative z-10 flex-1">
        {activeView === 'write' && (
          <JournalEditor
            currentPhase={activePhase}
            phaseConfig={phaseConfig}
            activeEntry={activeEntryToEdit}
            onSaveEntry={handleSaveEntry}
            onDeleteEntry={handleDeleteEntry}
            onOpenGeminiWithContext={handleOpenGeminiWithContext}
            userId={currentUid}
          />
        )}

        {activeView === 'reflections' && (
          <ReflectionsView
            entries={entries}
            currentPhase={activePhase}
            onEditEntry={entry => {
              setActiveEntryToEdit(entry);
              setActiveView('write');
            }}
            onDeleteEntry={handleDeleteEntry}
            onNewEntry={() => {
              setActiveEntryToEdit(null);
              setActiveView('write');
            }}
          />
        )}

        {activeView === 'memories' && (
          <ScrapbookMemories
            entries={entries}
            currentPhase={activePhase}
            onOpenEntry={entry => {
              setActiveEntryToEdit(entry);
              setActiveView('write');
            }}
            onRemoveFromMemories={handleRemoveFromMemories}
            onNewMemoryEntry={() => {
              setActiveEntryToEdit(null);
              setActiveView('write');
            }}
          />
        )}

        {activeView === 'timeline' && (
          <LuminaryTimeline
            entries={entries}
            currentPhase={activePhase}
            onOpenEntry={entry => {
              setActiveEntryToEdit(entry);
              setActiveView('write');
            }}
          />
        )}

        {activeView === 'constellation' && (
          <ConstellationOfThoughts
            entries={entries}
            currentPhase={activePhase}
            onOpenEntry={entry => {
              setActiveEntryToEdit(entry);
              setActiveView('write');
            }}
          />
        )}

        {activeView === 'prompts' && (
          <PromptLibrary
            currentPhase={activePhase}
            onSelectPrompt={promptText => {
              setActiveEntryToEdit({
                id: `entry_${Date.now()}`,
                userId: currentUid,
                title: promptText.slice(0, 50) + (promptText.length > 50 ? '...' : ''),
                body: `Inquiry: “${promptText}”\n\n`,
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now(),
                timePhase: activePhase,
                mood: 'introspective',
                tags: [activePhase.toLowerCase(), 'prompt'],
                isMemory: false,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
              setActiveView('write');
            }}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            currentPhase={activePhase}
            userEmail={user?.email || 'jesica.s.suthar@gmail.com'}
            onOpenWalkthrough={() => setIsSecurityWalkthroughOpen(true)}
          />
        )}
      </main>

      {/* Intimate Multi-turn Gemini Companion Drawer */}
      <GeminiCompanion
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        currentPhase={activePhase}
        contextEntry={geminiContextEntry}
        history={conversationHistory}
        onUpdateHistory={handleUpdateConversation}
        userId={currentUid}
      />

      {/* Security Architecture & RBAC Walkthrough Modal */}
      <SecurityWalkthrough
        isOpen={isSecurityWalkthroughOpen}
        onClose={() => setIsSecurityWalkthroughOpen(false)}
        currentPhase={activePhase}
        userEmail={user?.email || 'jesica.s.suthar@gmail.com'}
        userRole={isAdmin ? 'super_admin' : 'user'}
        onOpenAdmin={() => setActiveView('admin')}
      />

    </div>
  );
}
