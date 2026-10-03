export interface GuardrailTraceStage {
  stage: string;
  status: 'passed' | 'redacted' | 'blocked' | 'flagged';
  latencyMs: number;
  details: string;
  findings?: any[];
}

export interface GuardrailViolation {
  type: string;
  entity?: string;
  severity: 'high' | 'medium' | 'low';
  matchedValue?: string;
  category?: string;
  confidence?: number;
  indicator?: string;
}

export interface EvaluationResult {
  id: string;
  timestamp: string;
  status: 'passed' | 'redacted' | 'blocked' | 'flagged';
  blockReason: string | null;
  originalPrompt: string;
  processedPrompt: string;
  response: string;
  metrics: {
    totalDurationMs: number;
    deterministicLatencyMs: number;
    estimatedInputTokens: number;
    estimatedCostUsd: string;
  };
  trace: GuardrailTraceStage[];
  violations: GuardrailViolation[];
}

export interface PolicyConfig {
  enableDeterministic: boolean;
  deterministicAction: 'redact' | 'block' | 'flag';
  piiEntities: string[];
  deniedKeywords: string[];
  enableSemantic: boolean;
  semanticThreshold: number;
  blockedTopics: string[];
  maxTokensPerRequest: number;
  dailyBudgetTokens: number;
  currentUsageTokens: number;
  allowedRoles: string[];
}

export interface AttackPreset {
  id: string;
  title: string;
  category: 'Jailbreak' | 'PII & Secrets' | 'Injection' | 'Policy / Budget' | 'Benign';
  badgeColor: string;
  prompt: string;
  description: string;
  expectedAction: 'blocked' | 'redacted' | 'passed';
  primaryTarget: 'Deterministic' | 'Semantic' | 'Policy Engine';
}

export interface BenchmarkItem {
  id: string;
  category: string;
  prompt: string;
  expectedVerdict: 'passed' | 'redacted' | 'blocked';
  actualVerdict?: 'passed' | 'redacted' | 'blocked';
  passedBenchmark?: boolean;
  type: string;
  latencyMs?: number;
}
