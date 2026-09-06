import { 
  AdminMetrics, 
  AdminRoleDirectiveConfig, 
  SecurityAuditLog, 
  RBACEvaluationResult, 
  UserRole,
  RBACPermission 
} from '../types';

export interface VerifyRoleResponse {
  email: string;
  role: UserRole;
  isAuthorized: boolean;
  permissions: RBACPermission[];
  directiveId: string;
}

export async function fetchAdminMetrics(userEmail: string, idToken?: string): Promise<AdminMetrics> {
  const res = await fetch('/api/admin/metrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
    },
    body: JSON.stringify({ email: userEmail })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Unauthorized: Admin access denied');
  }

  return await res.json();
}

export async function verifyAdminRole(userEmail: string): Promise<VerifyRoleResponse> {
  const res = await fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  });

  if (!res.ok) {
    return {
      email: userEmail,
      role: 'guest',
      isAuthorized: false,
      permissions: ['write_entry', 'read_own_entries', 'use_gemini_companion'],
      directiveId: 'LUMINARY-SEC-RBAC-DIRECTIVE-v1.4'
    };
  }

  return await res.json();
}

export async function fetchAdminDirective(): Promise<AdminRoleDirectiveConfig> {
  const res = await fetch('/api/admin/directive');
  if (!res.ok) {
    throw new Error('Failed to fetch AI Admin Roles Directive');
  }
  return await res.json();
}

export async function updateAdminDirective(
  email: string, 
  securityMode: 'strict_zero_trust' | 'balanced_guard' | 'permissive_dev',
  directiveRules?: string[]
): Promise<AdminRoleDirectiveConfig> {
  const res = await fetch('/api/admin/directive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, securityMode, directiveRules })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update AI Admin Roles Directive');
  }

  const data = await res.json();
  return data.directive;
}

export async function fetchSecurityAuditLogs(): Promise<SecurityAuditLog[]> {
  const res = await fetch('/api/admin/audit-logs');
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.logs || [];
}

export async function evaluatePromptSecurity(
  prompt: string, 
  simulatedRole: UserRole, 
  email: string
): Promise<RBACEvaluationResult> {
  const res = await fetch('/api/admin/evaluate-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, simulatedRole, email })
  });

  if (!res.ok) {
    throw new Error('Security evaluation service unavailable');
  }

  return await res.json();
}
