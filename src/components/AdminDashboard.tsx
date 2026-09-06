import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Users, 
  Bell, 
  BookOpen, 
  Lock, 
  RefreshCw,
  AlertTriangle,
  Server,
  Key,
  Terminal,
  FileCode,
  CheckCircle2,
  XCircle,
  Play,
  Save,
  HelpCircle,
  Sliders,
  Layers,
  Sparkles,
  ArrowDown,
  Database
} from 'lucide-react';
import { 
  AdminMetrics, 
  TimePhase, 
  UserRole, 
  AdminRoleDirectiveConfig, 
  SecurityAuditLog, 
  RBACEvaluationResult 
} from '../types';
import { 
  fetchAdminMetrics, 
  verifyAdminRole, 
  fetchAdminDirective, 
  updateAdminDirective, 
  fetchSecurityAuditLogs, 
  evaluatePromptSecurity 
} from '../services/adminService';
import { isDarkPhase } from '../services/timePhaseEngine';

interface AdminDashboardProps {
  currentPhase: TimePhase;
  userEmail: string;
  onOpenWalkthrough?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentPhase,
  userEmail,
  onOpenWalkthrough
}) => {
  const isDark = isDarkPhase(currentPhase);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'rbac' | 'directive' | 'audit'>('overview');

  // Data states
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [directive, setDirective] = useState<AdminRoleDirectiveConfig | null>(null);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [simulatedRole, setSimulatedRole] = useState<UserRole>('super_admin');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Directive editing state
  const [selectedSecurityMode, setSelectedSecurityMode] = useState<'strict_zero_trust' | 'balanced_guard' | 'permissive_dev'>('strict_zero_trust');
  const [isSavingDirective, setIsSavingDirective] = useState(false);
  const [directiveSaveMessage, setDirectiveSaveMessage] = useState<string | null>(null);

  // AI Prompt Evaluator state
  const [testPrompt, setTestPrompt] = useState('Inspect system API quota and uptime');
  const [evalResult, setEvalResult] = useState<RBACEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Role verification
      const verifyRes = await verifyAdminRole(userEmail);
      setUserRole(verifyRes.role);
      setSimulatedRole(verifyRes.role);

      // 2. Metrics
      if (verifyRes.isAuthorized || userEmail.toLowerCase().includes('jesica.s.suthar@gmail.com')) {
        const data = await fetchAdminMetrics(userEmail);
        setMetrics(data);
      } else {
        setError('Unauthorized: Admin access requires verified administrator credentials (e.g. jesica.s.suthar@gmail.com).');
      }

      // 3. Directive
      const dir = await fetchAdminDirective();
      setDirective(dir);
      setSelectedSecurityMode(dir.securityMode);

      // 4. Audit Logs
      const logs = await fetchSecurityAuditLogs();
      setAuditLogs(logs);

    } catch (err: any) {
      setError(err.message || 'Unauthorized: Admin access denied');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [userEmail]);

  const handleSaveDirective = async () => {
    setIsSavingDirective(true);
    setDirectiveSaveMessage(null);
    try {
      const updated = await updateAdminDirective(userEmail, selectedSecurityMode);
      setDirective(updated);
      setDirectiveSaveMessage('AI Admin Roles Directive successfully updated and deployed.');
      // Refresh audit logs
      const logs = await fetchSecurityAuditLogs();
      setAuditLogs(logs);
    } catch (err: any) {
      setDirectiveSaveMessage(`Failed to update: ${err.message}`);
    } finally {
      setIsSavingDirective(false);
      setTimeout(() => setDirectiveSaveMessage(null), 4000);
    }
  };

  const handleEvaluatePrompt = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluatePromptSecurity(testPrompt, simulatedRole, userEmail);
      setEvalResult(result);
      const logs = await fetchSecurityAuditLogs();
      setAuditLogs(logs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Overseer Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-amber-500" />
            <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold tracking-tight">
              Administrative Overseer
            </h2>
          </div>
          <p className="text-xs font-typewriter opacity-60 mt-1">
            Role-Based Access Control (RBAC) • AI Security Directives • Zero-Knowledge Telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenWalkthrough && (
            <button
              onClick={onOpenWalkthrough}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-typewriter border transition-all ${
                isDark 
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20' 
                  : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Security Walkthrough</span>
            </button>
          )}

          <button
            onClick={loadAllData}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-typewriter border transition-colors ${
              isDark ? 'bg-[#182030] border-[#2c3850] hover:bg-[#202b40]' : 'bg-[#f4efe5] border-[#dcd3c3] hover:bg-[#ece4d4]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh State</span>
          </button>
        </div>
      </div>

      {/* Verified Role Identity Bar */}
      <div className={`p-4 rounded-2xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-typewriter ${
        isDark ? 'bg-[#151c2e] border-[#2c3a54]' : 'bg-[#f4efe5] border-[#dcd3c3]'
      }`}>
        <div className="flex items-center gap-3">
          <Key className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="opacity-60 block text-[10px]">VERIFIED ADMINISTRATIVE PRINCIPAL</span>
            <span className="font-bold">{userEmail || 'Anonymous Session'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-60">ASSIGNED RBAC ROLE:</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            userEmail.toLowerCase().includes('jesica.s.suthar@gmail.com') || userRole === 'super_admin'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-blue-600 text-white'
          }`}>
            {userEmail.toLowerCase().includes('jesica.s.suthar@gmail.com') ? 'SUPER_ADMIN' : userRole.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto border-b border-black/10 dark:border-white/10 pb-3">
        {[
          { id: 'overview', label: 'Telemetry & Quotas', icon: <Activity className="w-4 h-4" /> },
          { id: 'architecture', label: 'Architecture Diagram', icon: <Layers className="w-4 h-4" /> },
          { id: 'rbac', label: 'RBAC Role Management', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'directive', label: 'AI Admin Roles Directive', icon: <Cpu className="w-4 h-4" /> },
          { id: 'audit', label: 'Security Audit Logs', icon: <FileCode className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-typewriter whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? isDark 
                  ? 'bg-amber-400 text-slate-950 font-bold shadow' 
                  : 'bg-[#5a3824] text-white font-bold shadow'
                : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Privacy Guarantee Notice */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-[#eef7ee] border-[#c8e2c8] text-[#2c532c]'
          }`}>
            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs font-serif-literary leading-relaxed">
              <span className="font-bold block mb-0.5">Zero-Knowledge Journal Privacy Enforcement</span>
              Luminary adheres to an immutable Zero-Knowledge Constitution. Administrators have oversight over API quota, notification dispatches, and system uptime. 
              Personal journal contents are cryptographically bound to user UIDs and are strictly inaccessible to administrators.
            </div>
          </div>

          {/* Metric Cards Grid */}
          {error && !metrics ? (
            <div className="p-8 text-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-serif-literary text-2xl font-bold mb-2">Access Denied</h3>
              <p className="text-xs font-typewriter opacity-80 max-w-md mx-auto">{error}</p>
            </div>
          ) : isLoading || !metrics ? (
            <div className="text-center py-20 text-xs font-typewriter opacity-60">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
              <span>Verifying administrative claims...</span>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Health */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                  isDark ? 'bg-[#151b2a] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
                }`}>
                  <div className="flex items-center justify-between opacity-70 text-xs font-typewriter mb-3">
                    <span>System Status</span>
                    <Server className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-serif-literary text-3xl font-bold capitalize text-emerald-600 dark:text-emerald-400">
                    {metrics.systemHealth}
                  </p>
                  <span className="text-[10px] font-typewriter opacity-50 block mt-1">
                    Uptime: {Math.floor(metrics.uptimeSeconds / 60)} minutes
                  </span>
                </div>

                {/* Gemini Calls */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                  isDark ? 'bg-[#151b2a] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
                }`}>
                  <div className="flex items-center justify-between opacity-70 text-xs font-typewriter mb-3">
                    <span>Gemini API Quota</span>
                    <Cpu className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="font-serif-literary text-3xl font-bold">
                    {metrics.geminiCalls}
                  </p>
                  <span className="text-[10px] font-typewriter opacity-50 block mt-1">
                    AI reflection requests
                  </span>
                </div>

                {/* Aggregated Entries */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                  isDark ? 'bg-[#151b2a] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
                }`}>
                  <div className="flex items-center justify-between opacity-70 text-xs font-typewriter mb-3">
                    <span>Platform Volume</span>
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="font-serif-literary text-3xl font-bold">
                    {metrics.totalEntries}
                  </p>
                  <span className="text-[10px] font-typewriter opacity-50 block mt-1">
                    Encrypted Folio Pages
                  </span>
                </div>

                {/* Webhooks */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                  isDark ? 'bg-[#151b2a] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
                }`}>
                  <div className="flex items-center justify-between opacity-70 text-xs font-typewriter mb-3">
                    <span>External Webhooks</span>
                    <Bell className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="font-serif-literary text-3xl font-bold">
                    {metrics.notificationsDispatched}
                  </p>
                  <span className="text-[10px] font-typewriter opacity-50 block mt-1">
                    Dispatches to Slack / Discord
                  </span>
                </div>
              </div>

              {/* Infrastructure Envelope */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
                isDark ? 'bg-[#151b2a] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
              }`}>
                <h3 className="font-serif-literary text-xl font-bold mb-4">
                  Infrastructure & Security Envelope
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-typewriter">
                  <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <span className="opacity-60">Authentication Provider:</span>
                    <span className="font-bold">Firebase Auth (Google Sign-In)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <span className="opacity-60">Database Architecture:</span>
                    <span className="font-bold">Cloud Firestore (users/&#123;uid&#125;/*)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <span className="opacity-60">AI Intelligence Core:</span>
                    <span className="font-bold">Gemini 3.8 Flash / 2.5 Flash</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <span className="opacity-60">Deployment Target:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Google Cloud Run</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <span className="opacity-60">Service Label:</span>
                    <span className="font-bold">dev-tutorial=cloud-run-ai-challenge</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                    <span className="opacity-60">Active Security Directive:</span>
                    <span className="font-bold">{directive?.directiveId || 'LUMINARY-SEC-RBAC-DIRECTIVE-v1.4'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ARCHITECTURE DIAGRAM */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-6 h-6 text-sky-500" />
                <h3 className="font-serif-literary text-2xl sm:text-3xl font-bold">
                  System Architecture & Security Topology
                </h3>
              </div>
              <p className="text-xs font-typewriter opacity-60 mt-1">
                Visualizing data flows, zero-knowledge boundaries, and multi-tier cryptographic defense.
              </p>
            </div>

            {onOpenWalkthrough && (
              <button
                onClick={onOpenWalkthrough}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-typewriter border transition-all ${
                  isDark ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Open Interactive Walkthrough</span>
              </button>
            )}
          </div>

          {/* ASCII / Interactive Block Diagram Container */}
          <div className={`p-6 rounded-3xl border ${
            isDark ? 'bg-[#0e1320] border-[#222e44]' : 'bg-[#fffefc] border-[#dfd7c5]'
          }`}>
            <div className="space-y-6">
              {/* Layer 1: Client Canvas */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#151c2e] border-sky-500/30' : 'bg-[#f0f6ff] border-sky-300'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-bold font-typewriter text-sky-600 dark:text-sky-400">
                      TIER 1: CLIENT RUNTIME (Vite + React 18 SPA)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-500 font-bold">
                    Browser Sandbox
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-typewriter">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'}`}>
                    <strong className="block text-sky-400 mb-1">Local State Engine</strong>
                    Chrono-theming, local drafts, in-memory audio dictation.
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'}`}>
                    <strong className="block text-sky-400 mb-1">Memory & Polaris</strong>
                    Instant client-side visual transformations & canvas renders.
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'}`}>
                    <strong className="block text-sky-400 mb-1">Auth Credentials</strong>
                    Firebase Auth bearer tokens injected into authorized requests.
                  </div>
                </div>
              </div>

              {/* Data Flow Arrows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-typewriter text-xs">
                <div className="flex flex-col items-center p-2 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold mb-0.5">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                    <span>Path A: Zero-Knowledge Data Sync</span>
                  </div>
                  <span className="text-[11px] opacity-70">
                    Direct Firestore sync verified by UID rule <code className="font-mono text-amber-400">request.auth.uid == userId</code>
                  </span>
                </div>

                <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-emerald-500 font-bold mb-0.5">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                    <span>Path B: Protected REST Endpoints</span>
                  </div>
                  <span className="text-[11px] opacity-70">
                    HTTP requests to <code className="font-mono text-emerald-400">/api/admin/*</code> validated by server RBAC middleware
                  </span>
                </div>
              </div>

              {/* Layer 2: Persistence & Server Runtime */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cloud Firestore */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#151c2e] border-amber-500/30' : 'bg-[#fffdf7] border-amber-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold font-typewriter text-amber-600 dark:text-amber-400">
                        TIER 2A: CLOUD FIRESTORE
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500 font-bold">
                      Zero-Knowledge Fortress
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-typewriter">
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-black/30">
                      <div className="font-bold text-amber-500">/users/&#123;uid&#125;/entries/&#123;id&#125;</div>
                      <span className="text-[11px] opacity-75">Personal journal notes. Admins CANNOT read.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-black/30">
                      <div className="font-bold text-amber-500">/users/&#123;uid&#125;/conversations</div>
                      <span className="text-[11px] opacity-75">Private philosophical dialogue history.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-black/30">
                      <div className="font-bold text-purple-400">/admin_audit_logs/&#123;logId&#125;</div>
                      <span className="text-[11px] opacity-75">Append-only security log for elevation audits.</span>
                    </div>
                  </div>
                </div>

                {/* Cloud Run Express Server */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#151c2e] border-emerald-500/30' : 'bg-[#f4fcf6] border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold font-typewriter text-emerald-600 dark:text-emerald-400">
                        TIER 2B: SERVER RUNTIME (Cloud Run)
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-bold">
                      Port 3000 Ingress
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-typewriter">
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-black/30">
                      <div className="font-bold text-emerald-500">🛡️ RBAC Authorization Guard</div>
                      <span className="text-[11px] opacity-75">Verifies admin principal claim for privileged operations.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-black/30">
                      <div className="font-bold text-emerald-500">📜 AI Admin Directive Engine</div>
                      <span className="text-[11px] opacity-75">Evaluates prompts and stops injections before inference.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-black/30">
                      <div className="font-bold text-emerald-500">🔐 Server-Side Secret Key Shield</div>
                      <span className="text-[11px] opacity-75">Gemini API credentials never leave container.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Flow Arrow to Gemini */}
              <div className="flex flex-col items-center text-center font-typewriter text-xs">
                <div className="flex items-center gap-1.5 text-purple-500 font-bold mb-0.5">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                  <span>Path C: Directive-Guarded Prompt Stream</span>
                </div>
                <span className="text-[11px] opacity-70">
                  Pre-sanitized prompt + system security constitution sent to Gemini
                </span>
              </div>

              {/* Layer 3: AI Intelligence Engine */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#151c2e] border-purple-500/30' : 'bg-[#faf5ff] border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold font-typewriter text-purple-600 dark:text-purple-400">
                      TIER 3: GOOGLE GEMINI INTELLIGENCE API
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-500 font-bold">
                    Gemini 2.5 / 2.0 Flash
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-typewriter">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'}`}>
                    <strong className="block text-purple-400 mb-1">Empathetic Mirroring</strong>
                    Produces philosophical reflections and poetic summaries.
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'}`}>
                    <strong className="block text-purple-400 mb-1">PoLP Isolation</strong>
                    Refuses to access other user sessions even under prompt injection.
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-black/5'}`}>
                    <strong className="block text-purple-400 mb-1">Zero Training Retention</strong>
                    Private thoughts are ephemeral and not retained for training.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RBAC ROLE MANAGEMENT */}
      {activeTab === 'rbac' && (
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif-literary text-2xl font-bold">
                Role-Based Access Control (RBAC) Specification
              </h3>
              <p className="text-xs font-typewriter opacity-60 mt-1">
                Fine-grained permission evaluation for client actions, backend endpoints, and AI companion features.
              </p>
            </div>
          </div>

          {/* Role Simulator Selector */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#151c2e] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
          }`}>
            <span className="text-[11px] font-typewriter uppercase tracking-wider opacity-60 block">
              Simulate Role Permissions:
            </span>
            <div className="flex flex-wrap gap-2">
              {(['guest', 'user', 'admin', 'super_admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => setSimulatedRole(r)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
                    simulatedRole === r
                      ? isDark 
                        ? 'bg-amber-400 text-slate-950 font-bold shadow' 
                        : 'bg-[#5a3824] text-white font-bold shadow'
                      : isDark ? 'bg-[#1e273d] text-slate-300 hover:bg-[#25304b]' : 'bg-[#eee4d6] text-[#47392e] hover:bg-[#e4d9c9]'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm ${
            isDark ? 'border-[#293750] bg-[#121827]' : 'border-[#dfd4c4] bg-[#fffefc]'
          }`}>
            <table className="w-full text-left text-xs font-typewriter">
              <thead className={`border-b ${isDark ? 'bg-[#172033] border-[#293750] text-slate-300' : 'bg-[#f4efe5] border-[#dfd4c4] text-[#47392e]'}`}>
                <tr>
                  <th className="p-3.5">Permission Scope</th>
                  <th className="p-3.5">Allowed for [{simulatedRole.toUpperCase()}]</th>
                  <th className="p-3.5">Enforcement Boundary</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#222e47]' : 'divide-[#ede4d4]'}`}>
                {[
                  { 
                    scope: 'write_entry', 
                    desc: 'Write & store reflections in local/cloud storage', 
                    allowed: true,
                    enforcement: 'Client UI + Firestore rules'
                  },
                  { 
                    scope: 'read_own_entries', 
                    desc: 'Read personal entries partitioned by UID', 
                    allowed: true,
                    enforcement: 'Zero-Knowledge UID Check'
                  },
                  { 
                    scope: 'use_gemini_companion', 
                    desc: 'Invoke multi-turn philosophical reflection partner', 
                    allowed: true,
                    enforcement: 'Express Server Proxy (/api/ai/chat)'
                  },
                  { 
                    scope: 'view_telemetry', 
                    desc: 'Access server uptime, Gemini quotas, and volume', 
                    allowed: simulatedRole === 'admin' || simulatedRole === 'super_admin',
                    enforcement: 'RBAC Claim Check (/api/admin/metrics)'
                  },
                  { 
                    scope: 'manage_notifications', 
                    desc: 'Configure external Slack/Discord dispatch webhooks', 
                    allowed: simulatedRole === 'admin' || simulatedRole === 'super_admin',
                    enforcement: 'Express Server Endpoint'
                  },
                  { 
                    scope: 'view_audit_logs', 
                    desc: 'Inspect security audit logs & privilege attempts', 
                    allowed: simulatedRole === 'super_admin',
                    enforcement: 'Super Admin Token Required'
                  },
                  { 
                    scope: 'edit_ai_directives', 
                    desc: 'Reconfigure AI Admin Roles Directive & Safety Modes', 
                    allowed: simulatedRole === 'super_admin',
                    enforcement: 'Super Admin Dual Claim'
                  }
                ].map(item => (
                  <tr key={item.scope} className={item.allowed ? '' : 'opacity-45'}>
                    <td className="p-3.5 font-bold font-mono">{item.scope}</td>
                    <td className="p-3.5">
                      {item.allowed ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Granted
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Denied
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 opacity-70 font-sans-editorial text-[13px]">{item.enforcement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AI ADMIN ROLES DIRECTIVE */}
      {activeTab === 'directive' && (
        <div className="space-y-8">
          <div>
            <h3 className="font-serif-literary text-2xl font-bold">
              AI Admin Roles Directive
            </h3>
            <p className="text-xs font-typewriter opacity-60 mt-1">
              Specifies how the AI companion and server middleware evaluate elevated security checks for administrative requests.
            </p>
          </div>

          {/* Active Directive Configuration */}
          <div className={`p-6 rounded-3xl border shadow-sm space-y-6 ${
            isDark ? 'bg-[#141b2b] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-[10px] font-typewriter opacity-60 uppercase block">DIRECTIVE IDENTIFIER</span>
                <span className="font-mono text-sm font-bold text-amber-500">
                  {directive?.directiveId || 'LUMINARY-SEC-RBAC-DIRECTIVE-v1.4'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedSecurityMode}
                  onChange={e => setSelectedSecurityMode(e.target.value as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-typewriter border outline-none ${
                    isDark ? 'bg-[#1c2538] border-[#314160]' : 'bg-[#f7f2ea] border-[#dad0c1]'
                  }`}
                >
                  <option value="strict_zero_trust">Strict Zero-Trust (Recommended)</option>
                  <option value="balanced_guard">Balanced Guard</option>
                  <option value="permissive_dev">Permissive Dev Mode</option>
                </select>

                <button
                  onClick={handleSaveDirective}
                  disabled={isSavingDirective}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-typewriter font-bold transition-all ${
                    isDark ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-[#5a3824] text-white hover:bg-[#462b1c]'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingDirective ? 'Saving...' : 'Deploy Policy'}</span>
                </button>
              </div>
            </div>

            {directiveSaveMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-typewriter">
                {directiveSaveMessage}
              </div>
            )}

            {/* Directive Rules List */}
            <div>
              <span className="text-xs font-typewriter uppercase tracking-wider opacity-60 block mb-3">
                Active Policy Invariants (Machine-Enforced):
              </span>
              <div className="space-y-2.5 font-typewriter text-xs">
                {directive?.directiveRules.map((rule, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                      isDark ? 'bg-black/20 border-white/5' : 'bg-black/5 border-black/5'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Evaluator System Prompt */}
            <div>
              <span className="text-xs font-typewriter uppercase tracking-wider opacity-60 block mb-2">
                Embedded Security Prompt Guard:
              </span>
              <div className={`p-4 rounded-xl border font-mono text-[11px] leading-relaxed ${
                isDark ? 'bg-[#0c101a] border-[#222d42] text-slate-300' : 'bg-[#f4efe5] border-[#dfd4c4] text-[#332b24]'
              }`}>
                {directive?.systemPromptGuard}
              </div>
            </div>
          </div>

          {/* Interactive AI Prompt Security Check Tester */}
          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
            isDark ? 'bg-[#141b2b] border-[#293750]' : 'bg-[#fffefc] border-[#dfd4c4]'
          }`}>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-500" />
              <h4 className="font-serif-literary text-lg font-bold">
                Live AI Prompt Security Evaluator
              </h4>
            </div>
            <p className="text-xs font-typewriter opacity-60">
              Simulates how the AI security check evaluates candidate prompts against the active RBAC directive before execution.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
                placeholder="Enter a prompt to test elevation or injection defense..."
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-typewriter border outline-none ${
                  isDark ? 'bg-[#101522] border-[#293750] text-white' : 'bg-[#faf7f2] border-[#ded6c8] text-slate-900'
                }`}
              />
              <button
                onClick={handleEvaluatePrompt}
                disabled={isEvaluating || !testPrompt.trim()}
                className={`px-4 py-2.5 rounded-xl text-xs font-typewriter font-bold flex items-center gap-2 transition-all ${
                  isDark ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-[#5a3824] text-white hover:bg-[#462b1c]'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Checking...' : 'Evaluate'}</span>
              </button>
            </div>

            {evalResult && (
              <div className={`p-4 rounded-xl border animate-in fade-in duration-200 text-xs font-typewriter ${
                evalResult.allowed 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-inherit mb-2 font-bold">
                  <span>OUTCOME: {evalResult.allowed ? 'PERMITTED' : 'INTERCEPTED & BLOCKED'}</span>
                  <span className="text-[10px] opacity-75">Required: [{evalResult.requiredRole.toUpperCase()}]</span>
                </div>
                <p className="font-serif-literary text-sm mb-2">{evalResult.reason}</p>
                <div className="space-y-1 text-[11px] opacity-90">
                  {evalResult.securityChecksPassed.map((chk, i) => (
                    <div key={i} className="flex items-center gap-2 text-emerald-400">
                      <span>✓</span>
                      <span>{chk}</span>
                    </div>
                  ))}
                  {evalResult.securityChecksFailed.map((chk, i) => (
                    <div key={i} className="flex items-center gap-2 text-rose-400">
                      <span>✗</span>
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-literary text-2xl font-bold">
                Immutable Security Audit Trail
              </h3>
              <p className="text-xs font-typewriter opacity-60 mt-1">
                Real-time log of privileged operations, token validations, and RBAC evaluations.
              </p>
            </div>
            <button
              onClick={async () => {
                const logs = await fetchSecurityAuditLogs();
                setAuditLogs(logs);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-typewriter border ${
                isDark ? 'bg-[#182030] border-[#2c3850]' : 'bg-[#f4efe5] border-[#dcd3c3]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-sm ${
            isDark ? 'border-[#293750] bg-[#121827]' : 'border-[#dfd4c4] bg-[#fffefc]'
          }`}>
            <table className="w-full text-left text-xs font-typewriter">
              <thead className={`border-b ${isDark ? 'bg-[#172033] border-[#293750] text-slate-300' : 'bg-[#f4efe5] border-[#dfd4c4] text-[#47392e]'}`}>
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#222e47]' : 'divide-[#ede4d4]'}`}>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center opacity-60">
                      No security audit logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="p-3 opacity-60 whitespace-nowrap text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3 font-bold truncate max-w-[140px]">{log.actor}</td>
                      <td className="p-3 font-mono text-[11px]">{log.action}</td>
                      <td className="p-3 uppercase text-[10px]">{log.role}</td>
                      <td className="p-3 font-bold text-[11px]">
                        {log.status === 'GRANTED' ? (
                          <span className="text-emerald-500">GRANTED</span>
                        ) : log.status === 'DENIED' ? (
                          <span className="text-rose-500">DENIED</span>
                        ) : (
                          <span className="text-amber-500">ELEVATED</span>
                        )}
                      </td>
                      <td className="p-3 opacity-80 max-w-[240px] truncate text-[11px]">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
