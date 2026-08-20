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
    const projectName = (blueprint.projectName || "Agentic Studio").replace(/"/g, '\\"');
    const tagline = (blueprint.tagline || "Autonomous Multi-Agent Enterprise Command Center").replace(/"/g, '\\"');
    const agents = blueprint.agentArchitecture && blueprint.agentArchitecture.length > 0 
      ? blueprint.agentArchitecture 
      : [
          { name: "ExecutiveAgent", role: "Orchestrates multi-agent task graphs and executive telemetry", inputs: "Domain Directives", outputs: "Production Specs" },
          { name: "SynthesisEngine", role: "Executes deep domain synthesis & neural workflows", inputs: "Task Directives", outputs: "Generated Assets" },
          { name: "OptimizationAgent", role: "Monitors economics, token throughput & efficiency", inputs: "Execution Graph", outputs: "Performance Metrics" },
          { name: "QualityAuditor", role: "Performs continuous compliance & quality assurance", inputs: "Pipeline Outputs", outputs: "Verified Master" }
        ];

    const fullText = `${blueprint.projectName || ''} ${blueprint.tagline || ''} ${blueprint.problemStatement || ''} ${blueprint.proposedSolution || ''}`.toLowerCase();

    // Dynamic domain synthesis based on the project blueprint & agent architecture
    const cleanDomainName = projectName;
    const problem = (blueprint.problemStatement || "").replace(/"/g, '\\"');
    const solution = (blueprint.proposedSolution || "").replace(/"/g, '\\"');

    const domainText = `${blueprint.projectName || ''} ${blueprint.tagline || ''} ${blueprint.problemStatement || ''} ${blueprint.proposedSolution || ''}`.toLowerCase();
    
    let layoutType: "bento" | "cyber" | "dashboard" | "clinical" | "studio" | "ecommerce" | "media" | "culinary" | "realestate" | "edutech" = "bento";

    if (domainText.includes("crypto") || domainText.includes("web3") || domainText.includes("solidity") || domainText.includes("security") || domainText.includes("cyber") || domainText.includes("blockchain")) {
      layoutType = "cyber";
    } else if (domainText.includes("health") || domainText.includes("med") || domainText.includes("clinic") || domainText.includes("doctor") || domainText.includes("patient") || domainText.includes("pharma") || domainText.includes("care")) {
      layoutType = "clinical";
    } else if (domainText.includes("finance") || domainText.includes("bank") || domainText.includes("legal") || domainText.includes("enterprise") || domainText.includes("tax") || domainText.includes("invest")) {
      layoutType = "dashboard";
    } else if (domainText.includes("rust") || domainText.includes("go") || domainText.includes("python") || domainText.includes("developer") || domainText.includes("cli") || domainText.includes("tool") || domainText.includes("fastapi")) {
      layoutType = "studio";
    } else if (domainText.includes("shop") || domainText.includes("cart") || domainText.includes("store") || domainText.includes("ecommerce") || domainText.includes("retail") || domainText.includes("order") || domainText.includes("product")) {
      layoutType = "ecommerce";
    } else if (domainText.includes("video") || domainText.includes("audio") || domainText.includes("music") || domainText.includes("media") || domainText.includes("podcast") || domainText.includes("stream") || domainText.includes("creative")) {
      layoutType = "media";
    } else if (domainText.includes("coffee") || domainText.includes("restaurant") || domainText.includes("cafe") || domainText.includes("food") || domainText.includes("barista") || domainText.includes("dining") || domainText.includes("kitchen") || domainText.includes("recipe")) {
      layoutType = "culinary";
    } else if (domainText.includes("house") || domainText.includes("estate") || domainText.includes("realty") || domainText.includes("property") || domainText.includes("rent") || domainText.includes("home") || domainText.includes("arch")) {
      layoutType = "realestate";
    } else if (domainText.includes("learn") || domainText.includes("tutor") || domainText.includes("edu") || domainText.includes("school") || domainText.includes("course") || domainText.includes("study") || domainText.includes("student") || domainText.includes("quiz")) {
      layoutType = "edutech";
    } else {
      layoutType = "bento";
    }

    const badges = layoutType === "cyber" 
      ? ["CYBER_SENTINEL", "MEV_SHIELD", "RPC_MATRIX", "CRYPTO_NODE"]
      : layoutType === "clinical"
      ? ["BIOMARKER_TRIAGE", "RADIOLOGY_3D", "ICU_TELEMETRY", "EHR_SYNTHESIS"]
      : layoutType === "dashboard"
      ? ["EXECUTIVE_PASS", "COMPLIANCE", "ANALYTICS_KPI", "SLA_VERIFIED"]
      : layoutType === "studio"
      ? ["NODE_TRACE", "PIPELINE_RUN", "CLI_WORKFLOW", "ASYNC_WORKER"]
      : layoutType === "ecommerce"
      ? ["INVENTORY_DISPATCH", "CART_OPTIMIZER", "FULFILLMENT_HUB", "RETAIL_AI"]
      : layoutType === "media"
      ? ["RENDER_ENGINE", "AUDIO_DSP", "STREAM_NODE", "MEDIA_SYNTH"]
      : layoutType === "culinary"
      ? ["BARISTA_PASS", "ROAST_CURVE", "KITCHEN_STREAM", "RECIPE_AI"]
      : layoutType === "realestate"
      ? ["PROPERTY_RADAR", "SPATIAL_3D", "VALUATION_ENGINE", "AR_VIEW"]
      : layoutType === "edutech"
      ? ["TUTOR_NODE", "QUIZ_SYNTHESIZER", "FLASHCARD_HUB", "KNOWLEDGE_MAP"]
      : ["BUTLER_ASSIST", "SMART_HUB", "ROUTINE_AUTO", "PERSONAL_AI"];

    const latencies = ["14ms", "8ms", "22ms", "10ms"];
    const statuses = ["ONLINE", "STREAMING", "ACTIVE", "OPTIMIZED"];
    const domainImages = layoutType === "clinical"
      ? [
          "https://images.unsplash.com/photo-1579165466791-788226ab77b6?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
        ]
      : layoutType === "culinary"
      ? [
          "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
        ]
      : layoutType === "ecommerce"
      ? [
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1556742049-0a67daf66f88?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
        ]
      : [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
        ];

    const cards = agents.slice(0, 3).map((ag, idx) => ({
      id: idx + 1,
      title: `${ag.name} • ${(ag.role || 'Agent Module').split('.')[0]}`,
      badge: badges[idx % badges.length],
      latency: latencies[idx % latencies.length],
      status: statuses[idx % statuses.length],
      description: `Inputs: ${ag.inputs || 'Context Stream'} → Outputs: ${ag.outputs || 'Action Decision'}`,
      imageUrl: domainImages[idx % domainImages.length]
    }));

    const metrics = [
      { label: `${cleanDomainName} Success Rate`, value: "99.8%", change: "+2.4%", desc: `Autonomous run completion for ${cleanDomainName}` },
      { label: "Execution Latency", value: "14ms", change: "-18%", desc: "Sub-second streaming token response" },
      { label: "Active Sub-Agent Fleet", value: `${agents.length} Nodes`, change: "Active", desc: agents.map(a => a.name).join(", ") },
      { label: "Workflow Efficiency", value: "+88%", change: "Optimized", desc: `Automated task synthesis for ${cleanDomainName}` }
    ];

    let config = {
      layoutType,
      workspaceTitle: `${cleanDomainName} • ${
        layoutType === 'bento' ? 'Bento Studio' :
        layoutType === 'cyber' ? 'Cyber HUD Matrix' :
        layoutType === 'clinical' ? 'Clinical Diagnostic Canvas' :
        layoutType === 'dashboard' ? 'Executive Dashboard' :
        layoutType === 'studio' ? 'Telemetry Studio' :
        layoutType === 'ecommerce' ? 'Retail Command Hub' :
        layoutType === 'media' ? 'Media Render Studio' :
        layoutType === 'culinary' ? 'Culinary Pass Canvas' :
        layoutType === 'realestate' ? 'Spatial Property Radar' : 'EduTech Knowledge Hub'
      }`,
      workspaceSubtitle: tagline || solution || "Autonomous multi-agent execution & real-time telemetry",
      directivePlaceholder: `Enter production directive for ${cleanDomainName} (e.g., 'Execute autonomous pipeline task...')...`,
      slider1Label: 
        layoutType === 'cyber' ? 'Risk Tolerance (VaR)' : 
        layoutType === 'clinical' ? 'Diagnostic Sensitivity' : 
        layoutType === 'culinary' ? 'Roast Curve Profile' : 
        layoutType === 'ecommerce' ? 'Inventory Margin Target' : 'Automation Freedom',
      slider1Unit: "%",
      slider2Label: "Execution Depth",
      slider2Options: ["Rapid (Fast)", "Balanced (Standard)", "Deep (Max Quality)"],
      engineName: `${cleanDomainName} Core Engine`,
      engineDesc: `Autonomous multi-agent orchestration engine deploying ${agents.map(a => a.name).join(", ")}.`,
      gridTitle: 
        layoutType === 'bento' ? 'Smart Bento Canvas' : 
        layoutType === 'cyber' ? 'Active Cyber Sentinels' : 
        layoutType === 'clinical' ? 'Active Clinical Diagnostic Cases' : 
        layoutType === 'dashboard' ? 'Executive Operations Grid' : 
        layoutType === 'studio' ? 'Live Node Pipeline Canvas' : 
        layoutType === 'ecommerce' ? 'Live Fulfillment Nodes' : 
        layoutType === 'media' ? 'Active Render Streams' : 
        layoutType === 'culinary' ? 'Kitchen & Barista Passes' : 
        layoutType === 'realestate' ? 'Live Property Scans' : 'Active Learning Nodes',
      gridCount: `${cards.length} Modules Active`,
      cards,
      metrics
    };

    const cardsJson = JSON.stringify(config.cards, null, 2);
    const metricsJson = JSON.stringify(config.metrics, null, 2);
    const slider2OptionsJson = JSON.stringify(config.slider2Options);

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
    { timestamp: "00:00:01", level: "INFO", agent: "CoreRuntime", message: "${config.engineName} initialized successfully." },
    { timestamp: "00:00:02", level: "SYSTEM", agent: "${agents[0]?.name || 'ExecutiveAgent'}", message: "Standing by for autonomous pipeline execution directives." }
  ]);

  const triggerPipeline = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecutionProgress(0);
    setActiveAgentIndex(0);
    setNotification("Autonomous Pipeline Execution Started");

    const steps = [
      { progress: 25, agent: "${agents[0]?.name || 'ExecutiveAgent'}", msg: "Parsing parameters and initializing multi-agent coordination graph." },
      { progress: 50, agent: "${agents[1]?.name || 'SynthesisEngine'}", msg: "Executing autonomous domain synthesis and live workflow processing." },
      { progress: 75, agent: "${agents[2]?.name || 'OptimizationAgent'}", msg: "Optimizing throughput, telemetry metrics and resource balance." },
      { progress: 100, agent: "${agents[3]?.name || 'QualityAuditor'}", msg: "Pipeline execution verified. All assets and state finalized successfully." }
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
          setNotification("Autonomous Pipeline Completed Successfully");
          setTimeout(() => setNotification(null), 4000);
        }
      }, (idx + 1) * 900);
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/90 text-white shadow-2xl backdrop-blur-md border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Global Header */}
      <header className="border-b border-white/[0.08] bg-[#0b0e14]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">${tagline}</p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cluster: Online (0.24ms)</span>
          </div>

          <button
            onClick={triggerPipeline}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing ({executionProgress}%)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Bar */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#090c12] p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Workspace Modules</p>
              
              <button
                onClick={() => setActiveTab("studio")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "studio"
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <Layers className="w-4 h-4" />
                <span>Live Studio Canvas</span>
              </button>

              <button
                onClick={() => setActiveTab("agents")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "agents"
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <Cpu className="w-4 h-4" />
                <span>Agent Orchestrator</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "analytics"
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Telemetry & Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab("terminal")}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all \${
                  activeTab === "terminal"
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                }\`}
              >
                <Terminal className="w-4 h-4" />
                <span>Live Agent Log Terminal</span>
              </button>
            </div>

            {/* Pipeline Stage Quick Status */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-gray-300">Active Pipeline</span>
                <span className="font-mono text-indigo-400">{executionProgress}%</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: \`\${executionProgress}%\` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                {isExecuting ? "Executing active micro-agent directives..." : "Ready for next autonomous run."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 text-[11px] text-gray-300">
            <p className="font-semibold text-white mb-1">Architecture Verified</p>
            <p className="text-[10px] text-gray-400 leading-normal">
              Autonomous multi-agent synthesis ready for production deployment.
            </p>
          </div>
        </aside>

        {/* Dynamic Center Stage */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === "studio" && (
            <StudioWorkspace onTrigger={triggerPipeline} isExecuting={isExecuting} />
          )}

          {activeTab === "agents" && (
            <AgentOrchestrator
              agents={${JSON.stringify(agents, null, 2)}}
              isExecuting={isExecuting}
              activeAgentIndex={activeAgentIndex}
              logs={logs}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsDashboard />
          )}

          {activeTab === "terminal" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Live Cluster Terminal</h2>
                  <p className="text-xs text-gray-400">Verifiable trace logs, multi-agent messages and system heartbeats</p>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.08]"
                >
                  Clear Terminal
                </button>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#05070a] p-5 font-mono text-xs text-gray-300 h-[500px] overflow-y-auto space-y-2 shadow-2xl">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 leading-relaxed hover:bg-white/[0.02] p-1 rounded transition-colors">
                    <span className="text-gray-400 shrink-0">[{log.timestamp}]</span>
                    <span className={\`font-semibold shrink-0 \${
                      log.level === "SYSTEM" ? "text-purple-400" :
                      log.level === "AGENT_EXEC" ? "text-indigo-400" : "text-emerald-400"
                    }\`}>
                      {log.agent}:
                    </span>
                    <span className="text-gray-200">{log.message}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-gray-400 italic">No active logs in buffer. Click 'Run Pipeline' to stream live logs.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
`;

    // 2. /components/StudioWorkspace.tsx - Interactive Visual Workspace
    const workspaceContent = `import React, { useState } from "react";
import { Sparkles, Sliders, Play, CheckCircle2, ChevronRight, Eye, Zap, Layers, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [creativity, setCreativity] = useState(75);
  const [resolution, setResolution] = useState("${config.slider2Options[0]}");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const scenes = ${cardsJson};

  return (
    <div className="space-y-6">
      {/* Workspace Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-[#0d1017] to-purple-900/30 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>${config.workspaceTitle}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">${config.workspaceSubtitle}</h2>
          <p className="text-xs text-gray-400 max-w-xl">
            Autonomous multi-agent synthesis with live parameter tuning and real-time state synchronization.
          </p>
        </div>

        {/* Prompt Directive Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Execute Directive</span>
          </button>
        </div>
      </div>

      {/* Parameter Sliders & Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">${config.slider1Label}</span>
            <span className="font-mono text-indigo-400">{creativity}${config.slider1Unit}</span>
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
            <span className="font-semibold text-gray-300">${config.slider2Label}</span>
            <span className="font-mono text-purple-400">{resolution}</span>
          </div>
          <div className="flex gap-2">
            {${slider2OptionsJson}.map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={\`flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-all \${
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
            <span className="font-mono text-emerald-400">${config.engineName}</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            ${config.engineDesc}
          </p>
        </div>
      </div>

      {/* Production Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">${config.gridTitle}</h3>
          <span className="text-xs text-gray-400 font-mono">${config.gridCount}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, index) => {
          const isActive = isExecuting && activeAgentIndex === index;
          const isDone = isExecuting && activeAgentIndex > index;

          return (
            <div
              key={agent.name}
              className={\`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between \${
                isActive
                  ? "bg-indigo-950/30 border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : isDone
                  ? "bg-emerald-950/20 border-emerald-500/40"
                  : "bg-[#0d1017]/80 border-white/[0.08]"
              }\`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-indigo-400 font-mono text-xs font-bold border border-white/[0.08]">
                    0{index + 1}
                  </div>
                  <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-white/[0.05] text-gray-400"
                  }\`}>
                    {isActive ? "Executing" : isDone ? "Completed" : "Standby"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{agent.role}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                <div className="text-gray-400">
                  <span className="text-gray-400 font-sans font-semibold">Inputs:</span> {agent.inputs}
                </div>
                <div className="text-indigo-400">
                  <span className="text-gray-400 font-sans font-semibold">Outputs:</span> {agent.outputs}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-Time Agent Communication Log */}
      <div className="p-6 rounded-2xl bg-[#0d1017]/90 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Inter-Agent Protocol Stream</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Stream Connected
          </span>
        </div>

        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-xs text-gray-300 space-y-2 h-48 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-gray-400">[{l.timestamp}]</span>
              <span className="text-indigo-400 font-bold">{l.agent}:</span>
              <span className="text-gray-300">{l.message}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-gray-400 italic">No communication logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}`;

    // 4. /components/AnalyticsDashboard.tsx - Telemetry & GPU Metrics
    const analyticsContent = `import React from "react";
import { BarChart3, TrendingUp, Cpu, Activity, Zap, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AnalyticsDashboard() {
  const metrics = ${metricsJson};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Telemetry & Performance Matrix</h2>
        <p className="text-xs text-gray-400">Real-time compute performance, token economy, and pipeline SLAs</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{m.label}</span>
              <span className="text-emerald-400 font-mono font-bold">{m.change}</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{m.value}</p>
            <p className="text-[11px] text-gray-400 leading-tight">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Performance Charts Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Latency & Throughput Profile</h3>
            </div>
            <span className="text-xs text-indigo-400 font-mono">Real-time</span>
          </div>

          <div className="h-44 flex items-end gap-2 pt-4">
            {[42, 68, 55, 84, 95, 78, 62, 90, 85, 99, 74, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                  style={{ height: \`\${h}%\` }}
                />
                <span className="text-[9px] font-mono text-gray-400">{i + 1}m</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d1017]/80 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Cluster Security & SLA Verification</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">100% Pass</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { title: "Deterministic Cryptographic State Checks", status: "Verified" },
              { title: "Sub-second Token Cache Layer (Redis)", status: "Active" },
              { title: "Zero Data Leakage Sandboxed Runtime", status: "Compliant" },
              { title: "Automated Multi-Region Failover", status: "Operational" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                <div className="flex items-center gap-2.5 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{item.title}</span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`;

    // 5. /styles.css - Global Styles
    const stylesContent = `body {
  margin: 0;
  padding: 0;
  background-color: #07090e;
  color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
`;

    // 6. Native Source Files for Target Tech Stack (iOS Swift, Android Kotlin, Python, etc.)
    const nativeFiles: GeneratedFile[] = [];
    const cleanProject = (projectName || "NeuroFlowAI").replace(/[^a-zA-Z0-9]/g, "");

    const isIos = fullText.includes("ios") || fullText.includes("swift") || fullText.includes("iphone") || fullText.includes("apple") || fullText.includes("xcode");
    const isAndroid = fullText.includes("android") || fullText.includes("kotlin") || fullText.includes("java") || fullText.includes("watchos");
    const isPython = fullText.includes("python") || fullText.includes("fastapi") || fullText.includes("django") || fullText.includes("flask");
    const isFlutter = fullText.includes("flutter") || fullText.includes("dart");
    const isReactNative = fullText.includes("react native") || fullText.includes("expo");
    const isRust = fullText.includes("rust") || fullText.includes("cargo");
    const isGo = fullText.includes("go") || fullText.includes("golang");
    const isWeb3 = fullText.includes("solidity") || fullText.includes("ethereum") || fullText.includes("web3") || fullText.includes("hardhat") || fullText.includes("foundry");

    const isExplicitOther = isAndroid || isPython || isFlutter || isReactNative || isRust || isGo || isWeb3;

    if (isIos || !isExplicitOther) {
      // Generate Native iOS Swift & SwiftUI Source Files
      nativeFiles.push({
        path: `ios/${cleanProject}App.swift`,
        content: `import SwiftUI
import HealthKit
import CoreMotion

@main
struct ${cleanProject}App: App {
    @StateObject private var orchestrator = AgentOrchestratorEngine()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(orchestrator)
        }
    }
}`
      });

      nativeFiles.push({
        path: `ios/Views/ContentView.swift`,
        content: `import SwiftUI

struct ContentView: View {
    @EnvironmentObject var orchestrator: AgentOrchestratorEngine
    @State private var isExecuting = false

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.04, green: 0.05, blue: 0.08).ignoresSafeArea()

                VStack(spacing: 20) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("${projectName}")
                                .font(.system(size: 24, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            Text("${tagline}")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(.gray)
                        }
                        Spacer()
                    }
                    .padding()

                    // Agent HUD
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Circle()
                                .fill(isExecuting ? Color.green : Color.orange)
                                .frame(width: 8, height: 8)
                            Text(isExecuting ? "AI AGENT FLEET ACTIVE" : "STANDBY MODE")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(.white)
                        }

                        ProgressView(value: orchestrator.progress, total: 1.0)
                            .tint(.purple)

                        Text(orchestrator.statusMessage)
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                    .padding()
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(16)
                    .padding(.horizontal)

                    Spacer()

                    Button(action: {
                        isExecuting.toggle()
                        orchestrator.triggerPipeline()
                    }) {
                        HStack {
                            Image(systemName: isExecuting ? "arrow.triangle.2.circlepath" : "play.fill")
                            Text(isExecuting ? "Executing Agents..." : "Run AI Pipeline")
                        }
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(LinearGradient(colors: [Color.indigo, Color.purple], startPoint: .leading, endPoint: .trailing))
                        .cornerRadius(16)
                    }
                    .padding(.horizontal)
                }
            }
        }
    }
}`
      });

      nativeFiles.push({
        path: `ios/Agents/${agents[0]?.name || 'DataFusionAgent'}.swift`,
        content: `import Foundation
import HealthKit
import CoreMotion

/// ${agents[0]?.name || 'DataFusionAgent'}
/// Role: ${agents[0]?.role || 'Collects raw biometric streams and fuses into cognitive state context.'}
final class ${agents[0]?.name || 'DataFusionAgent'} {
    private let healthStore = HKHealthStore()
    private let motionManager = CMMotionManager()

    func fuseSensorContext() async throws -> [String: Any] {
        return [
            "timestamp": Date().timeIntervalSince1970,
            "hrv": 68.2,
            "heartRate": 74.0,
            "cognitiveFatigueIndex": 0.21,
            "status": "OPTIMAL_HEALTH"
        ]
    }
}`
      });

      nativeFiles.push({
        path: `ios/Package.swift`,
        content: `// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "${cleanProject}",
    platforms: [.iOS(.v17), .watchOS(.v10)],
    products: [
        .library(name: "${cleanProject}", targets: ["${cleanProject}"])
    ],
    targets: [
        .target(name: "${cleanProject}", path: "ios")
    ]
)`
      });
    }

    if (isAndroid) {
      nativeFiles.push({
        path: `android/MainActivity.kt`,
        content: `package com.agentic.${cleanProject.toLowerCase()}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text(text = "${projectName} - Autonomous Multi-Agent Command Center")
        }
    }
}`
      });

      nativeFiles.push({
        path: `android/agents/${agents[0]?.name || 'DataFusionAgent'}.kt`,
        content: `package com.agentic.${cleanProject.toLowerCase()}.agents

class ${agents[0]?.name || 'DataFusionAgent'} {
    fun executeSensorFusion(): Map<String, Any> {
        return mapOf(
            "status" to "ONLINE",
            "agent" to "${agents[0]?.name || 'DataFusionAgent'}",
            "role" to "${agents[0]?.role || 'Autonomous Telemetry'}"
        )
    }
}`
      });
    }

    if (isFlutter) {
      nativeFiles.push({
        path: `lib/main.dart`,
        content: `import 'package:flutter/material.dart';

void main() {
  runApp(const ${cleanProject}App());
}

class ${cleanProject}App extends StatelessWidget {
  const ${cleanProject}App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${projectName}',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF07090E),
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool isExecuting = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${projectName}'),
        backgroundColor: const Color(0xFF0B0E14),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '${tagline}',
              style: const TextStyle(color: Colors.grey, fontSize: 14),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  isExecuting = !isExecuting;
                });
              },
              icon: Icon(isExecuting ? Icons.sync : Icons.play_arrow),
              label: Text(isExecuting ? 'Executing AI Agents...' : 'Run Flutter Pipeline'),
            ),
          ],
        ),
      ),
    );
  }
}`
      });

      nativeFiles.push({
        path: `lib/agents/data_fusion_agent.dart`,
        content: `class ${agents[0]?.name || 'DataFusionAgent'} {
  final String role = "${agents[0]?.role || 'Sensors Fusion'}";

  Future<Map<String, dynamic>> executePipeline() async {
    return {
      'agent': '${agents[0]?.name || 'DataFusionAgent'}',
      'status': 'ONLINE',
      'timestamp': DateTime.now().toIso8601String(),
    };
  }
}`
      });

      nativeFiles.push({
        path: `pubspec.yaml`,
        content: `name: ${cleanProject.toLowerCase()}
description: "${tagline}"
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true`
      });
    }

    if (isReactNative) {
      nativeFiles.push({
        path: `mobile/App.tsx`,
        content: `import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  const [isExecuting, setIsExecuting] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>${projectName}</Text>
        <Text style={styles.subtitle}>${tagline}</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setIsExecuting(!isExecuting)}
        >
          <Text style={styles.buttonText}>
            {isExecuting ? 'Executing AI Agents...' : 'Run React Native Pipeline'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090e' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center' },
  button: { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 32 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }
});`
      });

      nativeFiles.push({
        path: `mobile/app.json`,
        content: JSON.stringify({
          expo: {
            name: projectName,
            slug: cleanProject.toLowerCase(),
            version: "1.0.0"
          }
        }, null, 2)
      });
    }

    if (isRust) {
      nativeFiles.push({
        path: `src/main.rs`,
        content: `use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct AgentResponse {
    status: String,
    agent: String,
    role: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std.error.Error>> {
    println!("🚀 Starting ${projectName} - Autonomous Rust Agent Fleet");
    
    let res = AgentResponse {
        status: "ONLINE".to_string(),
        agent: "${agents[0]?.name || 'DataFusionAgent'}".to_string(),
        role: "${agents[0]?.role || 'High-performance Telemetry'}".to_string(),
    };
    
    println!("{:#?}", res);
    Ok(())
}
`
      });

      nativeFiles.push({
        path: `Cargo.toml`,
        content: `[package]
name = "${cleanProject.toLowerCase()}"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
`
      });
    }

    if (isGo) {
      nativeFiles.push({
        path: `cmd/server/main.go`,
        content: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type AgentTelemetry struct {
	App    string \`json:"app"\`
	Status string \`json:"status"\`
}

func main() {
	http.HandleFunc("/telemetry", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(AgentTelemetry{
			App:    "${projectName}",
			Status: "ONLINE",
		})
	})

	fmt.Println("🚀 Go Agent Server listening on :8080...")
	http.ListenAndServe(":8080", nil)
}
`
      });

      nativeFiles.push({
        path: `go.mod`,
        content: `module github.com/agentic/${cleanProject.toLowerCase()}

go 1.21
`
      });
    }

    if (isWeb3) {
      nativeFiles.push({
        path: `contracts/AgentOrchestrator.sol`,
        content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentOrchestrator {
    string public name = "${projectName}";
    address public owner;
    
    event AgentExecuted(string agentName, string status);
    
    constructor() {
        owner = msg.sender;
    }
    
    function triggerExecution(string memory agentName) external {
        emit AgentExecuted(agentName, "COMPLETED");
    }
}
`
      });

      nativeFiles.push({
        path: `hardhat.config.ts`,
        content: `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
`
      });
    }

    if (isPython) {
      nativeFiles.push({
        path: `backend/main.py`,
        content: `from fastapi import FastAPI

app = FastAPI(title="${projectName}", description="${tagline}")

@app.get("/")
def read_root():
    return {
        "app": "${projectName}",
        "status": "ONLINE",
        "agentFleet": [
            {"name": "${agents[0]?.name}", "role": "${agents[0]?.role}"},
            {"name": "${agents[1]?.name}", "role": "${agents[1]?.role}"}
        ]
    }

@app.post("/orchestrate")
def orchestrate_pipeline():
    return {
        "status": "COMPLETED",
        "message": "Autonomous multi-agent synthesis executed successfully."
    }
`
      });

      nativeFiles.push({
        path: `backend/requirements.txt`,
        content: `fastapi>=0.100.0
uvicorn>=0.22.0
pydantic>=2.0.0
groq>=0.4.0
`
      });
    }

    return [
      ...nativeFiles,
      { path: 'App.tsx', content: appContent },
      { path: 'components/StudioWorkspace.tsx', content: workspaceContent },
      { path: 'components/AgentOrchestrator.tsx', content: orchestratorContent },
      { path: 'components/AnalyticsDashboard.tsx', content: analyticsContent },
      { path: 'styles.css', content: stylesContent }
    ];
  }

  private generateReadme(bp: HackathonBlueprint): string {
    const tracks = (bp as any).targetTracks ? (bp as any).targetTracks.map((t: string) => `- ${t}`).join('\n') : '- Autonomous AI\n- Multi-Agent Orchestration';
    return `# ${bp.projectName}
> ${bp.tagline}

## 🚀 Overview
${bp.proposedSolution}

## 🎯 Target Tracks
${tracks}

## 🤖 Multi-Agent Architecture
${bp.agentArchitecture ? bp.agentArchitecture.map(a => `### ${a.name}\n- **Role:** ${a.role}\n- **Inputs:** ${a.inputs}\n- **Outputs:** ${a.outputs}\n`).join('\n') : ''}
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
