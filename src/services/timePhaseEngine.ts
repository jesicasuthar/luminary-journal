import { TimePhase, PhaseThemeConfig } from '../types';

export const THEME_CONFIGS: Record<'light' | 'dark', PhaseThemeConfig> = {
  light: {
    phase: 'light',
    displayName: 'Light Mode',
    mood: 'Bright, focused & clear',
    greeting: 'The day is open before you.',
    subGreeting: 'Warm ivory parchment and the steady cadence of mindful thought.',
    defaultPrompt: 'What deserves your true attention right now, amidst the rhythm of the day?',
    ctaText: 'Write in sunlight',
    bgGradient: 'from-[#fbf9f4] via-[#f7f3e8] to-[#edf3eb]',
    cardBg: 'bg-[#fffffb]/95 border-[#dfd7c5]',
    textColor: 'text-[#2b3027]',
    mutedTextColor: 'text-[#6f7566]',
    accentColor: '#5c7857',
    borderColor: 'border-[#dfd7c5]',
    paperTextureClass: 'paper-texture',
    skyAtmosphere: 'linear-gradient(135deg, #fcfaf5 0%, #f5eedb 50%, #eaf0e6 100%)',
    ambientIcon: 'Sun'
  },
  dark: {
    phase: 'dark',
    displayName: 'Dark Mode',
    mood: 'Calm, quiet & introspective',
    greeting: 'Quiet reflection in the stillness.',
    subGreeting: 'Velvet night pages and warm lamplight for your introspections.',
    defaultPrompt: 'What thought keeps returning to you when everything else is still?',
    ctaText: 'Reflect in the quiet',
    bgGradient: 'from-[#0d121c] via-[#141b29] to-[#1a2336]',
    cardBg: 'bg-[#151d2e]/92 border-[#2b374f]',
    textColor: 'text-[#e6ecf8]',
    mutedTextColor: 'text-[#96a5c4]',
    accentColor: '#8ea6db',
    borderColor: 'border-[#2b374f]',
    paperTextureClass: 'paper-texture-dark',
    skyAtmosphere: 'linear-gradient(135deg, #0a0e17 0%, #131a28 60%, #1b263b 100%)',
    ambientIcon: 'Moon'
  }
};

// Proxy or alias for PHASE_CONFIGS with backward compatibility
export const PHASE_CONFIGS: Record<string, PhaseThemeConfig> = new Proxy(THEME_CONFIGS as any, {
  get(target, prop: string) {
    if (prop === 'dark' || prop === 'DUSK' || prop === 'NIGHT' || prop === 'MIDNIGHT') {
      return target.dark;
    }
    return target.light;
  }
});

/**
 * Calculates default theme based on current local browser time.
 * Day hours (6:00 AM - 6:59 PM) default to light, night hours to dark.
 */
export function getCurrentTimePhase(date: Date = new Date()): TimePhase {
  const hours = date.getHours();
  if (hours >= 6 && hours < 19) {
    return 'light';
  }
  return 'dark';
}

export function isDarkPhase(phase: string): boolean {
  return phase === 'dark' || phase === 'DUSK' || phase === 'NIGHT' || phase === 'MIDNIGHT';
}
