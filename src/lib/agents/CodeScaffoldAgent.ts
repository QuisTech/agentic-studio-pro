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
    
    let layoutType: "bento" | "cyber" | "dashboard" | "clinical" | "studio" | "ecommerce" | "media" | "culinary" | "realestate" | "edutech" = blueprint.layoutType || "bento";

    if (!blueprint.layoutType) {
      if (domainText.includes("crypto") || domainText.includes("web3") || domainText.includes("solidity") || domainText.includes("security") || domainText.includes("cyber") || domainText.includes("blockchain") || domainText.includes("hack") || domainText.includes("bot")) {
        layoutType = "cyber";
      } else if (domainText.includes("health") || domainText.includes("med") || domainText.includes("clinic") || domainText.includes("doctor") || domainText.includes("patient") || domainText.includes("pharma") || domainText.includes("care") || domainText.includes("dna") || domainText.includes("bio") || domainText.includes("hospital")) {
        layoutType = "clinical";
      } else if (domainText.includes("finance") || domainText.includes("bank") || domainText.includes("legal") || domainText.includes("enterprise") || domainText.includes("tax") || domainText.includes("invest") || domainText.includes("money") || domainText.includes("accounting") || domainText.includes("saas") || domainText.includes("analytics")) {
        layoutType = "dashboard";
      } else if (domainText.includes("rust") || domainText.includes("go") || domainText.includes("python") || domainText.includes("developer") || domainText.includes("cli") || domainText.includes("tool") || domainText.includes("fastapi") || domainText.includes("git") || domainText.includes("code") || domainText.includes("api") || domainText.includes("sdk") || domainText.includes("terminal")) {
        layoutType = "studio";
      } else if (domainText.includes("shop") || domainText.includes("cart") || domainText.includes("store") || domainText.includes("ecommerce") || domainText.includes("retail") || domainText.includes("order") || domainText.includes("product") || domainText.includes("buy") || domainText.includes("market") || domainText.includes("checkout")) {
        layoutType = "ecommerce";
      } else if (domainText.includes("video") || domainText.includes("audio") || domainText.includes("music") || domainText.includes("media") || domainText.includes("podcast") || domainText.includes("stream") || domainText.includes("creative") || domainText.includes("film") || domainText.includes("sound") || domainText.includes("movie") || domainText.includes("song")) {
        layoutType = "media";
      } else if (domainText.includes("coffee") || domainText.includes("restaurant") || domainText.includes("cafe") || domainText.includes("food") || domainText.includes("barista") || domainText.includes("dining") || domainText.includes("kitchen") || domainText.includes("recipe") || domainText.includes("cook") || domainText.includes("meal") || domainText.includes("dish") || domainText.includes("drink") || domainText.includes("menu")) {
        layoutType = "culinary";
      } else if (domainText.includes("house") || domainText.includes("estate") || domainText.includes("realty") || domainText.includes("property") || domainText.includes("rent") || domainText.includes("home") || domainText.includes("arch") || domainText.includes("apartment") || domainText.includes("building") || domainText.includes("land")) {
        layoutType = "realestate";
      } else if (domainText.includes("learn") || domainText.includes("tutor") || domainText.includes("edu") || domainText.includes("school") || domainText.includes("course") || domainText.includes("study") || domainText.includes("student") || domainText.includes("quiz") || domainText.includes("class") || domainText.includes("exam") || domainText.includes("flashcard") || domainText.includes("teacher")) {
        layoutType = "edutech";
      } else {
        layoutType = "bento";
      }
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
      : layoutType === "media"
      ? [
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
        ]
      : layoutType === "realestate"
      ? [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
        ]
      : layoutType === "edutech"
      ? [
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
        ]
      : layoutType === "cyber"
      ? [
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
        ]
      : layoutType === "studio"
      ? [
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"
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
    const shellConfig: Record<string, any> = {
      cyber: {
        bg: "bg-[#03060d] text-cyan-100 selection:bg-cyan-500 selection:text-black font-mono",
        badgeText: "CYBER PROTOCOL v3.4",
        badgeClass: "bg-cyan-950/80 text-cyan-400 border-cyan-500/40",
        headerIcon: "Shield",
        headerIconBg: "from-cyan-600 via-blue-600 to-purple-600 shadow-cyan-500/25",
        headerBg: "bg-[#060c1c]/90 border-cyan-900/50",
        asideBg: "bg-[#050914] border-cyan-900/50",
        moduleHeader: "[ MATRIX MODULES ]",
        tab1: "Matrix Console",
        tab1Icon: "Shield",
        tab2: "Sentinel Mesh",
        tab2Icon: "Cpu",
        tab3: "Signal Telemetry",
        tab3Icon: "Activity",
        tab4: "Audit Log Stream",
        tab4Icon: "Terminal",
        activeTab: "bg-cyan-950/90 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20",
        buttonGradient: "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/25",
        widgetTitle: "CYBER MATRIX PIPELINE",
        widgetSubtext: "Standing by for encrypted matrix directive execution...",
        cardWidgetTitle: "ZK-Audit Sentinel",
        cardWidgetSubtext: "Quantum-resistant zero-knowledge verification active."
      },
      clinical: {
        bg: "bg-[#02120e] text-emerald-100 selection:bg-emerald-500 selection:text-black font-sans",
        badgeText: "ICU CLINICAL OS",
        badgeClass: "bg-emerald-950/80 text-emerald-400 border-emerald-500/40",
        headerIcon: "Stethoscope",
        headerIconBg: "from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-500/25",
        headerBg: "bg-[#05241e]/90 border-emerald-900/50",
        asideBg: "bg-[#041a15] border-emerald-900/50",
        moduleHeader: "CLINICAL TRIAGE MODULES",
        tab1: "Patient Diagnostics",
        tab1Icon: "Stethoscope",
        tab2: "Biomarker Agents",
        tab2Icon: "Activity",
        tab3: "ICU Telemetry",
        tab3Icon: "Heart",
        tab4: "HIPAA Audit Log",
        tab4Icon: "Terminal",
        activeTab: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20",
        buttonGradient: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30",
        widgetTitle: "Bedside Triage Stream",
        widgetSubtext: "Continuous patient monitoring & telemetry active.",
        cardWidgetTitle: "HIPAA Compliance Verified",
        cardWidgetSubtext: "Encrypted sandboxed medical execution enabled."
      },
      ecommerce: {
        bg: "bg-[#0a0806] text-amber-100 selection:bg-amber-500 selection:text-black font-sans",
        badgeText: "RETAIL COMMAND HUB",
        badgeClass: "bg-amber-950/80 text-amber-400 border-amber-500/40",
        headerIcon: "ShoppingBag",
        headerIconBg: "from-amber-600 via-orange-600 to-rose-600 shadow-amber-500/25",
        headerBg: "bg-[#17110a]/90 border-amber-900/50",
        asideBg: "bg-[#110d08] border-amber-900/50",
        moduleHeader: "RETAIL COMMAND MODULES",
        tab1: "Store Operations",
        tab1Icon: "ShoppingBag",
        tab2: "Fulfillment Fleet",
        tab2Icon: "Truck",
        tab3: "Revenue Telemetry",
        tab3Icon: "BarChart3",
        tab4: "Dispatch Stream",
        tab4Icon: "Terminal",
        activeTab: "bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-amber-500/20",
        buttonGradient: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30",
        widgetTitle: "Dispatch Pipeline",
        widgetSubtext: "Automated merchant order fulfillment active.",
        cardWidgetTitle: "Retail Engine Status",
        cardWidgetSubtext: "Sub-second inventory & margin balancing verified."
      },
      media: {
        bg: "bg-[#0a0512] text-purple-100 selection:bg-pink-500 selection:text-white font-sans",
        badgeText: "RENDER STUDIO PRO",
        badgeClass: "bg-purple-950/80 text-purple-300 border-purple-500/40",
        headerIcon: "Film",
        headerIconBg: "from-purple-600 via-pink-600 to-rose-600 shadow-purple-500/25",
        headerBg: "bg-[#190a2b]/90 border-purple-900/50",
        asideBg: "bg-[#11071e] border-purple-900/50",
        moduleHeader: "STUDIO RENDER MODULES",
        tab1: "Render Canvas",
        tab1Icon: "Film",
        tab2: "Pipeline Engine",
        tab2Icon: "Radio",
        tab3: "DSP Audio Telemetry",
        tab3Icon: "Volume2",
        tab4: "Render Log Stream",
        tab4Icon: "Terminal",
        activeTab: "bg-purple-950/90 text-purple-300 border-purple-500/50 shadow-purple-500/20",
        buttonGradient: "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/30",
        widgetTitle: "Live Media Stream",
        widgetSubtext: "48kHz Lossless DSP audio/video stream ready.",
        cardWidgetTitle: "GPU Acceleration",
        cardWidgetSubtext: "Multi-stream 4K real-time rendering active."
      },
      culinary: {
        bg: "bg-[#0f0804] text-amber-100 selection:bg-orange-500 selection:text-black font-sans",
        badgeText: "KITCHEN PASS OS",
        badgeClass: "bg-orange-950/80 text-orange-400 border-orange-500/40",
        headerIcon: "Utensils",
        headerIconBg: "from-orange-600 via-amber-600 to-yellow-600 shadow-orange-500/25",
        headerBg: "bg-[#211109]/90 border-orange-900/50",
        asideBg: "bg-[#170c07] border-orange-900/50",
        moduleHeader: "KITCHEN PASS MODULES",
        tab1: "Pass Canvas",
        tab1Icon: "Utensils",
        tab2: "Kitchen Fire Line",
        tab2Icon: "Flame",
        tab3: "Barista & Service",
        tab3Icon: "Coffee",
        tab4: "Ticket Log Stream",
        tab4Icon: "Terminal",
        activeTab: "bg-orange-950/90 text-orange-300 border-orange-500/50 shadow-orange-500/20",
        buttonGradient: "from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-600/30",
        widgetTitle: "Kitchen Pass Stream",
        widgetSubtext: "Real-time order ticket fire schedule active.",
        cardWidgetTitle: "Sous-Chef AI Engine",
        cardWidgetSubtext: "Autonomous temperature & plating check verified."
      },
      realestate: {
        bg: "bg-[#050a14] text-sky-100 selection:bg-sky-500 selection:text-black font-sans",
        badgeText: "SPATIAL RADAR v2",
        badgeClass: "bg-sky-950/80 text-sky-300 border-sky-500/40",
        headerIcon: "Building2",
        headerIconBg: "from-sky-600 via-teal-600 to-emerald-600 shadow-sky-500/25",
        headerBg: "bg-[#0f1d3b]/90 border-sky-900/50",
        asideBg: "bg-[#0a1326] border-sky-900/50",
        moduleHeader: "SPATIAL RADAR MODULES",
        tab1: "Property Canvas",
        tab1Icon: "Building2",
        tab2: "3D Spatial Mesh",
        tab2Icon: "Compass",
        tab3: "Valuation Telemetry",
        tab3Icon: "Eye",
        tab4: "Radar Log Stream",
        tab4Icon: "Terminal",
        activeTab: "bg-sky-950/90 text-sky-300 border-sky-500/50 shadow-sky-500/20",
        buttonGradient: "from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 shadow-sky-600/30",
        widgetTitle: "GIS Radar Stream",
        widgetSubtext: "Continuous spatial coordinate radar active.",
        cardWidgetTitle: "Spatial Radar Status",
        cardWidgetSubtext: "Real-time property yield & drone scans verified."
      },
      edutech: {
        bg: "bg-[#060410] text-violet-100 selection:bg-violet-500 selection:text-white font-sans",
        badgeText: "NEURAL ACADEMY OS",
        badgeClass: "bg-violet-950/80 text-violet-300 border-violet-500/40",
        headerIcon: "GraduationCap",
        headerIconBg: "from-violet-600 via-indigo-600 to-purple-600 shadow-violet-500/25",
        headerBg: "bg-[#150f36]/90 border-violet-900/50",
        asideBg: "bg-[#0e0a24] border-violet-900/50",
        moduleHeader: "KNOWLEDGE MODULES",
        tab1: "Knowledge Canvas",
        tab1Icon: "GraduationCap",
        tab2: "Tutor Mesh",
        tab2Icon: "Brain",
        tab3: "Mastery Analytics",
        tab3Icon: "BookOpen",
        tab4: "Synthesis Stream",
        tab4Icon: "Terminal",
        activeTab: "bg-violet-950/90 text-violet-300 border-violet-500/50 shadow-violet-500/20",
        buttonGradient: "from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/30",
        widgetTitle: "Neural Tutor Stream",
        widgetSubtext: "Adaptive student synthesis graph active.",
        cardWidgetTitle: "Mastery Engine Status",
        cardWidgetSubtext: "Self-correcting curriculum graph verified."
      },
      bento: {
        bg: "bg-[#07090e] text-gray-100 selection:bg-indigo-500 selection:text-white font-sans",
        badgeText: "PRO ENTERPRISE",
        badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        headerIcon: "Zap",
        headerIconBg: "from-indigo-600 via-purple-600 to-pink-500 shadow-indigo-500/25",
        headerBg: "bg-[#0b0e14]/80 border-white/[0.08]",
        asideBg: "bg-[#090c12] border-white/[0.08]",
        moduleHeader: "WORKSPACE MODULES",
        tab1: "Live Studio Canvas",
        tab1Icon: "Layers",
        tab2: "Agent Orchestrator",
        tab2Icon: "Cpu",
        tab3: "Telemetry & Analytics",
        tab3Icon: "BarChart3",
        tab4: "Live Agent Log Terminal",
        tab4Icon: "Terminal",
        activeTab: "bg-indigo-600/15 text-indigo-400 border-indigo-500/30 shadow-sm",
        buttonGradient: "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/20",
        widgetTitle: "Active Pipeline",
        widgetSubtext: "Ready for next autonomous run.",
        cardWidgetTitle: "Architecture Verified",
        cardWidgetSubtext: "Autonomous multi-agent synthesis ready."
      }
    };

    const sh = shellConfig[config.layoutType] || shellConfig.bento;
    const agentsJson = JSON.stringify(agents, null, 2);

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
  ArrowRight,
  Shield,
  Stethoscope,
  ShoppingBag,
  Film,
  Utensils,
  Building2,
  GraduationCap,
  Activity,
  Heart,
  Truck,
  Radio,
  Volume2,
  Flame,
  Coffee,
  Compass,
  Eye,
  Brain,
  BookOpen
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
    <div className="${sh.bg}">
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/90 text-white shadow-2xl backdrop-blur-md border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Global Header */}
      <header className="border-b ${sh.headerBg} backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr ${sh.headerIconBg} flex items-center justify-center">
            {config.layoutType === 'cyber' && <Shield className="w-5 h-5 text-white animate-pulse" />}
            {config.layoutType === 'clinical' && <Stethoscope className="w-5 h-5 text-white" />}
            {config.layoutType === 'ecommerce' && <ShoppingBag className="w-5 h-5 text-white" />}
            {config.layoutType === 'media' && <Film className="w-5 h-5 text-white" />}
            {config.layoutType === 'culinary' && <Utensils className="w-5 h-5 text-white" />}
            {config.layoutType === 'realestate' && <Building2 className="w-5 h-5 text-white" />}
            {config.layoutType === 'edutech' && <GraduationCap className="w-5 h-5 text-white" />}
            {['bento', 'dashboard', 'studio'].includes(config.layoutType) && <Zap className="w-5 h-5 text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">${projectName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${sh.badgeClass}">
                ${sh.badgeText}
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r ${sh.buttonGradient} text-white transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
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
        <aside className="w-64 border-r ${sh.asideBg} p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">${sh.moduleHeader}</p>
              
              <button
                onClick={() => setActiveTab("studio")}
                className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all " + (activeTab === "studio" ? "${sh.activeTab}" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]")}
              >
                {config.layoutType === 'cyber' && <Shield className="w-4 h-4" />}
                {config.layoutType === 'clinical' && <Stethoscope className="w-4 h-4" />}
                {config.layoutType === 'ecommerce' && <ShoppingBag className="w-4 h-4" />}
                {config.layoutType === 'media' && <Film className="w-4 h-4" />}
                {config.layoutType === 'culinary' && <Utensils className="w-4 h-4" />}
                {config.layoutType === 'realestate' && <Building2 className="w-4 h-4" />}
                {config.layoutType === 'edutech' && <GraduationCap className="w-4 h-4" />}
                {['bento', 'dashboard', 'studio'].includes(config.layoutType) && <Layers className="w-4 h-4" />}
                <span>${sh.tab1}</span>
              </button>

              <button
                onClick={() => setActiveTab("agents")}
                className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all " + (activeTab === "agents" ? "${sh.activeTab}" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]")}
              >
                {config.layoutType === 'clinical' && <Activity className="w-4 h-4" />}
                {config.layoutType === 'ecommerce' && <Truck className="w-4 h-4" />}
                {config.layoutType === 'media' && <Radio className="w-4 h-4" />}
                {config.layoutType === 'culinary' && <Flame className="w-4 h-4" />}
                {config.layoutType === 'realestate' && <Compass className="w-4 h-4" />}
                {config.layoutType === 'edutech' && <Brain className="w-4 h-4" />}
                {['cyber', 'bento', 'dashboard', 'studio'].includes(config.layoutType) && <Cpu className="w-4 h-4" />}
                <span>${sh.tab2}</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all " + (activeTab === "analytics" ? "${sh.activeTab}" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]")}
              >
                {config.layoutType === 'cyber' && <Activity className="w-4 h-4" />}
                {config.layoutType === 'clinical' && <Heart className="w-4 h-4" />}
                {config.layoutType === 'media' && <Volume2 className="w-4 h-4" />}
                {config.layoutType === 'culinary' && <Coffee className="w-4 h-4" />}
                {config.layoutType === 'realestate' && <Eye className="w-4 h-4" />}
                {config.layoutType === 'edutech' && <BookOpen className="w-4 h-4" />}
                {['ecommerce', 'bento', 'dashboard', 'studio'].includes(config.layoutType) && <BarChart3 className="w-4 h-4" />}
                <span>${sh.tab3}</span>
              </button>

              <button
                onClick={() => setActiveTab("terminal")}
                className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all " + (activeTab === "terminal" ? "${sh.activeTab}" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]")}
              >
                <Terminal className="w-4 h-4" />
                <span>${sh.tab4}</span>
              </button>
            </div>

            {/* Pipeline Stage Quick Status */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-gray-300">${sh.widgetTitle}</span>
                <span className="font-mono text-indigo-400">{executionProgress}%</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <div
                  className={"bg-gradient-to-r ${sh.buttonGradient} h-full rounded-full transition-all duration-500"}
                  style={{ width: executionProgress + "%" }}
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                {isExecuting ? "Executing active micro-agent directives..." : "${sh.widgetSubtext}"}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-gray-300">
            <p className="font-semibold text-white mb-1">${sh.cardWidgetTitle}</p>
            <p className="text-[10px] text-gray-400 leading-normal">
              ${sh.cardWidgetSubtext}
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
              agents={${agentsJson}}
              isExecuting={isExecuting}
              activeAgentIndex={activeAgentIndex}
              logs={logs}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsDashboard metrics={${metricsJson}} />
          )}

          {activeTab === "terminal" && (
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Live Execution Telemetry Logs
                </h3>
                <span className="text-xs text-gray-400 font-mono">Status: Stream Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/80 border border-white/[0.12] space-y-2 max-h-[600px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="text-gray-500 font-mono">[{log.timestamp}]</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {log.level}
                    </span>
                    <span className="text-indigo-300 font-semibold">{log.agent}:</span>
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))}
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
    const workspaceContent = this.generateWorkspaceContent(config, cardsJson, slider2OptionsJson);

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

  private generateWorkspaceContent(config: any, cardsJson: string, slider2OptionsJson: string): string {
    const layout = config.layoutType;

    if (layout === "cyber") {
      return `import React, { useState } from "react";
import { Shield, Cpu, Zap, Activity, Terminal, Play, RefreshCw, Key, Radio } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [riskVar, setRiskVar] = useState(15);
  const [executionMode, setExecutionMode] = useState(${slider2OptionsJson}[0]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const nodes = ${cardsJson};

  return (
    <div className="space-y-6 font-mono text-cyan-100 bg-[#050811] p-5 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-[#0a0f24] to-purple-950/80 border border-cyan-500/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">[ CYBER HUD MATRIX ]</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
              <span>RPC LIVE: 0.18ms</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/50 text-purple-300 flex items-center gap-1.5">
              <Key className="w-3 h-3 text-purple-400" />
              <span>MEV_SHIELDED</span>
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed mb-6 font-sans">
          ${config.workspaceSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-cyan-500/40 text-sm text-cyan-200 placeholder-cyan-700 focus:outline-none focus:border-cyan-400 transition-all font-mono"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            <span>DEPLOY MATRIX DIRECTIVE</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#090d1a] border border-cyan-500/30 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-400 font-bold">${config.slider1Label}</span>
            <span className="text-emerald-400 font-mono">{riskVar}${config.slider1Unit}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={riskVar}
            onChange={(e) => setRiskVar(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
        <div className="p-4 rounded-xl bg-[#090d1a] border border-cyan-500/30 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-400 font-bold">${config.slider2Label}</span>
            <span className="text-purple-400 font-mono">{executionMode}</span>
          </div>
          <div className="flex gap-2">
            {${slider2OptionsJson}.map((res) => (
              <button
                key={res}
                onClick={() => setExecutionMode(res)}
                className={"flex-1 py-1 rounded text-[10px] font-bold border transition-all " + (executionMode === res ? "bg-cyan-500/20 text-cyan-300 border-cyan-400" : "bg-black/40 text-gray-500 border-gray-800 hover:border-gray-700")}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#090d1a] border border-cyan-500/30 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-400 font-bold">Engine Sentinel</span>
            <span className="text-emerald-400">${config.engineName}</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-tight font-sans">
            ${config.engineDesc}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">${config.gridTitle}</h3>
          <span className="text-xs text-cyan-500">{nodes.length} SENTINELS ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(idx)}
              className={"p-5 rounded-2xl border transition-all cursor-pointer " + (selectedNode === idx ? "bg-[#0f172a] border-cyan-400 shadow-xl shadow-cyan-500/20 ring-1 ring-cyan-400" : "bg-[#090d1a] border-cyan-900/60 hover:border-cyan-500/40 hover:bg-[#0c1326]")}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {node.badge}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">{node.status}</span>
              </div>
              <h4 className="text-sm font-bold text-white font-sans mb-2">{node.title}</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2">{node.description}</p>
              <div className="mt-4 pt-3 border-t border-cyan-900/40 flex justify-between items-center text-[10px] text-cyan-500 font-mono">
                <span>LATENCY: {node.latency}</span>
                <span className="text-cyan-400 font-bold">VERIFIED ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "clinical") {
      return `import React, { useState } from "react";
import { Activity, Stethoscope, Heart, Play, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const cases = ${cardsJson};

  return (
    <div className="space-y-6 bg-[#041411] p-5 rounded-3xl border border-emerald-500/30 text-emerald-100 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#08221d] border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Diagnostic Confidence</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">99.4%</span>
            <span className="text-xs font-semibold text-emerald-400">+1.8%</span>
          </div>
          <p className="text-[10px] text-emerald-400/70">Validated clinical dataset</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#08221d] border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Telemetry Latency</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">8ms</span>
            <span className="text-xs font-semibold text-emerald-400">REAL-TIME</span>
          </div>
          <p className="text-[10px] text-emerald-400/70">ICU bedside stream</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#08221d] border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Biomarker Triage</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">4 Nodes</span>
            <span className="text-xs font-semibold text-teal-300">ACTIVE</span>
          </div>
          <p className="text-[10px] text-emerald-400/70">Continuous patient monitoring</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#08221d] border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">HIPAA Status</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">VERIFIED</span>
            <span className="text-xs font-semibold text-emerald-400">PASSED</span>
          </div>
          <p className="text-[10px] text-emerald-400/70">Encrypted sandboxed execution</p>
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#062b25] via-[#09352e] to-[#041a16] border border-emerald-500/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5 w-fit">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>${config.workspaceTitle}</span>
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">${config.workspaceSubtitle}</h2>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            LIVE ICU STREAM
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-[#03110e] border border-emerald-500/40 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400 transition-all font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-current text-rose-400" />}
            <span>Synthesize Clinical Case</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cases.map((c, idx) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(idx)}
              className={"p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden " + (selectedCase === idx ? "bg-[#082923] border-emerald-400 shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-400" : "bg-[#061e1a]/80 border-emerald-900/60 hover:border-emerald-500/40 hover:bg-[#082923]")}
            >
              <div className="relative h-36 -mx-5 -mt-5 mb-4 overflow-hidden">
                <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061e1a] to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold text-emerald-300 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/40">
                  {c.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{c.title}</h4>
              <p className="text-xs text-emerald-200/70 leading-relaxed line-clamp-2">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "ecommerce") {
      return `import React, { useState } from "react";
import { ShoppingBag, Truck, Play, RefreshCw, Zap } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const products = ${cardsJson};

  return (
    <div className="space-y-6 bg-[#0c0a09] p-5 rounded-3xl border border-amber-500/30 text-amber-100 shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c150c] via-[#2a1d0d] to-[#140e08] border border-amber-500/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">[ RETAIL COMMAND HUB ]</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            DISPATCH ACTIVE
          </span>
        </div>
        <p className="text-xs text-amber-200/80 max-w-2xl font-sans leading-relaxed">
          ${config.workspaceSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-[#140f09] border border-amber-500/30 text-sm text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            <span>Optimize Retail Engine</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(idx)}
              className={"group rounded-2xl border transition-all cursor-pointer overflow-hidden " + (selectedItem === idx ? "bg-[#22180d] border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400" : "bg-[#161008] border-amber-900/40 hover:border-amber-500/40 hover:bg-[#1e150b]")}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161008] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40">
                  {item.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] font-mono font-bold text-emerald-400 bg-black/80 px-2 py-0.5 rounded">
                  $149.00
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{item.title}</h4>
                <p className="text-xs text-amber-200/70 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "media") {
      return `import React, { useState } from "react";
import { Film, Radio, Play, RefreshCw, Volume2 } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedStream, setSelectedStream] = useState<number | null>(null);

  const streams = ${cardsJson};

  return (
    <div className="space-y-6 bg-[#0e0716] p-5 rounded-3xl border border-purple-500/30 text-purple-100 shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#200d34] via-[#2c1245] to-[#160826] border border-purple-500/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">[ MEDIA RENDER STUDIO ]</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-ping" />
            LIVE RENDER STREAMS
          </span>
        </div>
        <p className="text-xs text-purple-200/80 max-w-2xl font-sans leading-relaxed">
          ${config.workspaceSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-[#140a21] border border-purple-500/40 text-sm text-purple-100 placeholder-purple-700 focus:outline-none focus:border-purple-400 font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Render Media Stream</span>
          </button>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-[#160c24] border border-purple-500/20 space-y-3">
        <div className="flex items-center justify-between text-xs text-purple-300">
          <span className="flex items-center gap-2 font-bold">
            <Volume2 className="w-4 h-4 text-pink-400" />
            Audio DSP Signal & Frequency Channels
          </span>
          <span className="font-mono text-emerald-400">48kHz / 24-bit Lossless</span>
        </div>
        <div className="h-10 flex items-end gap-1.5 pt-1">
          {[65, 80, 45, 90, 100, 75, 60, 85, 95, 70, 50, 88, 92, 60, 78, 85].map((h, idx) => (
            <div key={idx} className="flex-1 bg-gradient-to-t from-purple-600 via-pink-500 to-cyan-400 rounded-t-sm" style={{ height: h + "%" }} />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {streams.map((stream, idx) => (
            <div
              key={stream.id}
              onClick={() => setSelectedStream(idx)}
              className={"group rounded-2xl border transition-all cursor-pointer overflow-hidden " + (selectedStream === idx ? "bg-[#25123d] border-purple-400 shadow-xl shadow-purple-500/20 ring-1 ring-purple-400" : "bg-[#170b26] border-purple-900/50 hover:border-purple-500/40 hover:bg-[#200e35]")}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={stream.imageUrl} alt={stream.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#170b26] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/90 text-purple-300 border border-purple-500/40">
                  {stream.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-purple-300 bg-black/80 px-2 py-0.5 rounded">
                  {stream.latency}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{stream.title}</h4>
                <p className="text-xs text-purple-200/70 line-clamp-2 leading-relaxed">{stream.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "culinary") {
      return `import React, { useState } from "react";
import { Utensils, Coffee, Flame, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedPass, setSelectedPass] = useState<number | null>(null);

  const passes = ${cardsJson};

  return (
    <div className="space-y-6 bg-[#160c07] p-5 rounded-3xl border border-orange-500/30 text-amber-100 shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2c170d] via-[#3a1d0f] to-[#210f07] border border-orange-500/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">[ CULINARY PASS CANVAS ]</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
            KITCHEN PASS LIVE
          </span>
        </div>
        <p className="text-xs text-amber-200/80 max-w-2xl font-sans leading-relaxed">
          ${config.workspaceSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-[#21110a] border border-orange-500/40 text-sm text-amber-100 placeholder-amber-700 focus:outline-none focus:border-orange-400 font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Coffee className="w-4 h-4 fill-current" />}
            <span>Execute Kitchen Pass</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {passes.map((pass, idx) => (
            <div
              key={pass.id}
              onClick={() => setSelectedPass(idx)}
              className={"group rounded-2xl border transition-all cursor-pointer overflow-hidden " + (selectedPass === idx ? "bg-[#331c10] border-orange-400 shadow-xl shadow-orange-500/20 ring-1 ring-orange-400" : "bg-[#21120a] border-orange-900/40 hover:border-orange-500/40 hover:bg-[#2c170d]")}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={pass.imageUrl} alt={pass.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21120a] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/90 text-orange-300 border border-orange-500/40">
                  {pass.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded">
                  {pass.status}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">{pass.title}</h4>
                <p className="text-xs text-amber-200/70 line-clamp-2 leading-relaxed">{pass.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "realestate") {
      return `import React, { useState } from "react";
import { Building2, Eye, RefreshCw, Compass } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  const properties = ${cardsJson};

  return (
    <div className="space-y-6 bg-[#080d19] p-5 rounded-3xl border border-sky-500/30 text-sky-100 shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1b33] via-[#122445] to-[#091326] border border-sky-500/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">[ SPATIAL PROPERTY RADAR ]</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            3D SPATIAL RADAR
          </span>
        </div>
        <p className="text-xs text-sky-200/80 max-w-2xl font-sans leading-relaxed">
          ${config.workspaceSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-[#0b1426] border border-sky-500/40 text-sm text-sky-100 placeholder-sky-700 focus:outline-none focus:border-sky-400 font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            <span>Run Property Radar</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {properties.map((prop, idx) => (
            <div
              key={prop.id}
              onClick={() => setSelectedProperty(idx)}
              className={"group rounded-2xl border transition-all cursor-pointer overflow-hidden " + (selectedProperty === idx ? "bg-[#132545] border-sky-400 shadow-xl shadow-sky-500/20 ring-1 ring-sky-400" : "bg-[#0c182e] border-sky-900/40 hover:border-sky-500/40 hover:bg-[#11213f]")}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c182e] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950/90 text-sky-300 border border-sky-500/40">
                  {prop.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] font-mono font-bold text-emerald-400 bg-black/80 px-2 py-0.5 rounded">
                  $2.4M Valued
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{prop.title}</h4>
                <p className="text-xs text-sky-200/70 line-clamp-2 leading-relaxed">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "edutech") {
      return `import React, { useState } from "react";
import { GraduationCap, BookOpen, Brain, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const nodes = ${cardsJson};

  return (
    <div className="space-y-6 bg-[#090714] p-5 rounded-3xl border border-violet-500/30 text-violet-100 shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1b1038] via-[#26164d] to-[#120a28] border border-violet-500/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">[ KNOWLEDGE SYNTHESIZER ]</span>
              <h2 className="text-xl font-extrabold text-white tracking-wide font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            NEURAL TUTOR ACTIVE
          </span>
        </div>
        <p className="text-xs text-violet-200/80 max-w-2xl font-sans leading-relaxed">
          ${config.workspaceSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-[#130b29] border border-violet-500/40 text-sm text-violet-100 placeholder-violet-700 focus:outline-none focus:border-violet-400 font-sans"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            <span>Synthesize Knowledge Unit</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-violet-300 uppercase tracking-wider">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(idx)}
              className={"group rounded-2xl border transition-all cursor-pointer overflow-hidden " + (selectedNode === idx ? "bg-[#25154d] border-violet-400 shadow-xl shadow-violet-500/20 ring-1 ring-violet-400" : "bg-[#140b2b] border-violet-900/40 hover:border-violet-500/40 hover:bg-[#1d103f]")}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={node.imageUrl} alt={node.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140b2b] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-violet-950/90 text-violet-300 border border-violet-500/40">
                  {node.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded">
                  {node.status}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{node.title}</h4>
                <p className="text-xs text-violet-200/70 line-clamp-2 leading-relaxed">{node.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "dashboard") {
      return `import React, { useState } from "react";
import { Activity, BarChart2, ShieldCheck, Play, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const cases = ${cardsJson};

  return (
    <div className="space-y-6 bg-slate-950 p-5 rounded-3xl border border-slate-800 text-slate-100 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Target Success SLA</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">99.8%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">+2.4%</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">Verified production run benchmark</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg Latency</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">14ms</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">-18%</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">Sub-second token response</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Agent Fleet</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">4 Nodes</span>
            <span className="text-xs font-semibold text-blue-400">ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">Coordinated agent topology</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Efficiency Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white tracking-tight">+88%</span>
            <span className="text-xs font-semibold text-emerald-400">OPTIMIZED</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">Resource allocation score</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">${config.workspaceTitle}</h2>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            COMPLIANCE VERIFIED
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Execute Analysis</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">${config.gridTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cases.map((c, idx) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(idx)}
              className={"p-5 rounded-2xl border transition-all cursor-pointer " + (selectedCase === idx ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500" : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900")}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {c.badge}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400">{c.status}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{c.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
    }

    if (layout === "studio") {
      return `import React, { useState } from "react";
import { Terminal, Play, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const nodes = ${cardsJson};

  return (
    <div className="space-y-6 font-mono text-gray-200 bg-[#030712] p-5 rounded-3xl border border-gray-800 shadow-2xl">
      <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">[ TELEMETRY STUDIO ]</span>
              <h2 className="text-xl font-bold text-white tracking-tight font-sans">${config.workspaceTitle}</h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-md bg-gray-900 border border-gray-700 text-xs font-mono text-gray-400">
            git: main (57cd356)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="${config.directivePlaceholder}"
            className="flex-1 px-4 py-3 rounded-xl bg-black border border-gray-800 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={onTrigger}
            disabled={isExecuting}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>RUN PIPELINE</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {nodes.map((node, idx) => (
          <div
            key={node.id}
            onClick={() => setSelectedNode(idx)}
            className={"p-5 rounded-2xl border transition-all cursor-pointer " + (selectedNode === idx ? "bg-[#0b0f19] border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500" : "bg-[#070a12] border-gray-800 hover:border-gray-700 hover:bg-[#0b0f19]")}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                {node.badge}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">{node.status}</span>
            </div>
            <h4 className="text-sm font-bold text-white font-sans mb-1">{node.title}</h4>
            <p className="text-xs text-gray-400 font-sans line-clamp-2">{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`;
    }

    // Default Bento Studio Workspace
    return `import React, { useState } from "react";
import { Sparkles, Play, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const scenes = ${cardsJson};

  return (
    <div className="space-y-6">
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
              className={"group rounded-2xl overflow-hidden border transition-all cursor-pointer " + (selectedCard === idx ? "bg-[#131722] border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/40" : "bg-[#0d1017]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#11151f]")}
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
  }
}
