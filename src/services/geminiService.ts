import { ConversationMessage } from '../types';

export interface AIReflectionResult {
  summary: string;
  keyThemes: string[];
  suggestedTags: string[];
  suggestedMood: string;
  reflectionQuestion: string;
  gentlePerspective: string;
}

export interface ChatResponse {
  reply: string;
  suggestedFollowUp?: string;
}

/**
 * Calls server-side Gemini endpoint for multi-turn journal conversation.
 */
export async function sendChatMessage(
  history: ConversationMessage[],
  newMessage: string,
  entryContext?: { title: string; body: string; mood: string; timePhase: string }
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: history.map(m => ({ role: m.role, text: m.text })),
        newMessage,
        entryContext
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply,
      suggestedFollowUp: data.suggestedFollowUp
    };
  } catch (err: any) {
    console.warn('Gemini chat request failed, using compassionate fallback:', err.message);
    return {
      reply: "I am listening closely to your thoughts. Sometimes putting feelings onto paper is the first quiet step toward untangling them. What part of what you just shared feels heaviest, or perhaps most in need of gentle light?",
      suggestedFollowUp: "How does writing this feel in this exact moment?"
    };
  }
}

/**
 * Calls server-side Gemini endpoint to generate entry reflection & summary.
 */
export async function generateEntryReflection(
  title: string,
  body: string,
  mood: string,
  timePhase: string
): Promise<AIReflectionResult> {
  try {
    const response = await fetch('/api/ai/reflect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body, mood, timePhase })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.warn('Gemini reflection request failed, providing thoughtful offline reflection:', err.message);
    return {
      summary: body.length > 10 ? body.slice(0, 120) + '...' : 'A quiet personal reflection recorded in ink.',
      keyThemes: ['Mindfulness', 'Personal Reflection', 'Presence'],
      suggestedTags: ['reflection', 'journal', timePhase.toLowerCase()],
      suggestedMood: mood || 'peaceful',
      reflectionQuestion: 'What part of this experience will you carry with you into tomorrow?',
      gentlePerspective: 'Every thought committed to paper is an act of honoring your unfolding story.'
    };
  }
}
