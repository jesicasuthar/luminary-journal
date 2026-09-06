export interface NotificationPayload {
  entryId: string;
  entryTitle: string;
  timePhase: string;
  mood: string;
  excerpt: string;
  channel: 'slack' | 'discord' | 'email';
  recipient?: string;
  userId: string;
}

export interface NotificationResult {
  success: boolean;
  message: string;
  channel: string;
  timestamp: number;
}

/**
 * Dispatches an external notification via server endpoint.
 */
export async function sendEntryNotification(payload: NotificationPayload): Promise<NotificationResult> {
  try {
    const res = await fetch('/api/notifications/dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Notification failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Notification dispatch error:', err);
    return {
      success: false,
      message: err.message || 'Notification service temporarily unreachable',
      channel: payload.channel,
      timestamp: Date.now()
    };
  }
}
