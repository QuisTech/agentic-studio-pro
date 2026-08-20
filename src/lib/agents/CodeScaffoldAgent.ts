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
    const projectName = (blueprint.projectName || "Agentic Studio").replace(/"/g, '\\"');
    const tagline = (blueprint.tagline || "Autonomous Multi-Agent Enterprise Command Center").replace(/"/g, '\\"');
    const agents = blueprint.agentArchitecture && blueprint.agentArchitecture.length > 0
      ? blueprint.agentArchitecture
      : [
          { name: "ExecutiveAgent", role: "Orchestrates multi-agent task graphs", inputs: "Directives", outputs: "Specs" },
          { name: "SynthesisEngine", role: "Executes deep domain synthesis", inputs: "Directives", outputs: "Assets" }
        ];

    const cleanDomainName = projectName;
    const problem = (blueprint.problemStatement || "").replace(/"/g, '\\"');
    const solution = (blueprint.proposedSolution || "").replace(/"/g, '\\"');
    const domainText = (blueprint.projectName + " " + blueprint.tagline + " " + blueprint.problemStatement + " " + blueprint.proposedSolution).toLowerCase();

    let layoutType: "landing" | "storefront" | "kanban" | "feed" | "datatable" | "workspace" | "chat" | "streaming" | "dashboard" | "bento" | "cyber" | "clinical" | "studio" | "ecommerce" | "media" | "culinary" | "realestate" | "edutech" | "eventmason" = blueprint.layoutType as any;

    if (!layoutType) {
      if (domainText.includes("land") || domainText.includes("hero") || domainText.includes("marketing") || domainText.includes("showcase") || domainText.includes("promo") || domainText.includes("startup") || domainText.includes("agency") || domainText.includes("pitch")) {
        layoutType = "landing";
      } else if (domainText.includes("shop") || domainText.includes("store") || domainText.includes("cart") || domainText.includes("ecommerce") || domainText.includes("retail") || domainText.includes("buy") || domainText.includes("checkout") || domainText.includes("product") || domainText.includes("apparel")) {
        layoutType = "storefront";
      } else if (domainText.includes("kanban") || domainText.includes("task") || domainText.includes("board") || domainText.includes("project") || domainText.includes("trello") || domainText.includes("jira") || domainText.includes("event") || domainText.includes("mason") || domainText.includes("party") || domainText.includes("venue") || domainText.includes("book") || domainText.includes("planner")) {
        layoutType = "kanban";
      } else if (domainText.includes("social") || domainText.includes("feed") || domainText.includes("community") || domainText.includes("post") || domainText.includes("network") || domainText.includes("forum") || domainText.includes("tweet") || domainText.includes("follower")) {
        layoutType = "feed";
      } else if (domainText.includes("table") || domainText.includes("grid") || domainText.includes("crm") || domainText.includes("database") || domainText.includes("row") || domainText.includes("admin") || domainText.includes("record")) {
        layoutType = "datatable";
      } else if (domainText.includes("code") || domainText.includes("editor") || domainText.includes("ide") || domainText.includes("workspace") || domainText.includes("terminal") || domainText.includes("git")) {
        layoutType = "workspace";
      } else if (domainText.includes("chat") || domainText.includes("message") || domainText.includes("assistant") || domainText.includes("bot") || domainText.includes("conversation")) {
        layoutType = "chat";
      } else if (domainText.includes("video") || domainText.includes("stream") || domainText.includes("audio") || domainText.includes("music") || domainText.includes("media") || domainText.includes("podcast") || domainText.includes("youtube")) {
        layoutType = "streaming";
      } else {
        const archetypePool: Array<"landing" | "storefront" | "kanban" | "feed" | "datatable" | "workspace" | "chat" | "streaming" | "dashboard"> = [
          "landing", "storefront", "kanban", "feed", "datatable", "workspace", "chat", "streaming", "dashboard"
        ];
        let hash = 0;
        for (let i = 0; i < domainText.length; i++) {
          hash = (hash * 31 + domainText.charCodeAt(i)) & 0x7fffffff;
        }
        layoutType = archetypePool[hash % archetypePool.length];
      }
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
    if (layoutType === "landing") {
      return `import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Play, CheckCircle2, Star } from "lucide-react";
import StudioWorkspace from "./components/StudioWorkspace";

export default function App() {
  const [activeDemo, setActiveDemo] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>Next-Gen Autonomous Multi-Agent Platform is Live!</span>
      </div>
      <nav className="border-b border-white/[0.08] bg-[#0b0e14]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
            <p className="text-[10px] text-gray-400 font-mono">ENTERPRISE LANDING PLATFORM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveDemo(!activeDemo)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border border-white/[0.1] transition-all">
            {activeDemo ? "Close Playground" : "Interactive Demo"}
          </button>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all">
            Get Started Free
          </button>
        </div>
      </nav>
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>${tagline}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          The Intelligent Operating System for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">${projectName}</span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Streamline directives, automate complex multi-agent reasoning, and execute production workflows in sub-second latency.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer">
            <span>Launch Production Directive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveDemo(true)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 font-bold text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all">
            <Play className="w-4 h-4 fill-current text-indigo-400" />
            <span>Watch Live Demonstration</span>
          </button>
        </div>
        {activeDemo && (
          <div className="mt-12 text-left animate-fadeIn">
            <StudioWorkspace onTrigger={() => {}} isExecuting={false} />
          </div>
        )}
      </section>
      <footer className="border-t border-white/[0.08] bg-[#090c12] py-12 px-6 text-center text-xs text-gray-500">
        <p>© 2026 ${projectName}. All rights reserved. Powered by Autonomous Multi-Agent Engine.</p>
      </footer>
    </div>
  );
}`;
    }

    if (layoutType === "storefront") {
      return `import React, { useState } from "react";
import { ShoppingBag, Search, Filter, Star, ShoppingCart, Heart, CheckCircle2, ChevronRight, Sparkles, X } from "lucide-react";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [category, setCategory] = useState("All");

  const products = [
    { id: 1, title: "Neural Pro Headset X1", price: "$299.00", rating: "4.9", category: "Hardware", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Autonomous Studio Keyboard", price: "$189.00", rating: "4.8", category: "Hardware", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Quantum Telemetry Monitor", price: "$499.00", rating: "5.0", category: "Displays", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#09080c] text-amber-100 font-sans">
      <div className="bg-amber-600 text-black font-bold text-xs px-4 py-2 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>SPECIAL OFFER: Free Worldwide Express Shipping on all ${projectName} Orders!</span>
      </div>
      <header className="border-b border-amber-900/40 bg-[#120b18]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-amber-500/25">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
            <p className="text-[10px] text-amber-400 font-mono">STOREFRONT & MARKETPLACE</p>
          </div>
        </div>
        <button onClick={() => setCartOpen(true)} className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 hover:bg-amber-500/30 transition-all relative">
          <ShoppingCart className="w-4 h-4" />
          <span>Cart ({cartCount})</span>
        </button>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#140b1e] border border-amber-900/40 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" /> Filter Catalog
            </h3>
          </div>
        </aside>
        <section className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-4 rounded-2xl bg-[#140b1e] border border-amber-900/40 space-y-3">
                <img src={product.image} alt={product.title} className="w-full h-44 object-cover rounded-xl" />
                <h3 className="text-sm font-bold text-white">{product.title}</h3>
                <p className="text-amber-300 font-bold">{product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}`;
    }

    if (layoutType === "kanban") {
      return `import React, { useState } from "react";
import { Layers, Plus, User, CheckCircle2 } from "lucide-react";

export default function App() {
  const [tasks] = useState([
    { id: 1, title: "Initialize Multi-Agent Graph", col: "backlog", priority: "HIGH", tag: "AI Engine", assignee: "Alex" },
    { id: 2, title: "Synthesize Domain Directives", col: "progress", priority: "URGENT", tag: "Synthesis", assignee: "Sarah" },
    { id: 3, title: "Execute Zero-Trust Audit", col: "review", priority: "MEDIUM", tag: "Security", assignee: "David" },
    { id: 4, title: "Deploy Global Edge Pipeline", col: "done", priority: "COMPLETED", tag: "DevOps", assignee: "Elena" }
  ]);

  return (
    <div className="min-h-screen bg-[#080910] text-purple-100 font-sans">
      <header className="border-b border-purple-900/40 bg-[#101222]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
            <p className="text-[10px] text-purple-400 font-mono">INTERACTIVE KANBAN TASK BOARD</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {["backlog", "progress", "review", "done"].map((column) => (
          <div key={column} className="p-4 rounded-2xl bg-[#0f1126] border border-purple-900/40 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">{column}</h3>
            <div className="space-y-3">
              {tasks.filter(t => t.col === column).map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-black/60 border border-purple-900/30 space-y-2">
                  <h4 className="text-sm font-bold text-white">{task.title}</h4>
                  <p className="text-xs text-gray-400">Assignee: {task.assignee}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}`;
    }
    if (layoutType === "feed") {
      return `import React, { useState } from "react";
import { MessageSquare, Heart, Share2, Send, Sparkles, User, Image, Hash } from "lucide-react";

export default function App() {
  const [posts, setPosts] = useState([
    { id: 1, author: "Agentic AI", handle: "@agentic_ai", text: "Successfully deployed multi-agent reasoning cluster on global edge network!", likes: 142, comments: 28, time: "10m ago" },
    { id: 2, author: "Tech Pulse", handle: "@techpulse", text: "Autonomous studio platforms are rewriting web app architecture in real time.", likes: 89, comments: 12, time: "1h ago" }
  ]);

  return (
    <div className="min-h-screen bg-[#07090e] text-cyan-100 font-sans">
      <header className="border-b border-cyan-900/40 bg-[#0c121e]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-base font-bold text-white tracking-tight">${projectName} • Social Feed</h1>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-cyan-900/40 space-y-3">
            <textarea placeholder="What is happening in your autonomous graph?" className="w-full bg-black/60 border border-cyan-900/40 p-3 rounded-xl text-xs text-white focus:outline-none" rows={3}></textarea>
            <div className="flex justify-between items-center">
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-bold text-xs">Post Update</button>
            </div>
          </div>
          <div className="space-y-4">
            {posts.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-[#0f172a] border border-cyan-900/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{p.author} <span className="text-cyan-400">{p.handle}</span></span>
                  <span className="text-gray-500">{p.time}</span>
                </div>
                <p className="text-xs text-gray-200">{p.text}</p>
                <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-cyan-900/30">
                  <span>❤️ {p.likes}</span>
                  <span>💬 {p.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="p-4 rounded-2xl bg-[#0f172a] border border-cyan-900/40 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase">Trending Topics</h3>
          <p className="text-xs text-cyan-400">#AutonomousAgents</p>
          <p className="text-xs text-cyan-400">#MultiAgentSynthesis</p>
        </aside>
      </main>
    </div>
  );
}`;
    }
    return `import React, { useState } from "react";
import { Zap, Cpu, Layers, Terminal, BarChart3 } from "lucide-react";
import StudioWorkspace from "./components/StudioWorkspace";

export default function App() {
  const [isExecuting, setIsExecuting] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans">
      <header className="border-b border-white/[0.08] bg-[#0b0e14]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
            <p className="text-xs text-gray-400 font-medium">${tagline}</p>
          </div>
        </div>
      </header>
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <StudioWorkspace onTrigger={() => setIsExecuting(!isExecuting)} isExecuting={isExecuting} />
      </div>
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
