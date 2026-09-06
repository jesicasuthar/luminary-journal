import { JournalEntry } from '../types';

export const INITIAL_SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: 'entry_sample_dusk',
    userId: 'sample_user',
    title: 'The Amber Light on Rue de Fleurus',
    body: 'The sun tilted through the high windows of the corner café today, turning the steam from my black coffee into sheer gold. I sat with an old fountain pen and watched the leaves outside drift onto damp cobblestones.\n\nThere is a quiet dignity in watching hours dissolve without rushing them. I realized how much hurry I carry in my shoulders every week—unnecessary anxieties about deadlines that no one else even notices.\n\nTonight, I let the silence take up room.',
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
    timestamp: Date.now() - 24 * 3600 * 1000,
    timePhase: 'dark',
    mood: 'nostalgic',
    tags: ['paris', 'solitude', 'presence', 'fountain-pen'],
    location: {
      name: 'Café de Flore',
      address: '172 Boulevard Saint-Germain, Paris',
      lat: 48.854,
      lng: 2.3326
    },
    photos: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
    ],
    isMemory: true,
    aiSummary: 'A quiet afternoon reflection at a Parisian café meditating on the release of unnecessary hurry and the dignity of unhurried moments.',
    reflectionQuestions: [
      'Where else in your day-to-day life are you carrying tension that does not belong to you?'
    ],
    suggestedThemes: ['Presence', 'Surrender', 'Autumn Stillness'],
    createdAt: Date.now() - 24 * 3600 * 1000,
    updatedAt: Date.now() - 24 * 3600 * 1000
  },
  {
    id: 'entry_sample_dawn',
    userId: 'sample_user',
    title: 'First Mist Over the Ridge',
    body: 'Woke at 5:30 AM before the rest of the world stirred. The air smelled of cold pine and damp moss. I stepped out onto the porch wrapped in an old woolen blanket, breath forming small clouds in the pale lavender sky.\n\nEvery new day feels like an apology from the universe. Whatever happened yesterday is already fossilized; today is still wet clay.',
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString().split('T')[0],
    timestamp: Date.now() - 48 * 3600 * 1000,
    timePhase: 'light',
    mood: 'peaceful',
    tags: ['morning', 'nature', 'pine', 'fresh-start'],
    location: {
      name: 'Cascade Mountain Ridge',
      address: 'Oregon, USA',
      lat: 45.37,
      lng: -121.69
    },
    photos: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    isMemory: true,
    aiSummary: 'A crisp dawn contemplation overlooking misty mountain ridges, viewing each dawn as an unwritten slate of wet clay.',
    reflectionQuestions: [
      'How might you treat today if you truly believed nothing from yesterday could stain it?'
    ],
    suggestedThemes: ['Renewal', 'Peace', 'Wilderness'],
    createdAt: Date.now() - 48 * 3600 * 1000,
    updatedAt: Date.now() - 48 * 3600 * 1000
  },
  {
    id: 'entry_sample_midnight',
    userId: 'sample_user',
    title: 'The Hours Between Midnight and Dawn',
    body: 'The clock has ticked past 1:40 AM. Outside, the rain has turned into a steady, comforting murmur against the windowpane. Everyone else is deep in their dreams, and for these few hours, there are no emails to answer, no expectations to fulfill.\n\nI’ve been wondering if my creative life has been starved because I only feed it leftover energy. If art requires our freshest hours, maybe I need to defend midnight with greater devotion.',
    date: new Date(Date.now() - 72 * 3600 * 1000).toISOString().split('T')[0],
    timestamp: Date.now() - 72 * 3600 * 1000,
    timePhase: 'dark',
    mood: 'dreamy',
    tags: ['creativity', 'midnight', 'rain', 'deep-thought'],
    location: {
      name: 'Attic Study & Bookcase',
      address: 'Home Haven'
    },
    photos: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    isMemory: true,
    aiSummary: 'A nocturnal meditation on artistic vocation, questioning whether creative energy deserves premier time rather than mere fragments.',
    reflectionQuestions: [
      'What small ritual could you introduce to protect your creative hours from daytime dilution?'
    ],
    suggestedThemes: ['Artistic Devotion', 'Silence', 'Nocturne'],
    createdAt: Date.now() - 72 * 3600 * 1000,
    updatedAt: Date.now() - 72 * 3600 * 1000
  }
];
