import { PromptItem, TimePhase } from '../types';
import { isDarkPhase } from './timePhaseEngine';

export const PROMPTS: PromptItem[] = [
  // Light Mode Inquiries
  {
    id: 'p_light_1',
    category: 'Light',
    text: 'What intention or gentle focus would you like to welcome into today?',
    subtext: 'Before the world makes its demands, listen to what your mind truly needs.'
  },
  {
    id: 'p_light_2',
    category: 'Light',
    text: 'What deserves your true attention right now, amidst the rhythm of the day?',
    subtext: 'Distinguish the urgent noise from what is essential.'
  },
  {
    id: 'p_light_3',
    category: 'Light',
    text: 'If today was a clean canvas with no past mistakes attached, how would you begin?',
    subtext: 'Starting fresh with clarity and unburdened enthusiasm.'
  },
  {
    id: 'p_light_4',
    category: 'Light',
    text: 'What is bringing you steady energy and purpose as the day unfolds?',
    subtext: 'Notice the cup of tea, the quiet conversation, or the small victory.'
  },

  // Dark Mode Inquiries
  {
    id: 'p_dark_1',
    category: 'Dark',
    text: 'What are you carrying that you could gently set down tonight?',
    subtext: 'Giving your mind permission to rest without holding the world.'
  },
  {
    id: 'p_dark_2',
    category: 'Dark',
    text: 'What thought keeps returning to you when everything else is still?',
    subtext: 'The quiet ideas that surface only when the house is silent.'
  },
  {
    id: 'p_dark_3',
    category: 'Dark',
    text: 'What moment from today would you like to preserve before closing your eyes?',
    subtext: 'Collecting small gems of memory from today.'
  },
  {
    id: 'p_dark_4',
    category: 'Dark',
    text: 'What can you forgive yourself for as the day comes to an end?',
    subtext: 'Releasing harsh self-critique and welcoming stillness.'
  },

  // Gratitude
  {
    id: 'p_grat_1',
    category: 'Gratitude',
    text: 'Name three mundane things that kept you alive, warm, or comforted today.',
    subtext: 'A warm mug, running water, clean linen, or a comfortable chair.'
  },
  {
    id: 'p_grat_2',
    category: 'Gratitude',
    text: 'Who is someone from your past whose kindness still ripples through who you are?',
    subtext: 'Sending a quiet thank-you backwards through time.'
  },

  // Self Reflection
  {
    id: 'p_refl_1',
    category: 'Self Reflection',
    text: 'How have your priorities quietly shifted over the past few months?',
    subtext: 'Tracing the subtle tectonic shifts within your values.'
  },
  {
    id: 'p_refl_2',
    category: 'Self Reflection',
    text: 'Where are you pretending to be fine when you are actually weary?',
    subtext: 'Radical honesty behind closed journal pages.'
  },

  // Growth
  {
    id: 'p_growth_1',
    category: 'Growth',
    text: 'What boundary did you protect recently, or what boundary is calling to be drawn?',
    subtext: 'Protecting your inner peace so new things may flourish.'
  },
  {
    id: 'p_growth_2',
    category: 'Growth',
    text: 'What hard lesson has recently transformed into a piece of quiet wisdom?',
    subtext: 'Gleaning clarity from past challenges.'
  },

  // Relationships
  {
    id: 'p_rel_1',
    category: 'Relationships',
    text: 'What unexpressed appreciation do you harbor for someone close to you?',
    subtext: 'Putting into words the unspoken graces between people.'
  },

  // Dreams & Creativity
  {
    id: 'p_dream_1',
    category: 'Dreams',
    text: 'Describe a place—real or imagined—where you feel completely at peace.',
    subtext: 'Painting your inner landscape with literary brushstrokes.'
  },
  {
    id: 'p_crea_1',
    category: 'Creativity',
    text: 'If your current season of life was a book title, what would it be named?',
    subtext: 'Viewing your lived journey through an authorial lens.'
  }
];

export function getRecommendedPromptsForPhase(phase: TimePhase): PromptItem[] {
  const isDark = isDarkPhase(phase);
  const targetCategory = isDark ? 'Dark' : 'Light';
  const primary = PROMPTS.filter(p => p.category === targetCategory);
  const secondary = PROMPTS.filter(p => p.category === 'Gratitude' || p.category === 'Self Reflection');
  return [...primary, ...secondary];
}
