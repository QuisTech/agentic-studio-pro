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
    const projectName = (blueprint.projectName || "Agentic Studio").replace(/"/g, '\"');
    const tagline = (blueprint.tagline || "Autonomous Multi-Agent Enterprise Command Center").replace(/"/g, '\"');
    const agents = blueprint.agentArchitecture && blueprint.agentArchitecture.length > 0
      ? blueprint.agentArchitecture
      : [
          { name: "ExecutiveAgent", role: "Orchestrates multi-agent task graphs and executive telemetry", inputs: "Domain Directives", outputs: "Production Specs" },
          { name: "SynthesisEngine", role: "Executes deep domain synthesis & neural workflows", inputs: "Task Directives", outputs: "Generated Assets" },
          { name: "OptimizationAgent", role: "Monitors economics, token throughput & efficiency", inputs: "Execution Graph", outputs: "Performance Metrics" },
          { name: "QualityAuditor", role: "Performs continuous compliance & quality assurance", inputs: "Pipeline Outputs", outputs: "Verified Master" }
        ];

    const cleanDomainName = projectName;
    const problem = (blueprint.problemStatement || "").replace(/"/g, '\"');
    const solution = (blueprint.proposedSolution || "").replace(/"/g, '\"');
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
      } else if (domainText.includes("code") || domainText.includes("editor") || domainText.includes("ide") || domainText.includes("workspace") || domainText.includes("dev") || domainText.includes("terminal") || domainText.includes("git")) {
        layoutType = "workspace";
      } else if (domainText.includes("chat") || domainText.includes("assistant") || domainText.includes("bot") || domainText.includes("message") || domainText.includes("conversation")) {
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
import { Sparkles, ArrowRight, CheckCircle2, Star, ShieldCheck, Zap, Layers, ChevronRight, Play, Globe, HelpCircle, ChevronDown, Check } from "lucide-react";
import StudioWorkspace from "./components/StudioWorkspace";

export default function App() {
  const [activeDemo, setActiveDemo] = useState(false);
  const [pricingCycle, setPricingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "How does ${projectName} handle multi-agent orchestration?", a: "Our platform uses neural directive decomposition to automatically break down high-level user goals into parallel micro-agent execution graphs." },
    { q: "Can I integrate custom APIs into the execution pipeline?", a: "Yes! ${projectName} supports custom REST, GraphQL, Web3 RPC, and WebSocket protocol adapters." },
    { q: "What is the expected latency for live streaming tokens?", a: "Sub-second streaming token response with average latency under 14ms across our global edge node network." }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-center text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>PRODUCTION LAUNCH: ${projectName} Enterprise v4.2 is live!</span>
      </div>

      <nav className="border-b border-white/[0.08] bg-[#0b0e14]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
            <p className="text-[10px] text-indigo-400 font-mono">GLOBAL EDGE ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveDemo(!activeDemo)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border border-white/[0.1] transition-all cursor-pointer">
            {activeDemo ? "Hide Playground" : "Live Playground"}
          </button>
          <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white shadow-xl cursor-pointer">
            Get Started Free
          </button>
        </div>
      </nav>

      <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
          The World-Class AI Engine for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">${projectName}</span>
        </h1>
        <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">${tagline}</p>
        {activeDemo && (
          <div className="mt-12 text-left animate-fadeIn">
            <StudioWorkspace onTrigger={() => {}} isExecuting={false} />
          </div>
        )}
      </section>
    </div>
  );
}`;
    }

    if (layoutType === "storefront") {
      return `import React, { useState } from "react";
import { ShoppingBag, Search, Filter, Star, ShoppingCart, Sparkles, X } from "lucide-react";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState([
    { id: 1, title: "Neural Pro Headset X1", price: "$299.00", qty: 1 }
  ]);

  const products = [
    { id: 1, title: "Neural Pro Headset X1", price: "$299.00", rating: "4.9", category: "Hardware", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Autonomous Studio Keyboard", price: "$189.00", rating: "4.8", category: "Hardware", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#09080c] text-amber-100 font-sans">
      <header className="border-b border-amber-900/40 bg-[#120b18]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-base font-bold text-white tracking-tight">${projectName} • Storefront</h1>
        <button onClick={() => setCartOpen(true)} className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> Cart ({cartItems.length})
        </button>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="p-4 rounded-2xl bg-[#140b1e] border border-amber-900/40 space-y-3">
            <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded-xl" />
            <h3 className="text-sm font-bold text-white">{p.title}</h3>
            <p className="text-amber-300 font-bold">{p.price}</p>
          </div>
        ))}
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
    { id: 1, title: "Initialize Neural Graph", col: "backlog", assignee: "Alex" },
    { id: 2, title: "Synthesize Directives", col: "progress", assignee: "Sarah" },
    { id: 3, title: "Zero-Trust Audit", col: "review", assignee: "David" },
    { id: 4, title: "Deploy Global Edge", col: "done", assignee: "Elena" }
  ]);

  return (
    <div className="min-h-screen bg-[#080910] text-purple-100 font-sans">
      <header className="border-b border-purple-900/40 bg-[#101222]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-base font-bold text-white tracking-tight">${projectName} • Task Kanban</h1>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {["backlog", "progress", "review", "done"].map(c => (
          <div key={c} className="p-4 rounded-2xl bg-[#0f1126] border border-purple-900/40 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase">{c}</h3>
            {tasks.filter(t => t.col === c).map(t => (
              <div key={t.id} className="p-3 rounded-xl bg-black/60 border border-purple-900/30">
                <p className="text-xs font-bold text-white">{t.title}</p>
                <p className="text-[10px] text-purple-400 mt-1">Assignee: {t.assignee}</p>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}`;
    }

    if (layoutType === "feed") {
      return `import React, { useState } from "react";
import { MessageSquare, Heart, Share2, Sparkles } from "lucide-react";

export default function App() {
  const [posts] = useState([
    { id: 1, author: "Agentic Pro", text: "Autonomous multi-agent synthesis running live!", likes: 142, comments: 28 },
    { id: 2, author: "Tech Arch", text: "Generative web app layouts deployed instantly.", likes: 89, comments: 14 }
  ]);

  return (
    <div className="min-h-screen bg-[#07090e] text-cyan-100 font-sans">
      <header className="border-b border-cyan-900/40 bg-[#0c121e]/90 backdrop-blur-xl px-6 py-4 sticky top-0 z-40">
        <h1 className="text-base font-bold text-white">${projectName} • Community Feed</h1>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {posts.map(p => (
          <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a] border border-cyan-900/40 space-y-3">
            <h4 className="font-bold text-white text-xs">{p.author}</h4>
            <p className="text-xs text-gray-300">{p.text}</p>
            <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-cyan-900/30">
              <span>❤️ {p.likes}</span>
              <span>💬 {p.comments}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}`;
    }

    if (layoutType === "datatable") {
      return `import React, { useState } from "react";
import { Database, Search, Download, Plus } from "lucide-react";

export default function App() {
  const [records] = useState([
    { id: "REC-101", name: "Telemetry Node X", category: "Directives", status: "ACTIVE", value: "$14,200" },
    { id: "REC-102", name: "Audit Compliance Log", category: "Security", status: "COMPLETED", value: "$8,500" }
  ]);

  return (
    <div className="min-h-screen bg-[#07090e] text-emerald-100 font-sans">
      <header className="border-b border-emerald-900/40 bg-[#0c1410]/90 backdrop-blur-xl px-6 py-4 sticky top-0 z-40">
        <h1 className="text-base font-bold text-white">${projectName} • Enterprise Data Table</h1>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        <div className="rounded-2xl border border-emerald-900/40 bg-[#0e1713] overflow-hidden">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/60 text-emerald-400 font-bold border-b border-emerald-900/40">
              <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4">Value</th></tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30">
              {records.map(r => (
                <tr key={r.id}>
                  <td className="p-4 font-mono font-bold text-white">{r.id}</td>
                  <td className="p-4 text-white">{r.name}</td>
                  <td className="p-4 text-emerald-400">{r.category}</td>
                  <td className="p-4 font-bold text-emerald-300">{r.status}</td>
                  <td className="p-4 text-white font-bold">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}`;
    }

    if (layoutType === "workspace") {
      return `import React, { useState } from "react";
import { Terminal, FileCode, Play, FolderTree, Cpu } from "lucide-react";

export default function App() {
  const [activeFile, setActiveFile] = useState("App.tsx");

  return (
    <div className="min-h-screen bg-[#050811] text-cyan-100 font-mono flex flex-col">
      <header className="border-b border-cyan-900/40 bg-[#0a0f1d] px-6 py-3 flex items-center justify-between">
        <h1 className="text-sm font-bold text-white tracking-tight">${projectName} • IDE Workspace</h1>
        <button className="px-4 py-1.5 bg-cyan-600 text-black font-bold text-xs rounded-lg flex items-center gap-2"><Play className="w-3.5 h-3.5 fill-current" /> Run Pipeline</button>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4">
        <aside className="border-r border-cyan-900/40 p-4 space-y-3 bg-[#080d19]">
          <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2"><FolderTree className="w-4 h-4" /> Explorer</h4>
          {["App.tsx", "StudioWorkspace.tsx", "config.json"].map(f => (
            <button key={f} onClick={() => setActiveFile(f)} className={"w-full text-left px-3 py-1.5 rounded text-xs " + (activeFile === f ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-gray-400 hover:text-white")}>{f}</button>
          ))}
        </aside>
        <main className="md:col-span-3 p-6 bg-[#04060d]">
          <h3 className="text-xs text-gray-500 mb-4">// Viewing {activeFile}</h3>
          <pre className="text-xs text-emerald-400 font-mono bg-black/60 p-4 rounded-xl border border-cyan-900/40 overflow-x-auto">export default function App() &#123; return &lt;StudioWorkspace /&gt;; &#125;</pre>
        </main>
      </div>
    </div>
  );
}`;
    }

    if (layoutType === "chat") {
      return `import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I am your autonomous AI copilot for ${projectName}. How can I assist your directive graph today?" }
  ]);
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-[#090a10] text-purple-100 font-sans flex flex-col">
      <header className="border-b border-purple-900/40 bg-[#101222]/90 px-6 py-4 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-base font-bold text-white tracking-tight">${projectName} • AI Conversation Portal</h1>
        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5"><Bot className="w-4 h-4" /> Copilot Active</span>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={"flex gap-3 text-xs p-4 rounded-2xl border " + (m.role === "user" ? "bg-purple-950/40 border-purple-500/40 ml-12" : "bg-black/60 border-purple-900/30 mr-12")}>
            <span className="font-bold text-purple-300 uppercase">{m.role}:</span>
            <p className="text-gray-200">{m.text}</p>
          </div>
        ))}
      </main>
      <div className="p-6 border-t border-purple-900/40 bg-[#101222]/90 max-w-4xl mx-auto w-full flex gap-3">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message or directive..." className="flex-1 bg-black/60 border border-purple-900/40 p-3 rounded-xl text-xs text-white focus:outline-none" />
        <button onClick={() => { if(input) { setMessages([...messages, { role: "user", text: input }, { role: "assistant", text: "Directive received! Autonomous agent graph is executing..." }]); setInput(""); } }} className="px-5 py-3 bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center gap-2"><Send className="w-4 h-4" /> Send</button>
      </div>
    </div>
  );
}`;
    }

    if (layoutType === "streaming") {
      return `import React, { useState } from "react";
import { Play, ThumbsUp, Share2, Volume2, Film } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#08070c] text-red-100 font-sans">
      <header className="border-b border-red-900/40 bg-[#140b15]/90 px-6 py-4 sticky top-0 z-40">
        <h1 className="text-base font-bold text-white tracking-tight">${projectName} • Media Stream Stage</h1>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-96 rounded-3xl overflow-hidden relative border border-red-900/40 bg-black flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80" alt="Stream" className="w-full h-full object-cover opacity-60" />
            <button className="absolute p-5 rounded-full bg-red-600 text-white shadow-2xl hover:scale-110 transition-transform"><Play className="w-8 h-8 fill-current" /></button>
          </div>
          <h2 className="text-lg font-bold text-white">${tagline}</h2>
        </div>
        <aside className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase">Up Next</h3>
          <div className="p-3 rounded-xl bg-[#140b15] border border-red-900/30 flex gap-3">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80" alt="thumb" className="w-20 h-14 object-cover rounded-lg" />
            <div>
              <p className="text-xs font-bold text-white">Neural Agent Stream</p>
              <p className="text-[10px] text-gray-400">12k views</p>
            </div>
          </div>
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
