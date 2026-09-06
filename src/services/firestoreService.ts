import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { JournalEntry, ConversationMessage, ScrapbookMemory } from '../types';
import { INITIAL_SAMPLE_ENTRIES } from '../data/initialEntries';

const LOCAL_STORAGE_KEY = 'luminary_local_entries_v1';
const LOCAL_CONVERSATION_KEY = 'luminary_local_conversation_v1';

/**
 * Loads entries: from Firestore if authenticated, else from localStorage or sample data.
 */
export async function loadUserEntries(uid: string): Promise<JournalEntry[]> {
  try {
    const colRef = collection(db, 'users', uid, 'entries');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const items: JournalEntry[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as JournalEntry);
      });
      return items;
    }
  } catch (err) {
    console.warn('Firestore loadUserEntries fallback to local:', err);
  }

  // Local storage fallback
  const localData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${uid}`);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch {}
  }

  return INITIAL_SAMPLE_ENTRIES.map(e => ({ ...e, userId: uid }));
}

/**
 * Saves or updates a journal entry
 */
export async function saveUserEntry(uid: string, entry: JournalEntry): Promise<void> {
  // Save locally first for instantaneous responsiveness
  try {
    const existing = await loadUserEntries(uid);
    const index = existing.findIndex(e => e.id === entry.id);
    const updated = index >= 0 
      ? [...existing.slice(0, index), entry, ...existing.slice(index + 1)]
      : [entry, ...existing];
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${uid}`, JSON.stringify(updated));
  } catch {}

  // Sync to Firestore
  try {
    const docRef = doc(db, 'users', uid, 'entries', entry.id);
    await setDoc(docRef, entry, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserEntry failed (data saved locally):', err);
  }
}

/**
 * Deletes an entry
 */
export async function deleteUserEntry(uid: string, entryId: string): Promise<void> {
  try {
    const existing = await loadUserEntries(uid);
    const filtered = existing.filter(e => e.id !== entryId);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${uid}`, JSON.stringify(filtered));
  } catch {}

  try {
    const docRef = doc(db, 'users', uid, 'entries', entryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteUserEntry error:', err);
  }
}

/**
 * Subscribes to real-time entries
 */
export function subscribeUserEntries(uid: string, onUpdate: (entries: JournalEntry[]) => void) {
  try {
    const colRef = collection(db, 'users', uid, 'entries');
    const q = query(colRef, orderBy('timestamp', 'desc'));

    return onSnapshot(q, snapshot => {
      if (!snapshot.empty) {
        const items: JournalEntry[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as JournalEntry);
        });
        onUpdate(items);
      }
    }, err => {
      console.warn('Snapshot listener error, relying on local entries:', err);
    });
  } catch (err) {
    console.warn('Could not attach Firestore listener:', err);
    return () => {};
  }
}

/**
 * Saves conversation history
 */
export async function saveConversationHistory(uid: string, messages: ConversationMessage[]): Promise<void> {
  try {
    localStorage.setItem(`${LOCAL_CONVERSATION_KEY}_${uid}`, JSON.stringify(messages));
    
    // Save to Firestore under user's conversations
    const convRef = doc(db, 'users', uid, 'conversations', 'primary');
    await setDoc(convRef, {
      updatedAt: Date.now(),
      messageCount: messages.length,
      messages: messages.slice(-20) // store latest 20 turns
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync conversation to Firestore:', err);
  }
}

/**
 * Loads conversation history
 */
export function loadConversationHistory(uid: string): ConversationMessage[] {
  const local = localStorage.getItem(`${LOCAL_CONVERSATION_KEY}_${uid}`);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  return [
    {
      id: 'init_welcome',
      role: 'model',
      text: 'Welcome to Luminary. I am here alongside your pages—ready to explore whatever thought or memory you wish to unfold.',
      timestamp: Date.now()
    }
  ];
}
