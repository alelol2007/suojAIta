import React from 'react';
import { Shield, Cpu, Users, FileCode2, Sliders, Activity, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'playground' | 'team' | 'policies' | 'code' | 'benchmark';
  setActiveTab: (tab: 'playground' | 'team' | 'policies' | 'code' | 'benchmark') => void;
  serverHealth: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, serverHealth }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">suoj<span className="text-cyan-400 font-extrabold">AI</span>ta</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 rounded-md">
                  Control Layer Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Formal Req 2 & 3: Deterministic & Semantic Guardrails • FastAPI 3-Team Architecture
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Live Interceptor</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'team'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>3-Team Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'policies'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Policy Engine (Req 3)</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Python Starter Code</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'benchmark'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Red-Team Suite</span>
            </button>
          </nav>

          {/* Engine Status */}
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-800 text-xs">
            <span className="flex items-center text-emerald-400 space-x-1 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-mono">Proxy 200 OK</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
