export type ThemeMode = 'light' | 'dark';
export type TimePhase = 'light' | 'dark';

export interface LocationData {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  body: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  timePhase: 'light' | 'dark' | string;
  mood: string;
  tags: string[];
  location?: LocationData;
  photos: string[]; // Polaroid data URLs or image links
  isMemory?: boolean;
  aiSummary?: string;
  reflectionQuestions?: string[];
  suggestedThemes?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  content?: string;
  timestamp: number;
  contextEntryId?: string;
  entryId?: string;
}

export interface ScrapbookMemory {
  id: string;
  entryId: string;
  title: string;
  date: string;
  excerpt: string;
  photoUrl?: string;
  mood: string;
  rotation: number;
  timestamp: number;
}

export interface PhaseThemeConfig {
  phase: 'light' | 'dark';
  displayName: string;
  mood: string;
  greeting: string;
  subGreeting: string;
  defaultPrompt: string;
  ctaText: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderColor: string;
  paperTextureClass: string;
  skyAtmosphere: string;
  ambientIcon: string;
}

export interface PromptItem {
  id: string;
  category: 'Light' | 'Dark' | 'Gratitude' | 'Self Reflection' | 'Growth' | 'Relationships' | 'Dreams' | 'Creativity';
  text: string;
  subtext?: string;
}

export interface AdminMetrics {
  totalUsers: number;
  totalEntries: number;
  totalConversations: number;
  totalMemories: number;
  geminiCalls: number;
  notificationsDispatched: number;
  activeToday: number;
  systemHealth: 'healthy' | 'degraded' | 'maintenance';
  uptimeSeconds: number;
  lastUpdated: string;
}

export type UserRole = 'guest' | 'user' | 'admin' | 'super_admin';

export type RBACPermission = 
  | 'write_entry'
  | 'read_own_entries'
  | 'use_gemini_companion'
  | 'view_telemetry'
  | 'manage_notifications'
  | 'view_audit_logs'
  | 'manage_rbac_roles'
  | 'edit_ai_directives';

export interface AdminRoleDirectiveConfig {
  version: string;
  directiveId: string;
  policyName: string;
  securityMode: 'strict_zero_trust' | 'balanced_guard' | 'permissive_dev';
  directiveRules: string[];
  systemPromptGuard: string;
  allowedAdminScopes: string[];
  lastUpdated: string;
  enforceZeroKnowledge: boolean;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: number;
  actor: string;
  action: string;
  role: UserRole;
  status: 'GRANTED' | 'DENIED' | 'ELEVATED';
  details: string;
  ip?: string;
}

export interface RBACEvaluationResult {
  allowed: boolean;
  role: UserRole;
  requiredRole: UserRole;
  reason: string;
  securityChecksPassed: string[];
  securityChecksFailed: string[];
  directiveId: string;
}
