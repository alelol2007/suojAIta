export interface TeamMemberRole {
  roleId: 'person_a' | 'person_b' | 'person_c';
  title: string;
  name: string;
  subtitle: string;
  color: string;
  badge: string;
  coreMission: string;
  keyResponsibilities: string[];
  techStack: string[];
  ownedFiles: string[];
  interfacesExposed: string[];
  potentialBottlenecks: string;
  dayByDayTasks: { day: string; task: string }[];
}

export const TEAM_MEMBERS: TeamMemberRole[] = [
  {
    roleId: 'person_a',
    title: 'Person A — Gateway & Policy Lead',
    name: 'Platform & Infrastructure Engineer',
    subtitle: 'FastAPI Proxy, Async Middleware Pipeline & Policy Engine',
    color: 'blue',
    badge: 'FastAPI / Starlette / Policies',
    coreMission:
      'Build the high-throughput asynchronous API gateway that intercepts inbound `/v1/chat/completions` traffic, sequences the guardrail pipeline, enforces token budgets, and returns unified telemetry.',
    keyResponsibilities: [
      'Implement the FastAPI application and reverse proxy endpoint matching OpenAI / Gemini API schema.',
      'Construct the async `GuardrailPipeline` middleware orchestrating Stages 1 (Deterministic) and 2 (Semantic).',
      'Build the Policy Engine (Formal Req 3): Parse `policies.yaml`, track token usage counters, and enforce rate limits.',
      'Expose Prometheus / structured JSON telemetry (`latency_ms`, `verdict`, `rules_triggered`, `cost_usd`).',
      'Provide mock downstream LLM routing and error handling with standard HTTP status codes (200, 403, 429).',
    ],
    techStack: ['Python 3.11+', 'FastAPI', 'Uvicorn', 'Pydantic v2', 'PyYAML', 'HTTPX (Async Client)'],
    ownedFiles: [
      'app/main.py',
      'app/middleware/pipeline.py',
      'app/policies/engine.py',
      'config/policies.yaml',
      'app/schemas/chat.py',
    ],
    interfacesExposed: [
      'POST /v1/chat/completions',
      'async def execute_pipeline(request: GuardrailRequest) -> GuardrailResponse',
      'class PolicyEngine.check_limits(user_id: str, tokens: int) -> PolicyVerdict',
    ],
    potentialBottlenecks:
      'Blocking async event loops with synchronous CPU-intensive tasks (Presidio/Regex). Must dispatch Person B’s code to a `ThreadPoolExecutor` or `run_in_threadpool`.',
    dayByDayTasks: [
      { day: 'Day 1', task: 'Define shared Pydantic data schemas (`schemas/chat.py`) and basic FastAPI server.' },
      { day: 'Day 2', task: 'Implement async request interceptor middleware and mock downstream forwarder.' },
      { day: 'Day 3', task: 'Integrate Person B (Deterministic) and Person C (Semantic) modules into the pipeline.' },
      { day: 'Day 4', task: 'Build centralized YAML policy parser, token counting, and budget limit checks.' },
      { day: 'Day 5', task: 'End-to-end load testing, error handling, Dockerfile creation, and demo polish.' },
    ],
  },
  {
    roleId: 'person_b',
    title: 'Person B — Deterministic Security Lead',
    name: 'Security & PII Engineering Specialist',
    subtitle: 'Regex Engines, Microsoft Presidio & Secret Scanning',
    coreMission:
      'Engineer sub-5ms deterministic pattern-matching filters to detect, redact, or block sensitive credentials (AWS keys, OpenAI tokens), PII (SSN, credit cards, emails), and malicious injection patterns.',
    color: 'amber',
    badge: 'Presidio / Regex / Redaction',
    keyResponsibilities: [
      'Integrate Microsoft Presidio Analyzer & Anonymizer for high-precision Named Entity Recognition (NER).',
      'Develop custom high-speed regex engines for API keys (AWS, GitHub, OpenAI, Gemini) and financial numbers.',
      'Implement customizable action handlers: REDACT (replace with placeholder token), BLOCK (abort 403), or FLAG.',
      'Maintain denylist keywords / SQL injection regex filters.',
      'Ensure execution stays under 2-5ms per request so gateway latency overhead remains negligible.',
    ],
    techStack: [
      'Microsoft Presidio Analyzer',
      'Microsoft Presidio Anonymizer',
      'Python `re` / `regex` module',
      'spaCy (en_core_web_sm)',
      'Pytest',
    ],
    ownedFiles: [
      'app/guardrails/deterministic.py',
      'app/guardrails/patterns.py',
      'app/guardrails/anonymizer.py',
      'tests/test_deterministic.py',
    ],
    interfacesExposed: [
      'class DeterministicGuardrail.scan_and_sanitize(text: str, config: PolicyConfig) -> SanitizedResult',
      'def detect_secrets(text: str) -> List[SecretMatch]',
      'def anonymize_pii(text: str, entities: List[str]) -> str',
    ],
    potentialBottlenecks:
      'Presidio heavy model loading time. Must initialize `AnalyzerEngine` as a singleton on startup, not per-request.',
    dayByDayTasks: [
      { day: 'Day 1', task: 'Set up Presidio, SpaCy, and regex library testbed with unit test cases.' },
      { day: 'Day 2', task: 'Implement secret scanners for AWS, OpenAI, GitHub tokens, and financial PII.' },
      { day: 'Day 3', task: 'Build the contextual string replacer/anonymizer (`[REDACTED_...]`).' },
      { day: 'Day 4', task: 'Benchmark throughput (<5ms) and optimize regex compilations with caching.' },
      { day: 'Day 5', task: 'Write comprehensive test suite with 50+ adversarial secret/PII injection payloads.' },
    ],
  },
  {
    roleId: 'person_c',
    title: 'Person C — Semantic AI Guardrails Lead',
    name: 'AI Safety & ML Security Specialist',
    subtitle: 'Prompt Injection, NeMo Guardrails, Jailbreaks & Safety Models',
    coreMission:
      'Implement semantic, AI-driven guardrails capable of detecting complex prompt injections, roleplay jailbreaks (DAN, grandma exploit), system prompt exfiltration, and out-of-scope intent.',
    color: 'emerald',
    badge: 'NeMo Guardrails / Safety LLM',
    keyResponsibilities: [
      'Design semantic evaluation logic using NeMo Guardrails or lightweight safety models (Llama-Guard / Gemini API).',
      'Implement prompt injection & jailbreak detection classifiers with adjustable confidence thresholds (0.0 to 1.0).',
      'Create topic boundaries (e.g., block financial advice, malware generation, unauthorized system intrusion).',
      'Develop egress output guardrails: detect hallucination, refusal verification, or accidental prompt leakage.',
      'Optimize AI guardrail inference latency with caching, early exit heuristics, and async call orchestration.',
    ],
    techStack: [
      'NeMo Guardrails (NVIDIA)',
      'Ollama / Llama-Guard / Gemini Flash API',
      'Sentence-Transformers / Embeddings',
      'Pydantic',
    ],
    ownedFiles: [
      'app/guardrails/semantic.py',
      'app/guardrails/jailbreak_detector.py',
      'app/guardrails/output_filter.py',
      'tests/test_semantic.py',
    ],
    interfacesExposed: [
      'async def SemanticGuardrail.evaluate_intent(prompt: str, threshold: float) -> SemanticVerdict',
      'async def evaluate_output_leak(response: str, system_prompt: str) -> bool',
      'class JailbreakClassifier.predict(text: str) -> float',
    ],
    potentialBottlenecks:
      'AI model inference latency (100ms - 500ms). Must implement early heuristic exits and async non-blocking execution.',
    dayByDayTasks: [
      { day: 'Day 1', task: 'Select safety model runtime (Local Ollama Llama-Guard or Gemini Flash endpoint).' },
      { day: 'Day 2', task: 'Implement prompt injection and jailbreak detection heuristics + structured evaluation.' },
      { day: 'Day 3', task: 'Connect to Person A’s pipeline via `evaluate_intent()` async contract.' },
      { day: 'Day 4', task: 'Build egress output verification and system prompt leakage scrubber.' },
      { day: 'Day 5', task: 'Evaluate on red-team datasets, tune false-positive rates, and document prompts.' },
    ],
  },
];
