import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { HackathonContext } from './HackathonAnalystAgent';

export interface HackathonBlueprint {
  projectName: string;
  tagline: string;
  problemStatement: string;
  proposedSolution: string;
  layoutType?: "bento" | "cyber" | "dashboard" | "clinical" | "studio" | "ecommerce" | "media" | "culinary" | "realestate" | "edutech";
  techStack: {
    frontend: string[];
    backend: string[];
    apis: string[];
    deployment: string[];
  };
  agentArchitecture: {
    name: string;
    role: string;
    inputs: string;
    outputs: string;
  }[];
  uiBlueprint: {
    page: string;
    purpose: string;
    keyComponents: string[];
  }[];
  demoFlow: string[];
  scoringStrategy: string;
}

import { KeyPoolManager } from '../KeyPoolManager';

export class IdeaStrategistAgent {
  private apiKey: string;
  private onTelemetry?: (msg: string) => void;

  constructor(apiKey?: string, onTelemetry?: (msg: string) => void) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.onTelemetry = onTelemetry;
  }

  async generateBlueprint(context: HackathonContext): Promise<HackathonBlueprint> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY is not set.");
    }
    
    // Support multiple API keys separated by commas for rate limit rotation
    const keyList = this.apiKey.split(",").map(k => k.trim()).filter(Boolean);
    const models = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
    let result: any = null;
    let lastError: any = null;

    const prompt = `
You are an elite Hackathon Strategist who has won 50+ hackathons. Given the following hackathon prompt/context, generate a UNIQUE, HIGHLY INNOVATIVE, and WINNING project blueprint tailored directly to this domain.

--- HACKATHON CONTEXT ---
Theme: ${context.theme}
Sponsors: ${context.sponsors.join(', ')}
Judging Criteria: ${context.judgingCriteria}
Required Technologies: ${context.requiredTech.join(', ')}
Time Constraints: ${context.timeConstraints}
Full Prompt: ${context.rawPrompt.substring(0, 2000)}
--- END ---

🎯 CREATIVE DIRECTIVE:
Analyze the domain requested in the prompt (e.g. Food & Beverage / Restaurant, FinTech, DevTools, HealthTech, Media, E-Commerce, Social).
Design a sophisticated, high-impact product with a clever, catchy name and an undeniable AI innovation edge.

Your goal is to design a project that solves a real-world problem with an INNOVATIVE AI edge:
- Innovation: How does this go beyond a basic prompt? Use LLM reasoning, autonomous multi-agent systems, or multimodal capabilities.
- User Utility: Does this actually make a user's life better/easier? Focus on the end-user experience.
- Holistic Product: Don't just build a simple dashboard. Plan a complete commercial command center with specialized agent workflows.
- Technical Depth: Design a sophisticated multi-agent architecture (3-5 agents) with distinct responsibilities.
- Visual WOW: Plan for a premium, state-of-the-art UI theme.

Output a JSON object with this exact schema:
{
  "projectName": "Catchy and memorable product name",
  "tagline": "Innovative one-line pitch",
  "problemStatement": "The deep user pain point being solved (2-3 sentences)",
  "proposedSolution": "The holistic AI-driven solution (2-3 sentences)",
  "innovationHighlight": "What makes this disruptive and technically unique",
  "layoutType": "Choose one of: bento, cyber, dashboard, clinical, studio, ecommerce, media, culinary, realestate, edutech depending on the domain",
  "techStack": {
    "frontend": ["List of frontend technologies. Use Next.js, Tailwind CSS, Framer Motion, and Lucide React to showcase the user's primary UI strengths, unless the hackathon strictly dictates a different UI environment."],
    "backend": ["List of backend systems. You MUST align this with the hackathon's required/suggested platforms (e.g., Python, Custom MCP Servers). Only add Node.js as a secondary layer if beneficial to hook up to the Next.js visual dashboard."],
    "apis": ["List of primary APIs mandated or recommended by the hackathon. DO NOT default to any specific API unless it is a sponsor or the absolute optimal engine. Prioritize required tech!"],
    "deployment": ["List of deployment environments strictly based on the hackathon rules."]
  },
  "agentArchitecture": [
    {
      "name": "AgentName",
      "role": "Specific reasoning responsibility",
      "inputs": "Context received",
      "outputs": "Decision or data produced"
    }
  ],
  "uiBlueprint": [
    {
      "page": "Landing Page",
      "purpose": "Marketing and problem explanation with Hero/Features sections",
      "keyComponents": ["HeroSection", "InnovationShowcase", "CTA"]
    },
    {
      "page": "Dashboard",
      "purpose": "The functional AI workspace showing live reasoning and actions",
      "keyComponents": ["AgentStatusHUD", "LiveReasoningLog", "ActionCenter"]
    }
  ],
  "demoFlow": [
    "Step 1: Landing Page - Highlight the problem and the 'Innovation Highlight'",
    "Step 2: Dashboard - Show the Multi-Agent HUD in 'Standby'",
    "Step 3: Action - User triggers a complex task",
    "Step 4: Reasoning - Show the live logs of agents collaborating",
    "Step 5: Result - The high-impact resolution"
  ],
  "scoringStrategy": "Explain how this project achieves an 11/10 in Innovation and User Impact."
}

Return valid JSON only. Do not wrap in markdown tags like \`\`\`json.
`;

    const schema = z.object({
      projectName: z.string(),
      tagline: z.string(),
      problemStatement: z.string(),
      proposedSolution: z.string(),
      innovationHighlight: z.string().describe("What makes this disruptive and technically unique. Leave empty if none."),
      layoutType: z.enum(["bento", "cyber", "dashboard", "clinical", "studio", "ecommerce", "media", "culinary", "realestate", "edutech"]).optional(),
      techStack: z.object({
        frontend: z.array(z.string()),
        backend: z.array(z.string()),
        apis: z.array(z.string()),
        deployment: z.array(z.string())
      }),
      agentArchitecture: z.array(z.object({
        name: z.string(),
        role: z.string(),
        inputs: z.string(),
        outputs: z.string()
      })),
      uiBlueprint: z.array(z.object({
        page: z.string(),
        purpose: z.string(),
        keyComponents: z.array(z.string())
      })),
      demoFlow: z.array(z.string()),
      scoringStrategy: z.string()
    });

    const startIdx = KeyPoolManager.getActiveIndex(keyList.length);

    for (const modelName of models) {
      if (result && result.object) break;

      for (let i = 0; i < keyList.length; i++) {
        const attemptIdx = (startIdx + i) % keyList.length;
        const currentKey = keyList[attemptIdx];
        const keyNum = attemptIdx + 1;
        const masked = KeyPoolManager.maskKey(currentKey);

        if (KeyPoolManager.isKeyExhausted(currentKey) && modelName === "openai/gpt-oss-120b") {
          if (this.onTelemetry) {
            this.onTelemetry(`⚡ Skipping Key ${keyNum} (${masked}) - marked rate-limited for today.`);
          }
          continue;
        }

        if (this.onTelemetry) {
          this.onTelemetry(`🔑 Key Pool: Using Key ${keyNum} of ${keyList.length} (${masked}) for \`${modelName}\`...`);
        }

        const groq = createGroq({ apiKey: currentKey });
        try {
          result = await generateObject({
            model: groq(modelName),
            prompt,
            temperature: 0.7,
            schema,
          });
          if (result && result.object) {
            KeyPoolManager.setActiveIndex(attemptIdx, keyList.length);
            if (this.onTelemetry) {
              this.onTelemetry(`✅ Key ${keyNum} (${masked}) succeeded for \`${modelName}\`.`);
            }
            break;
          }
        } catch (err: any) {
          lastError = err;
          const isRateLimit = String(err?.message || err).toLowerCase().includes('rate limit') || String(err?.message || err).includes('200000');
          if (isRateLimit) {
            KeyPoolManager.markKeyExhausted(currentKey);
            if (this.onTelemetry) {
              this.onTelemetry(`⚠️ **Key ${keyNum} (${masked}) hit daily rate limit!** Marking key exhausted & rotating...`);
            }
          } else {
            if (this.onTelemetry) {
              this.onTelemetry(`⚠️ Key ${keyNum} (${masked}) failed (${err?.message || 'Error'}). Retrying...`);
            }
          }
        }
      }
    }

    if (!result || !result.object) {
      throw new Error("All Groq fallback models failed to return a response.");
    }

    const bp: any = result.object;
    
    // Normalize missing fields
    const normalizedBlueprint: HackathonBlueprint = {
      projectName: bp.projectName || 'AI Project',
      tagline: bp.tagline || 'An innovative solution',
      problemStatement: bp.problemStatement || '',
      proposedSolution: bp.proposedSolution || '',
      layoutType: bp.layoutType || undefined,
      techStack: {
        frontend: bp.techStack?.frontend || ['Next.js', 'Tailwind CSS'],
        backend: bp.techStack?.backend || ['Node.js'],
        apis: bp.techStack?.apis || [],
        deployment: bp.techStack?.deployment || ['Vercel']
      },
      agentArchitecture: Array.isArray(bp.agentArchitecture) ? bp.agentArchitecture : [],
      uiBlueprint: Array.isArray(bp.uiBlueprint) ? bp.uiBlueprint : [],
      demoFlow: Array.isArray(bp.demoFlow) ? bp.demoFlow : [],
      scoringStrategy: bp.scoringStrategy || ''
    };

    return normalizedBlueprint;
  }

  blueprintToMarkdown(bp: HackathonBlueprint): string {
    let md = `# 🏆 ${bp.projectName}\n\n`;
    md += `> *${bp.tagline}*\n\n`;
    md += `---\n\n`;

    md += `## 🎯 Problem Statement\n${bp.problemStatement}\n\n`;
    md += `## 💡 Proposed Solution\n${bp.proposedSolution}\n\n`;

    md += `## 🏗️ Tech Stack\n`;
    md += `| Layer | Technologies |\n|---|---|\n`;
    md += `| Frontend | ${bp.techStack.frontend.join(', ')} |\n`;
    md += `| Backend | ${bp.techStack.backend.join(', ')} |\n`;
    md += `| APIs | ${bp.techStack.apis.join(', ')} |\n`;
    md += `| Deployment | ${bp.techStack.deployment.join(', ')} |\n\n`;

    md += `## 🤖 Agent Architecture\n`;
    for (const agent of bp.agentArchitecture) {
      md += `### ${agent.name}\n`;
      md += `- **Role:** ${agent.role}\n`;
      md += `- **Inputs:** ${agent.inputs}\n`;
      md += `- **Outputs:** ${agent.outputs}\n\n`;
    }

    md += `## 🖥️ UI Blueprint\n`;
    for (const page of bp.uiBlueprint) {
      md += `### ${page.page}\n`;
      md += `**Purpose:** ${page.purpose}\n`;
      md += `**Components:** ${page.keyComponents.join(' · ')}\n\n`;
    }

    md += `## 🎬 Demo Flow\n`;
    bp.demoFlow.forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });
    md += `\n`;

    md += `## 📊 Scoring Strategy\n${bp.scoringStrategy}\n`;

    return md;
  }
}
