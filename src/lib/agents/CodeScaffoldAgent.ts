import { HackathonBlueprint } from "./IdeaStrategistAgent";
import fs from "fs";
import path from "path";

export interface GeneratedFile {
  path: string;
  content: string;
}

export class CodeScaffoldAgent {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || "";
  }

  async scaffoldProject(blueprint: HackathonBlueprint, outputDir: string): Promise<string> {
    const projectDir = path.join(outputDir, this.slugify(blueprint.projectName));
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    const files = await this.generateProjectFiles(blueprint);
    for (const file of files) {
      const fullPath = path.join(projectDir, file.path);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, file.content);
    }
    fs.writeFileSync(path.join(projectDir, "README.md"), this.generateReadme(blueprint));
    fs.writeFileSync(path.join(projectDir, ".env.example"), this.generateEnvExample(blueprint));
    fs.writeFileSync(path.join(projectDir, ".gitignore"), this.generateGitignore());
    return projectDir;
  }

  public async generateProjectFiles(blueprint: HackathonBlueprint): Promise<GeneratedFile[]> {
    const projectName = (blueprint.projectName || "Agentic Studio").replace(/"/g, '"');
    const tagline = (blueprint.tagline || "Autonomous Multi-Agent Enterprise Command Center").replace(/"/g, '"');
    const agents = blueprint.agentArchitecture && blueprint.agentArchitecture.length > 0
      ? blueprint.agentArchitecture
      : [
          { name: "ExecutiveAgent", role: "Orchestrates multi-agent task graphs and executive telemetry", inputs: "Domain Directives", outputs: "Production Specs" },
          { name: "SynthesisEngine", role: "Executes deep domain synthesis & neural workflows", inputs: "Task Directives", outputs: "Generated Assets" },
          { name: "OptimizationAgent", role: "Monitors economics, token throughput & efficiency", inputs: "Execution Graph", outputs: "Performance Metrics" },
          { name: "QualityAuditor", role: "Performs continuous compliance & quality assurance", inputs: "Pipeline Outputs", outputs: "Verified Master" }
        ];

    const cleanDomainName = projectName;
    const problem = (blueprint.problemStatement || "").replace(/"/g, '"');
    const solution = (blueprint.proposedSolution || "").replace(/"/g, '"');
    const domainText = (blueprint.projectName + " " + blueprint.tagline + " " + blueprint.problemStatement + " " + blueprint.proposedSolution).toLowerCase();

    // Count how many archetypes are mentioned in the domain text
    let archetypeCount = 0;
    if (domainText.includes("land") || domainText.includes("hero") || domainText.includes("marketing")) archetypeCount++;
    if (domainText.includes("shop") || domainText.includes("store") || domainText.includes("cart") || domainText.includes("ecommerce")) archetypeCount++;
    if (domainText.includes("kanban") || domainText.includes("task") || domainText.includes("board")) archetypeCount++;
    if (domainText.includes("social") || domainText.includes("feed") || domainText.includes("community")) archetypeCount++;
    if (domainText.includes("table") || domainText.includes("crm") || domainText.includes("database")) archetypeCount++;
    if (domainText.includes("code") || domainText.includes("ide") || domainText.includes("workspace") || domainText.includes("editor")) archetypeCount++;
    if (domainText.includes("chat") || domainText.includes("assistant") || domainText.includes("bot")) archetypeCount++;
    if (domainText.includes("video") || domainText.includes("stream") || domainText.includes("media")) archetypeCount++;
    if (domainText.includes("dash") || domainText.includes("telemetry") || domainText.includes("analytics")) archetypeCount++;

    let layoutType: string = blueprint.layoutType as string;

    // If prompt explicitly combines multiple archetypes (e.g. 2 or more), force Unified Master Platform layout
    if (archetypeCount >= 2 || domainText.includes("all-in-one") || domainText.includes("unified") || domainText.includes("combine") || domainText.includes("cockpit")) {
      layoutType = "unified_platform";
    } else if (!layoutType) {
      if (domainText.includes("land") || domainText.includes("hero")) layoutType = "landing";
      else if (domainText.includes("shop") || domainText.includes("store")) layoutType = "storefront";
      else if (domainText.includes("kanban") || domainText.includes("task")) layoutType = "kanban";
      else if (domainText.includes("feed") || domainText.includes("social")) layoutType = "feed";
      else if (domainText.includes("table") || domainText.includes("crm")) layoutType = "datatable";
      else if (domainText.includes("code") || domainText.includes("ide")) layoutType = "workspace";
      else if (domainText.includes("chat") || domainText.includes("assistant")) layoutType = "chat";
      else if (domainText.includes("stream") || domainText.includes("video")) layoutType = "streaming";
      else layoutType = "unified_platform";
    }

    const badges = ["AUTONOMOUS_AI", "MULTI_AGENT", "ENTERPRISE", "REALTIME_DSP"];
    const latencies = ["14ms", "8ms", "22ms", "10ms"];
    const statuses = ["ONLINE", "STREAMING", "ACTIVE", "OPTIMIZED"];
    const domainImages = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
    ];

    const cards = agents.slice(0, 3).map((ag, idx) => ({
      id: idx + 1,
      title: ag.name + " • " + (ag.role || "Agent Module").split(".")[0],
      badge: badges[idx % badges.length],
      latency: latencies[idx % latencies.length],
      status: statuses[idx % statuses.length],
      description: "Inputs: " + (ag.inputs || "Context Stream") + " → Outputs: " + (ag.outputs || "Action Decision"),
      imageUrl: domainImages[idx % domainImages.length]
    }));

    const metrics = [
      { label: cleanDomainName + " Success Rate", value: "99.8%", change: "+2.4%", desc: "Autonomous run completion" },
      { label: "Execution Latency", value: "14ms", change: "-18%", desc: "Sub-second streaming token response" },
      { label: "Active Sub-Agent Fleet", value: agents.length + " Nodes", change: "Active", desc: agents.map(a => a.name).join(", ") },
      { label: "Workflow Efficiency", value: "+88%", change: "Optimized", desc: "Automated task synthesis" }
    ];

    let config = {
      layoutType,
      workspaceTitle: cleanDomainName,
      workspaceSubtitle: tagline || solution || "Autonomous multi-agent execution & real-time telemetry",
      directivePlaceholder: "Enter production directive for " + cleanDomainName + "...",
      cards,
      metrics
    };

    const cardsJson = JSON.stringify(config.cards, null, 2);
    const metricsJson = JSON.stringify(config.metrics, null, 2);

    const appContent = this.generateAppContent(layoutType, config, cardsJson, projectName, tagline);
    const workspaceContent = this.generateWorkspaceContent(layoutType, config, cardsJson);
    const orchestratorContent = this.generateOrchestratorContent();
    const analyticsContent = this.generateAnalyticsContent(metricsJson);
    const stylesContent = this.generateStylesContent();

    return [
      { path: "App.tsx", content: appContent },
      { path: "components/StudioWorkspace.tsx", content: workspaceContent },
      { path: "components/AgentOrchestrator.tsx", content: orchestratorContent },
      { path: "components/AnalyticsDashboard.tsx", content: analyticsContent },
      { path: "styles.css", content: stylesContent }
    ];
  }

  private generateAppContent(layoutType: string, config: any, cardsJson: string, projectName: string, tagline: string): string {
    return `import React, { useState } from "react";
import {
  Sparkles, Zap, Layout, ShoppingBag, Layers, MessageSquare, Database, Code, Bot, Play,
  BarChart3, CheckCircle2, Search, Filter, ShoppingCart, User, Terminal, FolderTree,
  Send, ThumbsUp, ArrowRight, ShieldCheck, Star, ChevronDown, Check, Plus, HardDrive
} from "lucide-react";
import StudioWorkspace from "./components/StudioWorkspace";

export default function App() {
  const [activeModule, setActiveModule] = useState<"landing" | "storefront" | "kanban" | "feed" | "datatable" | "workspace" | "chat" | "streaming" | "dashboard">("landing");
  const [activeDemo, setActiveDemo] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  // Kanban State
  const [tasks] = useState([
    { id: 1, title: "Initialize Neural Directive Graph", col: "backlog", assignee: "Alex Vance", tag: "AI ENGINE" },
    { id: 2, title: "Synthesize Multimodal Sub-Agents", col: "progress", assignee: "Sarah Chen", tag: "SYNTHESIS" },
    { id: 3, title: "Zero-Trust Security Verification", col: "review", assignee: "David Miller", tag: "SECURITY" },
    { id: 4, title: "Deploy Global Edge Pipeline", col: "done", assignee: "Elena Rostova", tag: "DEVOPS" }
  ]);

  // Feed State
  const [posts] = useState([
    { id: 1, author: "Agentic Core Team", time: "10m ago", text: "Autonomous multi-agent execution pipeline v4.2 is live across all global edge nodes!", likes: 184, comments: 32 },
    { id: 2, author: "DevOps Sentinel", time: "1h ago", text: "Zero-latency streaming token verification completed with 99.98% accuracy.", likes: 96, comments: 14 }
  ]);

  // Data Table State
  const [records] = useState([
    { id: "REC-901", name: "Executive Directive Node", type: "Neural Graph", status: "ACTIVE", latency: "12ms", value: "$42,000" },
    { id: "REC-902", name: "DataInsight SQL Agent", type: "Database", status: "OPTIMIZED", latency: "8ms", value: "$18,500" },
    { id: "REC-903", name: "WebRTC Media Synthesizer", type: "Stream DSP", status: "RUNNING", latency: "14ms", value: "$29,000" }
  ]);

  // IDE Workspace State
  const [activeFile, setActiveFile] = useState("App.tsx");

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Welcome to ${projectName} Enterprise AI Copilot. How can I assist your directive execution today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const products = [
    { id: 1, title: "Neural Studio Pro Headset X1", price: "$299.00", rating: "4.9", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Autonomous Studio Keyboard", price: "$189.00", rating: "4.8", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Quantum Telemetry Monitor 4K", price: "$499.00", rating: "5.0", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Global Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>UNIFIED ENTERPRISE COCKPIT: ${projectName} v4.2 is live with 9 integrated modules!</span>
      </div>

      {/* Global Glassmorphic Multi-Module Header */}
      <header className="border-b border-white/[0.08] bg-[#0b0e14]/90 backdrop-blur-xl px-6 py-3 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              ${projectName}
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30">ONLINE</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">${tagline}</p>
          </div>
        </div>

        {/* 9 Archetype Module Tabs Switcher */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-semibold">
          {[
            { id: "landing", label: "Hero & Landing", icon: Layout },
            { id: "storefront", label: "Storefront", icon: ShoppingBag },
            { id: "kanban", label: "Task Kanban", icon: Layers },
            { id: "feed", label: "Social Feed", icon: MessageSquare },
            { id: "datatable", label: "CRM Table", icon: Database },
            { id: "workspace", label: "Code IDE", icon: Code },
            { id: "chat", label: "AI Copilot", icon: Bot },
            { id: "streaming", label: "Media Stage", icon: Play },
            { id: "dashboard", label: "Telemetry", icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer " + (isActive ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md" : "text-gray-400 hover:text-white hover:bg-white/[0.05]")}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setActiveDemo(!activeDemo)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{activeDemo ? "Hide Workspace HUD" : "Trigger Live Directive"}</span>
        </button>
      </header>

      {/* Live Directive Execution Workspace HUD Banner */}
      {activeDemo && (
        <div className="p-6 bg-[#0a0d14] border-b border-indigo-500/30 animate-fadeIn max-w-7xl mx-auto w-full my-4 rounded-3xl">
          <StudioWorkspace onTrigger={() => {}} isExecuting={false} />
        </div>
      )}

      {/* Dynamic Module Content View Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* 1. LANDING MODULE */}
        {activeModule === "landing" && (
          <div className="space-y-16 py-8 text-center animate-fadeIn">
            <div className="space-y-6">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                ENTERPRISE MULTI-AGENT ARCHITECTURE
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
                The World-Class AI Engine for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">${projectName}</span>
              </h1>
              <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">${tagline}</p>
              <div className="flex justify-center gap-4 pt-4">
                <button onClick={() => setActiveModule("workspace")} className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-xl cursor-pointer flex items-center gap-2">
                  <span>Open IDE Workspace</span> <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveModule("storefront")} className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 font-bold text-xs border border-white/[0.1] cursor-pointer">
                  Explore Marketplace
                </button>
              </div>
            </div>

            {/* SLA Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08]">
                <p className="text-2xl font-bold text-white">99.98%</p>
                <p className="text-xs text-gray-400 mt-1">Autonomous SLA</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08]">
                <p className="text-2xl font-bold text-indigo-400">&lt;14ms</p>
                <p className="text-xs text-gray-400 mt-1">Token Latency</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08]">
                <p className="text-2xl font-bold text-purple-400">2.5B+</p>
                <p className="text-xs text-gray-400 mt-1">Tokens Synthesized</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08]">
                <p className="text-2xl font-bold text-pink-400">50,000+</p>
                <p className="text-xs text-gray-400 mt-1">Active Fleets</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. STOREFRONT MODULE */}
        {activeModule === "storefront" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">${projectName} Marketplace & Hardware Store</h2>
                <p className="text-xs text-gray-400">Deploy validated developer hardware and agent tools.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-2 shadow-lg">
                <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-3">
                  <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded-xl" />
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-sm">{p.price}</span>
                    <button onClick={() => setCartCount(cartCount + 1)} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer">
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. KANBAN MODULE */}
        {activeModule === "kanban" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Project Sprint Kanban Board</h2>
                <p className="text-xs text-gray-400">Autonomous task graph assigned to specialist sub-agents.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {["backlog", "progress", "review", "done"].map((col) => (
                <div key={col} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>{col}</span>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-indigo-400">{tasks.filter(t => t.col === col).length}</span>
                  </h3>
                  {tasks.filter(t => t.col === col).map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] space-y-2">
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{t.tag}</span>
                      <p className="text-xs font-bold text-white">{t.title}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1"><User className="w-3 h-3" /> {t.assignee}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FEED MODULE */}
        {activeModule === "feed" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="text-lg font-bold text-white">Developer & Agent Community Feed</h2>
              <p className="text-xs text-gray-400">Real-time status updates and execution streams.</p>
            </div>
            {posts.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{p.author}</span>
                  <span className="text-gray-500">{p.time}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{p.text}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/[0.05]">
                  <span>❤️ {p.likes} Likes</span>
                  <span>💬 {p.comments} Comments</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. DATATABLE MODULE */}
        {activeModule === "datatable" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Enterprise CRM Data Table</h2>
                <p className="text-xs text-gray-400">DataInsightAgent telemetry and database records.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1017] overflow-hidden">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-black/60 text-indigo-400 font-bold border-b border-white/[0.08]">
                  <tr><th className="p-4">ID</th><th className="p-4">Directive Node</th><th className="p-4">Type</th><th className="p-4">Status</th><th className="p-4">Latency</th><th className="p-4">Value</th></tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-mono font-bold text-white">{r.id}</td>
                      <td className="p-4 text-white font-medium">{r.name}</td>
                      <td className="p-4 text-indigo-400">{r.type}</td>
                      <td className="p-4 font-bold text-emerald-400">{r.status}</td>
                      <td className="p-4 font-mono">{r.latency}</td>
                      <td className="p-4 font-bold text-white">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. WORKSPACE IDE MODULE */}
        {activeModule === "workspace" && (
          <div className="space-y-4 font-mono animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2"><Code className="w-4 h-4 text-indigo-400" /> Embedded Code IDE Workspace</h2>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5"><Play className="w-3.5 h-3.5 fill-current" /> Run Code</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[420px]">
              <aside className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-3"><FolderTree className="w-4 h-4" /> Explorer</p>
                {["App.tsx", "StudioWorkspace.tsx", "AgentOrchestrator.tsx", "config.json"].map((f) => (
                  <button key={f} onClick={() => setActiveFile(f)} className={"w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all " + (activeFile === f ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/40" : "text-gray-400 hover:text-white")}>
                    {f}
                  </button>
                ))}
              </aside>
              <main className="md:col-span-3 p-4 rounded-2xl bg-black/80 border border-white/[0.08] overflow-auto">
                <p className="text-xs text-gray-500 mb-3">// File: {activeFile}</p>
                <pre className="text-xs text-emerald-400 font-mono leading-relaxed">
                  export default function MasterPipeline() &#123; return orchestrator.execute(); &#125;
                </pre>
              </main>
            </div>
          </div>
        )}

        {/* 7. CHAT COPILOT MODULE */}
        {activeModule === "chat" && (
          <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">AI Copilot & Assistant Portal</h2>
                <p className="text-xs text-gray-400">Autonomous LLM reasoning assistant.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] min-h-[320px] space-y-3">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={"p-3.5 rounded-xl text-xs max-w-lg " + (m.role === "user" ? "bg-indigo-600 text-white ml-auto" : "bg-black/60 border border-white/[0.08] text-gray-200")}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI Copilot to modify directive..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#0d1017] border border-white/[0.08] text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => {
                  if (chatInput) {
                    setChatMessages([...chatMessages, { role: "user", text: chatInput }, { role: "assistant", text: "Directive updated! Agent graph is processing your intent." }]);
                    setChatInput("");
                  }
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        )}

        {/* 8. MEDIA STREAMING MODULE */}
        {activeModule === "streaming" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="text-lg font-bold text-white">WebRTC Media Streaming Studio</h2>
              <p className="text-xs text-gray-400">AI-enhanced streaming studio powered by MediaSyncAgent.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-80 rounded-3xl bg-black border border-white/[0.08] flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80" alt="stream" className="w-full h-full object-cover opacity-60" />
                  <button className="absolute p-4 rounded-full bg-indigo-600 text-white shadow-2xl hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-white">${projectName} Live Broadcast Stage</h3>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase">Stream Telemetry</h4>
                <p className="text-xs text-gray-400">Resolution: 4K 60FPS Lossless</p>
                <p className="text-xs text-gray-400">AI Captions: Active (Sub-10ms)</p>
              </div>
            </div>
          </div>
        )}

        {/* 9. DASHBOARD METRICS MODULE */}
        {activeModule === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="text-lg font-bold text-white">Executive Operations Telemetry Dashboard</h2>
              <p className="text-xs text-gray-400">Real-time throughput metrics and agent health.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {config.metrics.map((m: any) => (
                <div key={m.label} className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-2">
                  <span className="text-xs text-gray-400">{m.label}</span>
                  <p className="text-2xl font-bold text-white">{m.value}</p>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{m.change}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}`;
  }

  private generateWorkspaceContent(layout: string, config: any, cardsJson: string): string {
    return `import React, { useState } from "react";
import { Zap, Play, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const nodes = ${cardsJson};

  return (
    <div className="space-y-6 font-sans text-gray-100 bg-[#0a0d14] p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#101424] to-purple-950/80 border border-indigo-500/40 relative overflow-hidden">
        <h2 className="text-xl font-extrabold text-white tracking-wide">${config.workspaceTitle}</h2>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed mb-6">${config.workspaceSubtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-indigo-500/40 text-sm text-white focus:outline-none"
          />
          <button onClick={onTrigger} disabled={isExecuting} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2">
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>EXECUTE DIRECTIVE</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node: any) => (
          <div key={node.id} className="p-4 rounded-2xl bg-[#0d111a] border border-white/[0.08] space-y-3">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{node.badge}</span>
            <h4 className="text-sm font-bold text-white">{node.title}</h4>
            <p className="text-xs text-gray-400 line-clamp-2">{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`;
  }

  private generateOrchestratorContent(): string {
    return `import React from "react";
export default function AgentOrchestrator() {
  return (
    <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-4">
      <h3 className="text-base font-bold text-white">Multi-Agent Visual Topology</h3>
      <p className="text-xs text-gray-400">Autonomous reasoning topology graph active.</p>
    </div>
  );
}`;
  }

  private generateAnalyticsContent(metricsJson: string): string {
    return `import React from "react";
export default function AnalyticsDashboard() {
  const metrics = ${metricsJson};
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m: any) => (
          <div key={m.label} className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-2">
            <span className="text-xs text-gray-400">{m.label}</span>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`;
  }

  private generateStylesContent(): string {
    return `body {
  margin: 0;
  padding: 0;
  background-color: #07090e;
  color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}`;
  }

  private generateReadme(bp: HackathonBlueprint): string {
    return "# " + bp.projectName + "\n> " + bp.tagline + "\n\n## Overview\n" + bp.proposedSolution;
  }

  private generateEnvExample(bp: HackathonBlueprint): string {
    return "GROQ_API_KEY=your_groq_api_key\nNEXT_PUBLIC_APP_URL=http://localhost:3000\n";
  }

  private generateGitignore(): string {
    return "node_modules\n.next\nout\n.env\n.env.local\n";
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
