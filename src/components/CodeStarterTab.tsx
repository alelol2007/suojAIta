import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Layers, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PYTHON_STARTER_FILES, StarterFile } from '../data/pythonStarterCode.ts';
import { createZipArchive } from '../utils/zipGenerator.ts';

export const CodeStarterTab: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  const currentFile: StarterFile = PYTHON_STARTER_FILES[selectedFileIndex] || PYTHON_STARTER_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = () => {
    setDownloadingZip(true);
    try {
      const zipEntries = PYTHON_STARTER_FILES.map((f) => ({
        name: f.path,
        content: f.content,
      }));

      // Add a helpful README.md for their 3-person team
      zipEntries.push({
        name: 'README.md',
        content: `# suojAIta - AI Control Layer Gateway
## FastAPI Starter Package for 3-Person Team

### Team Allocation:
- **Person A**: \`app/main.py\`, \`app/middleware/pipeline.py\`, \`app/policies/engine.py\`
- **Person B**: \`app/guardrails/deterministic.py\` (Presidio & Regex SecretScanner)
- **Person C**: \`app/guardrails/semantic.py\` (AI Guardrail & Injection Evaluator)
- **Shared**: \`config/policies.yaml\`, \`requirements.txt\`

### Quick Start:
\`\`\`bash
# 1. Create Virtual Environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Download Spacy English Model (for Presidio NER)
python -m spacy download en_core_web_sm

# 4. Start Gateway
uvicorn app.main:app --reload --port 8000
\`\`\`

Test with curl:
\`\`\`bash
curl -X POST http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "My AWS key is AKIAIOSFODNN7EXAMPLE"}]}'
\`\`\`
`,
      });

      const zipBlob = createZipArchive(zipEntries);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'suojaita_fastapi_control_layer.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setTimeout(() => setDownloadingZip(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileCode2 className="w-4 h-4" />
              <span>Production-Ready Codebase</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Python FastAPI 3-Person Team Starter Suite
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Complete, runnable Python codebase partitioned cleanly across Person A, B, and C. Includes the FastAPI proxy, 
              async pipeline middleware, Presidio / regex deterministic engine, semantic AI safety evaluator, and centralized YAML loader.
            </p>
          </div>

          {/* Download Zip Action */}
          <button
            onClick={handleDownloadAllZip}
            disabled={downloadingZip}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingZip ? 'Packing ZIP...' : 'Download Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: File Explorer (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                <span>Project Repository</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">6 Files</span>
            </div>

            <div className="space-y-1.5">
              {PYTHON_STARTER_FILES.map((file, idx) => {
                const isSelected = selectedFileIndex === idx;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500/50 text-slate-100 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${
                        file.assignedTo === 'Person A'
                          ? 'text-blue-400'
                          : file.assignedTo === 'Person B'
                          ? 'text-amber-400'
                          : file.assignedTo === 'Person C'
                          ? 'text-emerald-400'
                          : 'text-purple-400'
                      }`} />
                      <span className="font-mono truncate">{file.path}</span>
                    </div>

                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 font-medium ${
                      file.assignedTo === 'Person A'
                        ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        : file.assignedTo === 'Person B'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : file.assignedTo === 'Person C'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                    }`}>
                      {file.assignedTo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Terminal Setup Instructions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Team Run Commands</span>
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto border border-slate-800">
              <div className="text-slate-500"># 1. Install packages</div>
              <div className="text-amber-400">pip install -r requirements.txt</div>
              <div className="text-slate-500"># 2. Download NER model</div>
              <div className="text-cyan-400">python -m spacy download en_core_web_sm</div>
              <div className="text-slate-500"># 3. Launch gateway</div>
              <div className="text-emerald-400">uvicorn app.main:app --reload --port 8000</div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Viewer Top Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-slate-200">{currentFile.path}</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 hidden sm:inline">{currentFile.description}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadSingle}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Content with Line Numbers */}
            <div className="p-4 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-[620px] leading-relaxed">
              <pre className="whitespace-pre">
                {currentFile.content.trim()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
