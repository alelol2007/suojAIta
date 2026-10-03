import React, { useState } from 'react';
import { 
  Play, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Layers, 
  Clock, 
  Coins, 
  FileText, 
  Check, 
  Lock, 
  Sparkles,
  ArrowRight,
  Database,
  Hash,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { ATTACK_PRESETS } from '../data/attackPresets.ts';
import { EvaluationResult, PolicyConfig } from '../types.ts';

interface PlaygroundTabProps {
  policyConfig: PolicyConfig;
  setPolicyConfig: React.Dispatch<React.SetStateAction<PolicyConfig>>;
}

export const PlaygroundTab: React.FC<PlaygroundTabProps> = ({ policyConfig, setPolicyConfig }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ATTACK_PRESETS[0].id);
  const [promptInput, setPromptInput] = useState<string>(ATTACK_PRESETS[0].prompt);
  const [userRole, setUserRole] = useState<'developer' | 'analyst' | 'admin' | 'guest'>('developer');
  const [userId, setUserId] = useState<string>('usr_alex_eng');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (presetId: string) => {
    const preset = ATTACK_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setPromptInput(preset.prompt);
    }
  };

  const handleExecute = async () => {
    if (!promptInput.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/guardrails/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          role: userRole,
          userContext: { id: userId, tier: 'pro', department: 'R&D' },
          policyConfig,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gateway returned HTTP ${response.status}`);
      }

      const data: EvaluationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Execution error:', err);
      setErrorMsg(err?.message || 'Failed to connect to gateway');
    } finally {
      setIsLoading(false);
    }
  };

  const [showWireInspector, setShowWireInspector] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const curlCommand = `curl -X POST "${window.location.origin}/api/guardrails/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
    prompt: promptInput,
    role: userRole,
    policyConfig: {
      enableDeterministic: policyConfig.enableDeterministic,
      deterministicAction: policyConfig.deterministicAction,
      maxTokensPerRequest: policyConfig.maxTokensPerRequest,
    },
  }).replace(/'/g, "'\\''")}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const estimatedTokens = Math.max(1, Math.ceil(promptInput.length / 4));

  return (
    <div className="space-y-6">
      {/* Intro Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formal Requirement 2 & 3 Interactive Gateway</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Live Guardrail Interceptor & Request Sandbox
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Simulates how the FastAPI asynchronous middleware intercepts inbound prompts, executes sub-5ms 
              <span className="text-amber-400 font-medium"> Deterministic Non-AI pattern matching</span> (Presidio & Regex), runs 
              <span className="text-emerald-400 font-medium"> Semantic AI checks</span> (injection & jailbreaks), and enforces 
              <span className="text-purple-400 font-medium"> Token Budget Policies</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVerifyModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-xs font-semibold transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Zero-Trust Verification Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preset Selector & Prompt Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset Attack Library */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Adversarial & Benchmark Presets</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">{ATTACK_PRESETS.length} Test Vectors</span>
            </div>

            <div className="space-y-2">
              {ATTACK_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-start justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/40 text-slate-100 shadow-sm shadow-cyan-500/5'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="pr-2 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-200">{preset.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] border ${preset.badgeColor}`}>
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono mt-0.5">
                      {preset.primaryTarget}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Editor & Context Bar */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inbound Request Payload</span>
                </label>
                <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                  <span>~{estimatedTokens} tokens</span>
                  <span>•</span>
                  <span>{promptInput.length} chars</span>
                </div>
              </div>

              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={5}
                placeholder="Type or paste payload here..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-y"
              />
            </div>

            {/* Simulated Request Headers / User Context */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Simulated User Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="developer">Developer (Tier 1)</option>
                  <option value="analyst">Data Analyst (Tier 2)</option>
                  <option value="admin">Platform Admin (Tier 3)</option>
                  <option value="guest">Guest / Untrusted (Tier 0)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Header: X-User-ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Run Pipeline Button */}
            <button
              onClick={handleExecute}
              disabled={isLoading || !promptInput.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Intercepting & Evaluating Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Guardrail Pipeline (Intercept)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Stage Interceptor Visualization & Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {errorMsg && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results Summary Card */}
          {result ? (
            <div className="space-y-5">
              {/* Verdict Header Banner */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
                  result.status === 'passed'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : result.status === 'redacted'
                    ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                    : 'bg-red-950/50 border-red-800/70 text-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      result.status === 'passed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : result.status === 'redacted'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {result.status === 'passed' ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : result.status === 'redacted' ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base uppercase tracking-wider">
                        {result.status === 'passed'
                          ? '200 OK — Clean & Forwarded'
                          : result.status === 'redacted'
                          ? '200 OK — Sanitized & Redacted'
                          : '403 Forbidden — Blocked by Gateway'}
                      </span>
                    </div>
                    <p className="text-xs opacity-90">
                      {result.blockReason ||
                        (result.status === 'redacted'
                          ? 'PII/Secrets were detected and scrubbed before dispatch to LLM.'
                          : 'All deterministic pattern and semantic AI safety guardrails passed.')}
                    </p>
                  </div>
                </div>

                {/* Telemetry pill */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs font-mono shrink-0">
                  <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/50">
                    ⏱️ {result.metrics.totalDurationMs}ms total
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/50">
                    🪙 {result.metrics.estimatedInputTokens} tokens
                  </span>
                </div>
              </div>

              {/* 5-Stage Interceptor Pipeline Trace */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Control Layer Execution Pipeline</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Sequential Gateway Stages</span>
                </div>

                <div className="space-y-3">
                  {result.trace.map((stage, idx) => {
                    const isPassed = stage.status === 'passed';
                    const isRedacted = stage.status === 'redacted';
                    const isBlocked = stage.status === 'blocked';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isBlocked
                            ? 'bg-red-950/20 border-red-800/50'
                            : isRedacted
                            ? 'bg-amber-950/20 border-amber-800/50'
                            : 'bg-slate-950/40 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-200">{stage.stage}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                isPassed
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : isRedacted
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}
                            >
                              {stage.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{stage.latencyMs} ms</span>
                          </div>
                        </div>

                        <p className="mt-1.5 text-slate-400 text-[11px] pl-7">{stage.details}</p>

                        {/* Stage Findings Tags */}
                        {stage.findings && stage.findings.length > 0 && (
                          <div className="mt-2 pl-7 flex flex-wrap gap-1.5">
                            {stage.findings.map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[10px] text-slate-300 font-mono"
                              >
                                {f.type || f.category}: {f.matchedValue || f.indicator || 'Match'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diff View: Original vs Sanitized Prompt (if redacted) */}
              {result.status === 'redacted' && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Presidio Contextual Redaction Diff</span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">Stage 1 Output</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-red-900/30 text-red-300/90 overflow-x-auto">
                      <span className="block text-[10px] text-red-400/80 uppercase font-sans mb-1 font-bold">Inbound Raw Prompt</span>
                      <p className="whitespace-pre-wrap">{result.originalPrompt}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/30 text-emerald-300 overflow-x-auto">
                      <span className="block text-[10px] text-emerald-400 uppercase font-sans mb-1 font-bold">Sanitized (Sent to LLM)</span>
                      <p className="whitespace-pre-wrap">{result.processedPrompt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Egress Response Viewer */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Client API Response Body</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">JSON Payload / Stream</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-200 whitespace-pre-wrap overflow-x-auto">
                  {result.response}
                </div>
              </div>

              {/* Raw Wire & cURL Inspector */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                <button
                  onClick={() => setShowWireInspector(!showWireInspector)}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Raw HTTP Wire Inspector & Terminal cURL Command</span>
                  </span>
                  <span className="font-mono text-[11px] text-cyan-400">
                    {showWireInspector ? '▲ Collapse' : '▼ Inspect Raw Wire'}
                  </span>
                </button>

                {showWireInspector && (
                  <div className="space-y-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400 font-sans font-medium">
                        <span>Copyable cURL Command (Run in your local terminal):</span>
                        <button
                          onClick={handleCopyCurl}
                          className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
                        >
                          {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3" />}
                          <span>{copiedCurl ? 'Copied to Clipboard!' : 'Copy cURL'}</span>
                        </button>
                      </div>
                      <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                        {curlCommand}
                      </pre>
                    </div>

                    <div>
                      <span className="block mb-1 text-[11px] text-slate-400 font-sans font-medium">
                        Live Gateway Raw JSON Wire Response:
                      </span>
                      <pre className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-60">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-slate-200 font-semibold text-base">Gateway Sandbox Ready</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm">
                Select an adversarial preset on the left or type your own prompt, then click{' '}
                <strong className="text-cyan-400">Execute Guardrail Pipeline</strong> to inspect the multi-stage filter trace in real time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Zero-Trust Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Zero-Trust Verification: How to Prove It Really Works</h3>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed text-slate-400">
                You should never blindly trust an AI claim that code works. Here are 4 independent, concrete tests you can perform right now to scientifically prove every stage is running genuine logic:
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <span>1. Test Arbitrary Secret Redaction (Presidio Regex Proof)</span>
                  </h4>
                  <p className="text-slate-400">
                    Type a made-up AWS key that did NOT exist in any presets (e.g. <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">AKIA9999888877776666</code>) or a fake credit card (<code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">4111 2222 3333 4444</code>) anywhere inside your own sentence. Click Execute.
                  </p>
                  <p className="text-emerald-400 text-[11px]">
                    ✓ Proof: It will isolate the exact substring, show the exact index position, and redact it in &lt;1ms.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-purple-400 flex items-center space-x-1.5">
                    <span>2. Add Your Own Arbitrary Denied Word (Policy Engine Proof)</span>
                  </h4>
                  <p className="text-slate-400">
                    Switch to the <strong>Policy Engine (Req 3)</strong> tab. Add a totally unique keyword like <code className="text-purple-300 bg-slate-900 px-1 py-0.5 rounded">purplepineapple</code> to the denylist. Return to the Playground and enter <code className="text-purple-300 bg-slate-900 px-1 py-0.5 rounded">Tell me about purplepineapple</code>.
                  </p>
                  <p className="text-emerald-400 text-[11px]">
                    ✓ Proof: The live backend intercepts and returns HTTP 403 Forbidden with "Prohibited keyword detected: 'purplepineapple'".
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-cyan-400 flex items-center space-x-1.5">
                    <span>3. Inspect Chrome DevTools Network Tab (Real Wire Proof)</span>
                  </h4>
                  <p className="text-slate-400">
                    Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">F12</kbd> (or right click -&gt; Inspect), click the <strong>Network</strong> tab, filter by <code className="text-cyan-300">evaluate</code>, and click Execute in the app.
                  </p>
                  <p className="text-emerald-400 text-[11px]">
                    ✓ Proof: You will see the live XHR POST request transmitted to the Node.js Express server with HTTP 200/403 status and JSON payload.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <span>4. Run the Python Standalone Script on Your Laptop</span>
                  </h4>
                  <p className="text-slate-400">
                    Switch to the <strong>Python Starter Code</strong> tab, select <code className="text-emerald-300">test_guardrails_standalone.py</code>, copy or download the project ZIP, and execute:
                  </p>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-300">
                    python3 tests/test_guardrails_standalone.py
                  </pre>
                  <p className="text-emerald-400 text-[11px]">
                    ✓ Proof: Runs 5 assertion tests with real Python timers and verifies sub-millisecond execution locally.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
              >
                Got It, Let Me Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
