import { HackathonBlueprint } from './IdeaStrategistAgent';
import fs from 'fs';
import path from 'path';

export interface GeneratedFile {
  path: string;
  content: string;
}

export class CodeScaffoldAgent {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
  }

  async scaffoldProject(blueprint: HackathonBlueprint, outputDir: string): Promise<string> {
    const projectDir = path.join(outputDir, this.slugify(blueprint.projectName));
    
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    console.log('   📦 Generating world-class project structure...');
    const files = await this.generateProjectFiles(blueprint);

    console.log(`   📝 Writing ${files.length} files to ${projectDir}...`);
    for (const file of files) {
      const fullPath = path.join(projectDir, file.path);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, file.content);
    }

    const readmePath = path.join(projectDir, 'README.md');
    fs.writeFileSync(readmePath, this.generateReadme(blueprint));

    const envPath = path.join(projectDir, '.env.example');
    fs.writeFileSync(envPath, this.generateEnvExample(blueprint));

    const gitignorePath = path.join(projectDir, '.gitignore');
    fs.writeFileSync(gitignorePath, this.generateGitignore());

    return projectDir;
  }

  public async generateProjectFiles(blueprint: HackathonBlueprint): Promise<GeneratedFile[]> {
    const projectName = blueprint.projectName || "Agentic Studio";
    const tagline = blueprint.tagline || "Autonomous Multi-Agent Enterprise Command Center";
    const agents = blueprint.agentArchitecture && blueprint.agentArchitecture.length > 0 
      ? blueprint.agentArchitecture 
      : [
          { name: "DirectorAgent", role: "Orchestrates scene breakdown & executive synthesis", inputs: "Script / Vision Prompt", outputs: "Production Specs" },
          { name: "VFXSynthesizer", role: "Generates neural cinematic assets & VFX pipelines", inputs: "Scene Directives", outputs: "Rendered Frames" },
          { name: "BudgetOptimizer", role: "Monitors GPU compute burn & token economics", inputs: "Execution Graph", outputs: "Financial Telemetry" },
          { name: "AudioComposer", role: "Synthesizes multi-track adaptive spatial audio", inputs: "Scene Mood & Pace", outputs: "Lossless Audio Master" }
        ];

    // 1. /App.tsx - Master SaaS Command Center Shell
    const appContent = `import React, { useState, useEffect } from "react";
import {
  Layers,
  Cpu,
  Terminal,
  BarChart3,
  Bell,
  RefreshCw,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Sliders,
  Globe,
  Code,
  ArrowRight
} from "lucide-react";
import StudioWorkspace from "./components/StudioWorkspace";
import AgentOrchestrator from "./components/AgentOrchestrator";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState<"studio" | "agents" | "terminal" | "analytics">("studio");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  const [logs, setLogs] = useState<Array<{ timestamp: string; level: string; agent: string; message: string }>>([
    { timestamp: "00:00:01", level: "INFO", agent: "CoreRuntime", message: "Gemini Enterprise 1.5 Pro cluster initialized successfully (us-central1)." },
    { timestamp: "00:00:02", level: "SYSTEM", agent: "${agents[0]?.name || 'DirectorAgent'}", message: "Standing by for autonomous pipeline execution directives." }
  ]);

  const triggerPipeline = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecutionProgress(0);
    setActiveAgentIndex(0);
    setNotification("Autonomous Pipeline Execution Started");

    const steps = [
      { progress: 25, agent: "${agents[0]?.name || 'DirectorAgent'}", msg: "Parsing project parameters and constructing multi-agent graph." },
      { progress: 50, agent: "${agents[1]?.name || 'VFXSynthesizer'}", msg: "Synthesizing multimodal assets with Gemini Enterprise & Imagen 3." },
      { progress: 75, agent: "${agents[2]?.name || 'BudgetOptimizer'}", msg: "Optimizing token economics: 4,820 tokens utilized across 3 sub-agents." },
      { progress: 100, agent: "${agents[3]?.name || 'AudioComposer'}", msg: "Pipeline execution verified. All production assets finalized & cached." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setExecutionProgress(step.progress);
        setActiveAgentIndex(idx);
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [
          ...prev,
          { timestamp: time, level: "AGENT_EXEC", agent: step.agent, message: step.msg }
        ]);

        if (idx === steps.length - 1) {
          setIsExecuting(false);
          setNotification("Pipeline Execution Completed Successfully!");
        }
      }, (idx + 1) * 1200);
    });
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f1f3f7] flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0d1017]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-bold text-base tracking-tight text-white">${projectName}</h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium hidden sm:block">${tagline}</p>
          </div>
        </div>

        {/* Status Pills & Primary Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Gemini Enterprise 1.5
            </span>
            <span className="text-white/20">|</span>
            <span className="text-gray-400 font-mono">24ms</span>
            <span className="text-white/20">|</span>
            <span className="text-gray-400">us-central1</span>
          </div>

          <button
            onClick={triggerPipeline}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running... {executionProgress}%</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Trigger Agent Orchestra</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-indigo-950/80 border-b border-indigo-500/30 px-6 py-2 text-xs flex items-center justify-between text-indigo-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-indigo-400 hover:text-white font-mono text-[10px]">DISMISS</button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#0b0e14]/80 backdrop-blur-md flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">Command Center</p>
              
              <button
                onClick={() => setActiveTab("studio")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "studio"
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <Layers className="h-4 w-4" />
                <span>Studio Workspace</span>
              </button>

              <button
                onClick={() => setActiveTab("agents")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "agents"
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <Cpu className="h-4 w-4" />
                <span>Agent Orchestra</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 font-mono text-gray-400">
                  ${agents.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("terminal")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "terminal"
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <Terminal className="h-4 w-4" />
                <span>Live Terminal</span>
                {isExecuting && <span className="ml-auto h-2 w-2 rounded-full bg-indigo-400 animate-ping" />}
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "analytics"
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics & Cost</span>
              </button>
            </div>

            {/* Active Autonomous Agents Mini-List */}
            <div className="border-t border-white/[0.06] pt-4">
              <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">Orchestrated Agents</p>
              <div className="space-y-2">
                ${agents.map((a, i) => `
                <div key="${i}" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full \${activeAgentIndex === ${i} && isExecuting ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}" />
                    <span className="text-xs font-medium text-gray-300 truncate">${a.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 shrink-0">v1.5</span>
                </div>
                `).join('')}
              </div>
            </div>
          </div>

          {/* Footer User / Status */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-gray-400" />
              <span>Production v2.4</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400/80 font-semibold">ONLINE</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#090b10]">
          <div className="max-w-6xl mx-auto space-y-8">
            {activeTab === "studio" && (
              <StudioWorkspace 
                onTrigger={triggerPipeline} 
                isExecuting={isExecuting} 
              />
            )}
            
            {activeTab === "agents" && (
              <AgentOrchestrator 
                agents={${JSON.stringify(agents)}} 
                isExecuting={isExecuting} 
                activeAgentIndex={activeAgentIndex} 
                logs={logs}
              />
            )}

            {activeTab === "terminal" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Live Execution Terminal</h2>
                    <p className="text-xs text-gray-400">Real-time reasoning stream, tool execution logs & telemetry</p>
                  </div>
                  <button onClick={() => setLogs([])} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium">Clear Stream</button>
                </div>
                <div className="h-[520px] rounded-2xl bg-[#06080c] border border-white/10 p-4 font-mono text-xs overflow-y-auto space-y-2.5 shadow-2xl">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-3 leading-relaxed">
                      <span className="text-gray-600 select-none">[{log.timestamp}]</span>
                      <span className={\`font-semibold px-1.5 py-0.5 rounded text-[10px] \${
                        log.level === "INFO" ? "bg-blue-500/10 text-blue-400" :
                        log.level === "SYSTEM" ? "bg-purple-500/10 text-purple-400" :
                        "bg-emerald-500/10 text-emerald-400"
                      }\`}>{log.level}</span>
                      <span className="text-indigo-300 font-semibold">{log.agent}:</span>
                      <span className="text-gray-300 flex-1">{log.message}</span>
                    </div>
                  ))}
                  {isExecuting && (
                    <div className="flex items-center gap-2 text-indigo-400 animate-pulse pt-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span>Synthesizing agent trace...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <AnalyticsDashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}`;

    // 2. /components/StudioWorkspace.tsx - Operational Studio Canvas
    const workspaceContent = `import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Layers,
  Search,
  RefreshCw
} from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("Autonomous multi-agent cinematic production sequence with dynamic VFX & camera tracking");
  const [creativity, setCreativity] = useState(75);
  const [resolution, setResolution] = useState("4K UHD");
  const [selectedCard, setSelectedCard] = useState<number | null>(0);

  const scenes = [
    {
      id: 1,
      title: "Scene 01: Neon Cyber Metropolis",
      badge: "85mm Anamorphic • Golden Hour",
      status: "COMPLETED",
      latency: "1.2s",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      description: "Atmospheric aerial tracking shot over a cybernetic city with volumetric rain and dynamic neon reflections."
    },
    {
      id: 2,
      title: "Scene 02: Orbital Observatory",
      badge: "35mm Prime • Deep Space",
      status: "READY_TO_RENDER",
      latency: "0.8s",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      description: "Slow orbital pan revealing deep nebula stars and high-precision sensor array telemetries."
    },
    {
      id: 3,
      title: "Scene 03: Neural Synthesis Core",
      badge: "Macro 100mm • Sub-surface",
      status: "IN_QUEUE",
      latency: "2.4s",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      description: "Abstract generative visualization of autonomous reasoning graphs pulsing with quantum data streams."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Studio Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-[#0d1017] border border-white/10 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Production Canvas</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Direct & Synthesize Multimodal Pipelines
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Configure agent prompts, camera optics, and compute budgets. Trigger autonomous orchestration across Google Cloud & partner services with one click.
          </p>
        </div>

        {/* Prompt Directive Bar */}
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full h-12 bg-[#06080c]/90 border border-white/15 rounded-xl px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
              placeholder="Enter master scene directive..."
            />
          </div>
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            <span>{isExecuting ? "Synthesizing..." : "Synthesize Scene"}</span>
          </button>
        </div>
      </div>

      {/* Parameter Sliders & Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Creative Freedom (Temp)</span>
            <span className="font-mono text-indigo-400">{creativity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={creativity}
            onChange={(e) => setCreativity(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Render Fidelity</span>
            <span className="font-mono text-purple-400">{resolution}</span>
          </div>
          <div className="flex gap-2">
            {["1080p", "4K UHD", "8K IMAX"].map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={\`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all \${
                  resolution === res
                    ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                    : "bg-white/[0.02] text-gray-400 border-white/[0.06] hover:bg-white/[0.05]"
                }\`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Multi-Agent Engine</span>
            <span className="font-mono text-emerald-400">Gemini 1.5 Pro</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            High-throughput multimodal reasoning cluster with automated tool call attribution.
          </p>
        </div>
      </div>

      {/* Scene Production Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Active Production Storyboard</h3>
          <span className="text-xs text-gray-400 font-mono">3 Scenes Generated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenes.map((scene, idx) => (
            <div
              key={scene.id}
              onClick={() => setSelectedCard(idx)}
              className={\`group rounded-2xl overflow-hidden border transition-all cursor-pointer \${
                selectedCard === idx
                  ? "bg-[#131722] border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                  : "bg-[#0d1017]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#11151f]"
              }\`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-black/40" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {scene.status}
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-gray-300 bg-black/70 px-2 py-0.5 rounded">
                  {scene.latency}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <p className="text-[11px] font-mono text-indigo-400 font-semibold">{scene.badge}</p>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {scene.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {scene.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

    // 3. /components/AgentOrchestrator.tsx - Multi-Agent Visual Topology
    const orchestratorContent = `import React from "react";
import { Cpu, CheckCircle2, Zap, Clock, ArrowRight, Layers, Terminal, Sparkles } from "lucide-react";

interface Agent {
  name: string;
  role: string;
  inputs: string;
  outputs: string;
}

interface AgentOrchestratorProps {
  agents: Agent[];
  isExecuting: boolean;
  activeAgentIndex: number;
  logs: Array<{ timestamp: string; level: string; agent: string; message: string }>;
}

export default function AgentOrchestrator({ agents, isExecuting, activeAgentIndex, logs }: AgentOrchestratorProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Autonomous Agent Topology</h2>
        <p className="text-xs text-gray-400">Visual orchestration pipeline, inter-agent communication & active state</p>
      </div>

      {/* Agent Topology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, index) => {
          const isActive = isExecuting && activeAgentIndex === index;
          return (
            <div
              key={index}
              className={\`p-6 rounded-2xl border transition-all space-y-4 \${
                isActive
                  ? "bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "bg-[#0d1017]/90 border-white/[0.08]"
              }\`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={\`h-10 w-10 rounded-xl flex items-center justify-center \${
                    isActive ? "bg-indigo-600 text-white animate-pulse" : "bg-white/[0.05] text-indigo-400"
                  }\`}>
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-gray-400">{agent.role}</p>
                  </div>
                </div>
                <span className={\`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full \${
                  isActive
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }\`}>
                  {isActive ? "PROCESSING" : "STANDBY"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-[11px]">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-gray-500 font-semibold block mb-0.5">INPUTS</span>
                  <span className="text-gray-300 font-mono">{agent.inputs}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                  <span className="text-gray-500 font-semibold block mb-0.5">OUTPUTS</span>
                  <span className="text-gray-300 font-mono">{agent.outputs}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Mini-Terminal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <span>Telemetry & Reasoning Stream</span>
          </h3>
        </div>
        <div className="h-64 rounded-2xl bg-[#06080c] border border-white/10 p-4 font-mono text-xs overflow-y-auto space-y-2 shadow-inner">
          {logs.slice(-6).map((log, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-gray-300">
              <span className="text-gray-600">[{log.timestamp}]</span>
              <span className="text-indigo-400 font-semibold">{log.agent}:</span>
              <span className="text-gray-300 truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

    // 4. /components/AnalyticsDashboard.tsx - Enterprise Metrics & KPI
    const analyticsContent = `import React from "react";
import { BarChart3, Cpu, Zap, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function AnalyticsDashboard() {
  const metrics = [
    { title: "GPU Cluster Utilization", value: "84.2%", change: "+4.1%", color: "text-emerald-400", progress: 84 },
    { title: "Average Inference Latency", value: "24ms", change: "-12ms", color: "text-indigo-400", progress: 62 },
    { title: "Autonomous Token Budget", value: "$0.042 / run", change: "-38%", color: "text-purple-400", progress: 42 },
    { title: "Multimodal Synthesis Rate", value: "99.8%", change: "+0.3%", color: "text-cyan-400", progress: 99 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Telemetry & Resource Economics</h2>
        <p className="text-xs text-gray-400">Real-time compute monitoring, token efficiency metrics & SLA guarantees</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#0d1017]/90 border border-white/[0.08] space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">{m.title}</span>
              <span className={\`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/[0.05] \${m.color}\`}>
                {m.change}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight font-mono">{m.value}</div>
            <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: \`\${m.progress}%\` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Resource Allocation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0d1017]/90 border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white">Compute Infrastructure Allocation</h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-300">
                <span>Google Cloud Vertex AI (Gemini 1.5 Pro)</span>
                <span className="font-mono text-indigo-400">54%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[54%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-300">
                <span>Cloud TPU v5e Multimodal Accelerators</span>
                <span className="font-mono text-purple-400">28%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[28%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-300">
                <span>Partner Integrations & Vector DB</span>
                <span className="font-mono text-cyan-400">18%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[18%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d1017]/90 border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white">Autonomous SLA & Safety Verification</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-emerald-300">
              <span className="font-medium">Content Safety & Hallucination Guard</span>
              <span className="font-mono font-bold">PASSED (100%)</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-indigo-300">
              <span className="font-medium">Partner API Rate Limits Headroom</span>
              <span className="font-mono font-bold">88.4% AVAILABLE</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-purple-300">
              <span className="font-medium">Deterministic Tool-Call Latency SLA</span>
              <span className="font-mono font-bold">&lt; 50ms (99.9th %)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

    // 5. /styles.css - Obsidian Global Styles
    const stylesContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #090b10;
    color: #f1f3f7;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

/* Custom Sleek Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #090b10;
}
::-webkit-scrollbar-thumb {
  background: #1a1f2c;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2b3347;
}`;

    return [
      { path: "/App.tsx", content: appContent },
      { path: "/components/StudioWorkspace.tsx", content: workspaceContent },
      { path: "/components/AgentOrchestrator.tsx", content: orchestratorContent },
      { path: "/components/AnalyticsDashboard.tsx", content: analyticsContent },
      { path: "/styles.css", content: stylesContent }
    ];
  }

  private generateReadme(bp: HackathonBlueprint): string {
    return `# ${bp.projectName}

> ${bp.tagline}

## 🎯 Problem Statement
${bp.problemStatement}

## 💡 Proposed Solution
${bp.proposedSolution}

## 🛠️ Tech Stack
- **Frontend**: ${bp.techStack.frontend.join(', ')}
- **Backend**: ${bp.techStack.backend.join(', ')}
- **APIs**: ${bp.techStack.apis.join(', ')}
- **Deployment**: ${bp.techStack.deployment.join(', ')}

## 🤖 Multi-Agent Architecture
${bp.agentArchitecture.map(a => `- **${a.name}**: ${a.role}`).join('\n')}
`;
  }

  private generateEnvExample(bp: HackathonBlueprint): string {
    const lines = [
      '# API Keys & Secrets',
      'GROQ_API_KEY=your_groq_api_key',
      'NEXT_PUBLIC_APP_URL=http://localhost:3000',
    ];

    if ((bp as any).requiredApiKeys) {
      for (const key of (bp as any).requiredApiKeys) {
        lines.push(`${key.name}=your_${key.name.toLowerCase()}`);
      }
    }

    return lines.join('\n') + '\n';
  }

  private generateGitignore(): string {
    return `node_modules
.next
out
.env
.env.local
.DS_Store
*.log
`;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
