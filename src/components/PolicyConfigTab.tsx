import React, { useState } from 'react';
import { 
  Sliders, 
  FileCode, 
  Check, 
  Copy, 
  Download, 
  Save, 
  Shield, 
  Coins, 
  Lock, 
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { PolicyConfig } from '../types.ts';

interface PolicyConfigTabProps {
  policyConfig: PolicyConfig;
  setPolicyConfig: React.Dispatch<React.SetStateAction<PolicyConfig>>;
}

export const PolicyConfigTab: React.FC<PolicyConfigTabProps> = ({ policyConfig, setPolicyConfig }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [newTopic, setNewTopic] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState<string>('');

  const toggleEntity = (entity: string) => {
    setPolicyConfig((prev) => {
      const exists = prev.piiEntities.includes(entity);
      return {
        ...prev,
        piiEntities: exists
          ? prev.piiEntities.filter((e) => e !== entity)
          : [...prev.piiEntities, entity],
      };
    });
  };

  const addBlockedTopic = () => {
    if (!newTopic.trim()) return;
    setPolicyConfig((prev) => ({
      ...prev,
      blockedTopics: [...prev.blockedTopics, newTopic.trim().toLowerCase()],
    }));
    setNewTopic('');
  };

  const removeBlockedTopic = (topic: string) => {
    setPolicyConfig((prev) => ({
      ...prev,
      blockedTopics: prev.blockedTopics.filter((t) => t !== topic),
    }));
  };

  const addDeniedKeyword = () => {
    if (!newKeyword.trim()) return;
    setPolicyConfig((prev) => ({
      ...prev,
      deniedKeywords: [...prev.deniedKeywords, newKeyword.trim().toLowerCase()],
    }));
    setNewKeyword('');
  };

  const removeDeniedKeyword = (kw: string) => {
    setPolicyConfig((prev) => ({
      ...prev,
      deniedKeywords: prev.deniedKeywords.filter((k) => k !== kw),
    }));
  };

  const generateYaml = () => {
    return `# suojAIta Centralized Security & Guardrail Policy
# Formal Requirement 3: Unified Configuration Specification
version: "2.4"
policy_name: "enterprise-production-baseline"

deterministic:
  enabled: ${policyConfig.enableDeterministic}
  action: "${policyConfig.deterministicAction}" # options: redact | block | flag
  scanned_entities:
${policyConfig.piiEntities.map((e) => `    - "${e}"`).join('\n')}
  denied_keywords:
${policyConfig.deniedKeywords.map((k) => `    - "${k}"`).join('\n')}

semantic:
  enabled: ${policyConfig.enableSemantic}
  safety_model: "gemini-3.8-flash"
  injection_confidence_threshold: ${policyConfig.semanticThreshold}
  enforce_jailbreak_defense: true
  blocked_domain_topics:
${policyConfig.blockedTopics.map((t) => `    - "${t}"`).join('\n')}

budget_and_rate_limits:
  max_tokens_per_request: ${policyConfig.maxTokensPerRequest}
  daily_user_token_cap: ${policyConfig.dailyBudgetTokens}
  current_usage_tokens: ${policyConfig.currentUsageTokens}
  allowed_roles:
${policyConfig.allowedRoles.map((r) => `    - "${r}"`).join('\n')}
`;
  };

  const yamlContent = generateYaml();

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policies.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Requirement 3 Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sliders className="w-4 h-4" />
          <span>Formal Requirement 3: Policy Engine & Budget Tracking</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Centralized Policy Engine & Rule Configurator
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-4xl leading-relaxed">
          Define both <strong className="text-slate-200">Deterministic</strong> and <strong className="text-slate-200">Semantic Guardrails</strong>, 
          token ceilings, and rate limits in a single centralized policy specification. Changes here immediately configure the live gateway 
          and export to production-grade <code className="text-purple-300">policies.yaml</code> for Python FastAPI ingestion.
        </p>
      </div>

      {/* 2-Column Layout: Visual Controls vs Real-Time YAML Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Rule Builders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Deterministic Non-AI Guardrails */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-200">Stage 1: Deterministic Non-AI Controls</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyConfig.enableDeterministic}
                  onChange={(e) => setPolicyConfig((p) => ({ ...p, enableDeterministic: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Action on Trigger */}
            <div className="text-xs space-y-2">
              <label className="text-slate-400 block font-medium">Interception Action on Match:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['redact', 'block', 'flag'] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => setPolicyConfig((p) => ({ ...p, deterministicAction: act }))}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      policyConfig.deterministicAction === act
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    {act === 'redact' ? '🛡️ Redact (Mask)' : act === 'block' ? '🚫 Block (403)' : '🚩 Flag & Audit'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scanned PII & Secret Entities */}
            <div className="text-xs space-y-2">
              <label className="text-slate-400 block font-medium">Active Presidio / Regex Scanners:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'aws_key', label: 'AWS Access Keys' },
                  { id: 'generic_secret_key', label: 'API Keys / Secrets' },
                  { id: 'openai_gemini_key', label: 'AI Provider Keys' },
                  { id: 'credit_card', label: 'Credit Card Numbers' },
                  { id: 'ssn', label: 'Govt SSN / Tax IDs' },
                  { id: 'email', label: 'Email Addresses' },
                  { id: 'phone_us', label: 'US Phone Numbers' },
                  { id: 'sql_injection', label: 'SQL Injection Patterns' },
                  { id: 'script_tag', label: 'XSS & Script Tags' },
                ].map((ent) => {
                  const isChecked = policyConfig.piiEntities.includes(ent.id);
                  return (
                    <button
                      key={ent.id}
                      onClick={() => toggleEntity(ent.id)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-mono flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-slate-800 border-cyan-500/40 text-slate-100'
                          : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{ent.label}</span>
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Denied Keywords Tag Manager */}
            <div className="text-xs space-y-2">
              <label className="text-slate-400 block font-medium">Prohibited Keyword Denylist:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDeniedKeyword()}
                  placeholder="e.g. bypass_auth, exfiltrate_keys"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={addDeniedKeyword}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {policyConfig.deniedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300"
                  >
                    <span>{kw}</span>
                    <button
                      onClick={() => removeDeniedKeyword(kw)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Semantic AI Guardrails */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-200">Stage 2: Semantic AI Guardrails</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyConfig.enableSemantic}
                  onChange={(e) => setPolicyConfig((p) => ({ ...p, enableSemantic: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Threshold Slider */}
            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-medium">Prompt Injection Sensitivity Cutoff:</label>
                <span className="font-mono text-emerald-400 font-bold">
                  {(policyConfig.semanticThreshold * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={policyConfig.semanticThreshold}
                onChange={(e) => setPolicyConfig((p) => ({ ...p, semanticThreshold: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Lower values catch subtle jailbreaks with higher false positives; higher values only block confident attacks.
              </p>
            </div>

            {/* Blocked Topics */}
            <div className="text-xs space-y-2">
              <label className="text-slate-400 block font-medium">Restricted Intent Topics:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBlockedTopic()}
                  placeholder="e.g. financial speculation, unauthorized intrusion"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={addBlockedTopic}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {policyConfig.blockedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-300"
                  >
                    <span>{topic}</span>
                    <button
                      onClick={() => removeBlockedTopic(topic)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Budget & Token Ceilings (Formal Req 1 & 3) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Coins className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-slate-200">Stage 3: Token Budgeting & Policy Ceilings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Max Tokens Per Request</label>
                <input
                  type="number"
                  min="50"
                  max="4000"
                  value={policyConfig.maxTokensPerRequest}
                  onChange={(e) => setPolicyConfig((p) => ({ ...p, maxTokensPerRequest: parseInt(e.target.value, 10) || 600 }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Daily User Token Cap</label>
                <input
                  type="number"
                  min="1000"
                  max="100000"
                  value={policyConfig.dailyBudgetTokens}
                  onChange={(e) => setPolicyConfig((p) => ({ ...p, dailyBudgetTokens: parseInt(e.target.value, 10) || 10000 }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Synced YAML Specification (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  config/policies.yaml
                </h3>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleCopyYaml}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadYaml}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[11px] text-white font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-950 border border-slate-800/90 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-[540px]">
              {yamlContent}
            </pre>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-[11px] text-purple-300 flex items-start space-x-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
              <span>
                Person A loads this file in Python via <code className="text-white">pyyaml</code> inside <code className="text-white">PolicyEngine</code>. 
                Any runtime edits here take effect across the Live Interceptor instantly.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
