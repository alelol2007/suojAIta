import React, { useState } from 'react';
import { 
  Users, 
  Layers, 
  Workflow, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  Cpu, 
  GitFork, 
  Terminal,
  Zap,
  Lock,
  Sparkles
} from 'lucide-react';
import { TEAM_MEMBERS, TeamMemberRole } from '../data/teamRoadmap.ts';

export const ArchitectureTab: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'person_a' | 'person_b' | 'person_c'>('person_a');

  const currentRole = TEAM_MEMBERS.find((m) => m.roleId === selectedRole) || TEAM_MEMBERS[0];

  return (
    <div className="space-y-8">
      {/* Blueprint Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Workflow className="w-4 h-4" />
          <span>Engineering Roadmap & Team Division</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          3-Person Team Architecture: AI Control Layer with FastAPI
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-4xl leading-relaxed">
          Designed specifically for a <strong className="text-slate-200">3-person engineering team</strong> tackling 
          Formal Requirement 2 (Deterministic + Semantic Guardrails) and Formal Requirement 3 (Centralized Policy & Token Budgeting). 
          Each member has clear file boundaries, concrete Pydantic interface contracts, and zero overlapping merge conflicts.
        </p>
      </div>

      {/* Interactive System Pipeline Flowchart */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Request Interception Lifecycle Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How FastAPI async middleware intercepts requests and offloads tasks to Person B and Person C
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
            Target End-to-End Overhead &lt; 150ms
          </span>
        </div>

        {/* Visual Flow Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1: Client & Ingestion */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 flex flex-col justify-between space-y-3 relative group hover:border-blue-500 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                PERSON A
              </span>
              <h3 className="font-bold text-xs text-slate-200 mt-1">1. FastAPI Gateway</h3>
              <p className="text-[11px] text-slate-400">
                Intercepts <code className="text-blue-300">/v1/chat/completions</code>. Validates Bearer token & Pydantic request body.
              </p>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Async Starlette Router</span>
            </div>
          </div>

          {/* Step 2: Deterministic Non-AI Guardrail */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between space-y-3 relative group hover:border-amber-500 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                PERSON B
              </span>
              <h3 className="font-bold text-xs text-slate-200 mt-1">2. Deterministic Filter</h3>
              <p className="text-[11px] text-slate-400">
                Presidio NER & Regex. Masks SSN, Credit Cards, AWS keys in <strong className="text-amber-300">&lt;5ms</strong> via ThreadPool.
              </p>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Presidio & SecretScanner</span>
            </div>
          </div>

          {/* Step 3: Semantic AI Guardrail */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                PERSON C
              </span>
              <h3 className="font-bold text-xs text-slate-200 mt-1">3. Semantic AI Guard</h3>
              <p className="text-[11px] text-slate-400">
                NeMo / Safety Model. Detects DAN jailbreak, grandma exploits, prompt injection & out-of-scope intent.
              </p>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>NeMo / Gemini Flash</span>
            </div>
          </div>

          {/* Step 4: Policy & Budget */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 flex flex-col justify-between space-y-3 relative group hover:border-purple-500 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                PERSON A
              </span>
              <h3 className="font-bold text-xs text-slate-200 mt-1">4. Policy & Budgets</h3>
              <p className="text-[11px] text-slate-400">
                Checks token counts, daily user allowances, role permissions from <code className="text-purple-300">policies.yaml</code>.
              </p>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
              <Workflow className="w-3 h-3 text-purple-400" />
              <span>Formal Req 3 Engine</span>
            </div>
          </div>

          {/* Step 5: Upstream LLM & Egress */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col justify-between space-y-3 relative group hover:border-cyan-500 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                PERSON B & C
              </span>
              <h3 className="font-bold text-xs text-slate-200 mt-1">5. LLM & Egress Scrub</h3>
              <p className="text-[11px] text-slate-400">
                Proxies sanitized payload to LLM. Egress guardrail ensures no prompt leakage or accidental secret echoes.
              </p>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>Egress Redaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Deep-Dive Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Individual Team Member Ownership & Deliverables</span>
          </h2>
          <div className="flex space-x-2">
            {TEAM_MEMBERS.map((m) => (
              <button
                key={m.roleId}
                onClick={() => setSelectedRole(m.roleId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedRole === m.roleId
                    ? m.roleId === 'person_a'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                      : m.roleId === 'person_b'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.title.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Role Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-100">{currentRole.title}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {currentRole.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentRole.subtitle}</p>
            </div>
            <div className="text-xs text-slate-400 italic max-w-md bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              "{currentRole.coreMission}"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Responsibilities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Key Responsibilities & Deliverables</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentRole.keyResponsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Owned Code Files & Tech Stack */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 mb-2">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Assigned Files in Git Repository</span>
                </h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {currentRole.ownedFiles.map((file, i) => (
                    <div key={i} className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 mb-2">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Libraries & Tools</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentRole.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Bottleneck & Mitigation */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs">
            <div className="flex items-center space-x-2 text-amber-400 font-bold mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Critical Engineering Watchout for {currentRole.title.split('—')[0].trim()}</span>
            </div>
            <p className="text-slate-300 pl-6">{currentRole.potentialBottlenecks}</p>
          </div>

          {/* 5-Day Sprint Plan for this Role */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>5-Day Implementation Roadmap</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {currentRole.dayByDayTasks.map((dayItem, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                    {dayItem.day}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug">{dayItem.task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why This Stack Matches the 3-Person Team */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Why Python + FastAPI + Pydantic is Optimal for Requirements 2 & 3</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-400">1. Zero-Overlap Division</h4>
            <p className="text-slate-400 leading-relaxed">
              Person A builds the async reverse proxy without waiting for guardrail models. Person B writes standalone regex & Presidio logic. Person C independently tests prompt injection scripts on datasets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400">2. Ecosystem Parity</h4>
            <p className="text-slate-400 leading-relaxed">
              Microsoft Presidio (the gold standard for PII) and NeMo Guardrails (NVIDIA) are native Python packages. Re-implementing them in Go or Rust takes weeks instead of hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400">3. Frictionless Scalability</h4>
            <p className="text-slate-400 leading-relaxed">
              FastAPI produces auto-generated Swagger UI for instant testing. When moving to production later, adding Celery workers, Redis rate-limiting, and PostgreSQL audit logging is a 1-day drop-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
