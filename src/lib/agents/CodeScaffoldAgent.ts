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

    // Context-aware domain configurations
    let config = {
      workspaceTitle: "AI Production & Strategy Canvas",
      workspaceSubtitle: "Direct & synthesize multimodal autonomous workflows",
      directivePlaceholder: "Enter production directive (e.g., 'Generate multi-agent execution pipeline...')...",
      slider1Label: "Optimization Freedom",
      slider1Unit: "%",
      slider2Label: "Execution Depth",
      slider2Options: ["Rapid (Fast)", "Balanced (Standard)", "Deep (Max Quality)"],
      engineName: "Gemini 1.5 Pro Cluster",
      engineDesc: "Autonomous multi-agent orchestration engine with real-time feedback loops.",
      gridTitle: "Active Intelligence Canvas",
      gridCount: "3 Modules Active",
      cards: [
        {
          id: 1,
          title: "Neural Pipeline Synthesis",
          badge: "ORCHESTRATION",
          latency: "14ms",
          status: "ONLINE",
          description: "Autonomous multi-agent execution cluster routing tasks across distributed sub-systems.",
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: 2,
          title: "Real-time Telemetry & State",
          badge: "MONITORING",
          latency: "8ms",
          status: "STREAMING",
          description: "Sub-second event streaming with verifiable cryptographic logs and state checkpointing.",
          imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: 3,
          title: "High-Throughput Computation",
          badge: "ACCELERATION",
          latency: "22ms",
          status: "OPTIMIZED",
          description: "Parallel token scheduling and automated resource allocation for maximum efficiency.",
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
        }
      ],
      metrics: [
        { label: "Pipeline Success Rate", value: "99.8%", change: "+2.4%", desc: "Autonomous run completion across 2,400+ jobs" },
        { label: "Average Execution Latency", value: "24ms", change: "-18%", desc: "Sub-second streaming token response" },
        { label: "Compute Efficiency SLA", value: "98.4%", change: "+5.1%", desc: "Optimal GPU & memory load balancing" },
        { label: "Active Sub-Agent Fleet", value: "12 Nodes", change: "Active", desc: "Coordinated micro-agents in live topology" }
      ]
    };

    if (fullText.includes("coffee") || fullText.includes("restaurant") || fullText.includes("cafe") || fullText.includes("food") || fullText.includes("barista") || fullText.includes("dining") || fullText.includes("kitchen") || fullText.includes("roast") || fullText.includes("menu")) {
      config = {
        workspaceTitle: "Artisan Coffee & Culinary Command Canvas",
        workspaceSubtitle: "Autonomous sensory extraction, live kitchen stream & inventory dispatch",
        directivePlaceholder: "Enter roast curve, seasonal menu pairings, or order dispatch directives...",
        slider1Label: "Roast & Extraction Profile",
        slider1Unit: "°C / Yield",
        slider2Label: "Service Velocity",
        slider2Options: ["Artisan Pour (Slow)", "Peak Rush (Fast)", "Tasting Flight (Deep)"],
        engineName: "Sensory AI & Order Hub",
        engineDesc: "Autonomous sensory roast modeling, real-time ticket dispatch, and intelligent inventory tracking.",
        gridTitle: "Active Kitchen & Barista Station",
        gridCount: "3 Stations Live",
        cards: [
          {
            id: 1,
            title: "Ethiopia Yirgacheffe • Single Origin Pour-Over",
            badge: "BARISTA BAR",
            latency: "1:45 min",
            status: "BREWING",
            description: "Floral jasmine & bergamot tasting notes with precise 93.5°C PID temperature profiling.",
            imageUrl: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 2,
            title: "Kyoto-Style Nitrogen Cold Drip Infusion",
            badge: "SPECIALTY ROAST",
            latency: "Cold Extract",
            status: "SERVED",
            description: "12-hour slow single-origin extraction infused with micro-nitrogen bubbles for velvet crema.",
            imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 3,
            title: "Artisan Culinary Pairing & Truffle Flight",
            badge: "CHEF PASS",
            latency: "3:20 min",
            status: "EXPEDITING",
            description: "Handmade tagliolini with shaved black winter truffles paired with biodynamic reserve espresso.",
            imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
          }
        ],
        metrics: [
          { label: "Order Velocity & Turn", value: "1.8 min", change: "-35s avg", desc: "Average table ticket-to-pass delivery time" },
          { label: "Bean Freshness SLA", value: "100%", change: "Optimal", desc: "48h post-roast degas threshold compliance" },
          { label: "Daily Customer Satisfaction", value: "4.98 ★", change: "+0.3%", desc: "Based on 340+ verified digital table reviews" },
          { label: "Inventory Waste Reduction", value: "-42.6%", change: "Saved $1.4k", desc: "AI predictive batch brewing & ingredient scheduling" }
        ]
      };
    } else if (fullText.includes("finance") || fullText.includes("crypto") || fullText.includes("defi") || fullText.includes("trading") || fullText.includes("invest") || fullText.includes("stock")) {
      config = {
        workspaceTitle: "Algorithmic Market & Portfolio Matrix",
        workspaceSubtitle: "Autonomous cross-chain liquidity sentinel & quantitative execution hub",
        directivePlaceholder: "Enter market hedge parameters, yield rebalancing or risk thresholds...",
        slider1Label: "Risk Tolerance (VaR)",
        slider1Unit: "%",
        slider2Label: "Execution Horizon",
        slider2Options: ["High-Frequency (10ms)", "Intraday (1h)", "Macro Swing (24h)"],
        engineName: "Quant Alpha Engine",
        engineDesc: "Sub-millisecond volatility analysis, MEV-shielded liquidity routing, and automated delta hedging.",
        gridTitle: "Active Strategy Sentinel",
        gridCount: "3 Vaults Live",
        cards: [
          {
            id: 1,
            title: "Arbitrage & Liquidity Pool Sentinel",
            badge: "DEFI MATRIX",
            latency: "4ms",
            status: "ACTIVE",
            description: "Continuous automated scanning across concentrated liquidity pools and flash loans.",
            imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 2,
            title: "Dynamic Delta-Neutral Yield Vault",
            badge: "ALGO TRADING",
            latency: "Real-time",
            status: "HEDGED",
            description: "Automated collateral re-pegging and perpetual futures basis funding arbitrage.",
            imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 3,
            title: "Institutional Risk & Exposure Radar",
            badge: "RISK DESK",
            latency: "12ms",
            status: "PROTECTED",
            description: "Multi-factor stress testing against tail-risk volatility and black swan liquidity shocks.",
            imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"
          }
        ],
        metrics: [
          { label: "Portfolio Sharpe Ratio", value: "3.42", change: "+0.84", desc: "Risk-adjusted performance above benchmark" },
          { label: "Execution Slippage", value: "-0.012%", change: "Optimized", desc: "Saved $18,400 via private RPC bundle routing" },
          { label: "Total Value Protected", value: "$8.42M", change: "100% Insured", desc: "Locked across smart contract vaults" },
          { label: "Automated Profit Realized", value: "+34.8% APY", change: "+4.2% MoM", desc: "Net algorithmic return after gas fees" }
        ]
      };
    } else if (fullText.includes("health") || fullText.includes("med") || fullText.includes("clinic") || fullText.includes("patient") || fullText.includes("doctor") || fullText.includes("pharma") || fullText.includes("care")) {
      config = {
        workspaceTitle: "Clinical Intelligence & Diagnostic Canvas",
        workspaceSubtitle: "Multimodal biomarker triage, patient telemetry & automated EHR synthesis",
        directivePlaceholder: "Enter clinical triage protocol, imaging scan directives or EHR analysis query...",
        slider1Label: "Diagnostic Sensitivity",
        slider1Unit: "%",
        slider2Label: "Triage Priority",
        slider2Options: ["Routine (P3)", "Urgent (P2)", "Critical ICU (P1)"],
        engineName: "Clinical AI Copilot",
        engineDesc: "HIPAA-compliant multimodal medical synthesis supporting physicians with evidence-based diagnostics.",
        gridTitle: "Active Patient Diagnostic Streams",
        gridCount: "3 Cases Active",
        cards: [
          {
            id: 1,
            title: "Multimodal Biomarker & Genomic Triage",
            badge: "PATHOLOGY",
            latency: "18ms",
            status: "ANALYZED",
            description: "High-resolution cross-referencing of blood panels, genomic variants, and metabolic markers.",
            imageUrl: "https://images.unsplash.com/photo-1579165466791-788226ab77b6?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 2,
            title: "Neural Radiology & Imaging Scan Synthesis",
            badge: "RADIOLOGY",
            latency: "0.8s",
            status: "RENDERED",
            description: "3D volumetric anomaly detection for MRI, CT, and fluoroscopy scans with bounding overlays.",
            imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: 3,
            title: "ICU Continuous Telemetry & Vitals Monitor",
            badge: "ICU WARD",
            latency: "100Hz",
            status: "STABLE",
            description: "Predictive decompensation alerting and continuous cardiac rhythm anomaly detection.",
            imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
          }
        ],
        metrics: [
          { label: "Diagnostic Concordance", value: "99.4%", change: "+1.2%", desc: "Aligned with board-certified clinical panels" },
          { label: "Triage Alert Latency", value: "14ms", change: "-82ms", desc: "Immediate notification for critical decompensation" },
          { label: "EHR Documentation Time", value: "-68%", change: "Saved 2.4h/day", desc: "Automated physician clinical chart generation" },
          { label: "HIPAA & Security Score", value: "100%", change: "Zero Leak", desc: "Full end-to-end encrypted on-prem inference" }
        ]
      };
    }

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

    return [
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
