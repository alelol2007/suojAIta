import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PlaygroundTab } from './components/PlaygroundTab.tsx';
import { ArchitectureTab } from './components/ArchitectureTab.tsx';
import { PolicyConfigTab } from './components/PolicyConfigTab.tsx';
import { CodeStarterTab } from './components/CodeStarterTab.tsx';
import { BenchmarkTab } from './components/BenchmarkTab.tsx';
import { PolicyConfig } from './types.ts';
import { Shield, Sparkles, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'team' | 'policies' | 'code' | 'benchmark'>('playground');
  const [serverHealth, setServerHealth] = useState<boolean>(true);

  const [policyConfig, setPolicyConfig] = useState<PolicyConfig>({
    enableDeterministic: true,
    deterministicAction: 'redact',
    piiEntities: [
      'aws_key',
      'generic_secret_key',
      'openai_gemini_key',
      'credit_card',
      'ssn',
      'email',
      'phone_us',
      'sql_injection',
      'script_tag',
    ],
    deniedKeywords: ['bypass_auth', 'sudo_rm_rf', 'leak_internal_secrets', 'exfiltrate_db'],
    enableSemantic: true,
    semanticThreshold: 0.75,
    blockedTopics: ['malware generation', 'weapons of mass destruction', 'unauthorized system intrusion'],
    maxTokensPerRequest: 600,
    dailyBudgetTokens: 10000,
    currentUsageTokens: 3450,
    allowedRoles: ['admin', 'developer', 'analyst'],
  });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerHealth(data.status === 'ok');
      })
      .catch(() => {
        setServerHealth(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Platform Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverHealth={serverHealth}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'playground' && (
          <PlaygroundTab policyConfig={policyConfig} setPolicyConfig={setPolicyConfig} />
        )}

        {activeTab === 'team' && (
          <ArchitectureTab />
        )}

        {activeTab === 'policies' && (
          <PolicyConfigTab policyConfig={policyConfig} setPolicyConfig={setPolicyConfig} />
        )}

        {activeTab === 'code' && (
          <CodeStarterTab />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkTab />
        )}
      </main>

      {/* Engineering Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-medium">suojAIta Control Layer Gateway</span>
            <span>•</span>
            <span>FastAPI Architecture Parity Suite</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 font-mono">Stage 1: &lt;2ms Presidio/Regex</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-400 font-mono">Stage 2: Semantic AI Guard</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-slate-400 font-mono">Stage 3: Token Budget Engine</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
