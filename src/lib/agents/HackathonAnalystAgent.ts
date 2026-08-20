import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';

export interface PlatformLock {
  isLocked: boolean;
  platformName: string;
  platformUrl: string;
  reason: string;
}

export interface HackathonContext {
  theme: string;
  sponsors: string[];
  judgingCriteria: string;
  requiredTech: string[];
  timeConstraints: string;
  rawPrompt: string;
  requiredApiKeys: { name: string; signupUrl: string; description: string }[];
  platformLock: PlatformLock;
}

export class HackathonAnalystAgent {
  private apiKey: string;
  private onTelemetry?: (msg: string) => void;

  constructor(apiKey?: string, onTelemetry?: (msg: string) => void) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.onTelemetry = onTelemetry;
  }

  async analyzeHackathon(rawText: string): Promise<HackathonContext> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY is not set.");
    }
    
    // Support multiple API keys separated by commas for rate limit rotation
    const keyList = this.apiKey.split(",").map(k => k.trim()).filter(Boolean);
    const MODEL_NAME = "openai/gpt-oss-120b";
    const maskKey = (k: string) => k.length > 10 ? `${k.substring(0, 7)}...${k.substring(k.length - 4)}` : k;
    let result: any = null;
    let lastError: any = null;

    const prompt = `
You are a Hackathon Intelligence Analyst. Parse the following hackathon prompt/rubric and extract structured information.

--- RAW HACKATHON PROMPT ---
${rawText}
--- END ---

Output a JSON object with this exact schema:
{
  "theme": "The core theme or challenge description in one sentence",
  "sponsors": ["List of sponsor companies or APIs mentioned"],
  "judgingCriteria": "The judging criteria or rubric as a formatted string (e.g., 'Innovation 30%, Technical 30%, Design 20%, Impact 20%')",
  "requiredTech": ["List of required or recommended technologies, APIs, or platforms"],
  "timeConstraints": "Duration and team size if mentioned, otherwise 'Not specified'",
  "rawPrompt": "The original prompt text, cleaned up",
  "requiredApiKeys": [
    {
      "name": "UPPER_SNAKE_CASE env var name (e.g., MEDO_API_KEY)",
      "signupUrl": "URL to sign up or get this API key",
      "description": "Brief description of what this key is for"
    }
  ],
  "platformLock": {
    "isLocked": true or false,
    "platformName": "Name of the required platform (e.g., MeDo, Replit, Bolt.new)",
    "platformUrl": "URL to the platform",
    "reason": "Brief explanation of why this platform is required"
  }
}

CRITICAL RULES for platformLock:
- Set isLocked to TRUE if the hackathon REQUIRES participants to build their application ON, WITH, or USING a specific platform, workstation, base framework, core protocol, or proprietary SDK as the primary development target (e.g., "SIFT Workstation", "Protocol SIFT", "MeDo", "Replit", "Bolt.new").
- Examples of platform-locked hackathons:
  * "Build with MeDo" → isLocked: true (must use medo.dev to build)
  * "Build on Replit" → isLocked: true (must use replit.com)
  * "Make Protocol SIFT a fully autonomous agent" → isLocked: true (must build/integrate with Protocol SIFT)
  * "Deploy on Google Cloud" → isLocked: false (Google Cloud is general cloud infrastructure, not a base framework or product SDK, unless Google Cloud is the sole sponsor and building with its services is mandatory)
  * "Use Gemini API" → isLocked: false (Gemini is a single API, you can use it from any codebase)
- The key distinction: if the platform/workstation/framework is the mandatory foundation you MUST extend or compile within, it is locked.
- If locked, extract the platform signup/invite/download URL from the hackathon text if available.

IMPORTANT for requiredApiKeys:
- Extract ALL API platforms mentioned that would require an API key or account signup.
- If a specific invite/referral link is mentioned, use THAT URL.
- Format as UPPER_SNAKE_CASE (e.g., CLAUDE_API_KEY, MEDO_API_KEY).

If certain fields are not explicitly stated, make reasonable inferences.
Return valid JSON only. Do not wrap in markdown tags like \`\`\`json.
`;

    const schema = z.object({
      theme: z.string().describe("The core theme or challenge description in one sentence"),
      sponsors: z.array(z.string()).describe("List of sponsor companies or APIs mentioned"),
      judgingCriteria: z.string().describe("The judging criteria or rubric as a formatted string"),
      requiredTech: z.array(z.string()).describe("List of required or recommended technologies, APIs, or platforms"),
      timeConstraints: z.string().describe("Duration and team size if mentioned, otherwise 'Not specified'"),
      rawPrompt: z.string().describe("The original prompt text, cleaned up"),
      requiredApiKeys: z.array(z.object({
        name: z.string().describe("UPPER_SNAKE_CASE env var name"),
        signupUrl: z.string().describe("URL to sign up or get this API key"),
        description: z.string().describe("Brief description of what this key is for")
      })),
      platformLock: z.object({
        isLocked: z.boolean(),
        platformName: z.string(),
        platformUrl: z.string(),
        reason: z.string()
      })
    });

    for (let attempts = 0; attempts < Math.max(keyList.length * 2, 4); attempts++) {
      const keyIndex = (attempts % keyList.length) + 1;
      const currentKey = keyList[attempts % keyList.length];
      const groq = createGroq({ apiKey: currentKey });
      
      if (this.onTelemetry) {
        this.onTelemetry(`🔑 Key Pool: Attempt ${attempts + 1} using Key ${keyIndex} of ${keyList.length} (${maskKey(currentKey)}) for \`${MODEL_NAME}\`...`);
      }
      
      try {
        result = await generateObject({
          model: groq(MODEL_NAME),
          prompt,
          temperature: 0.3,
          schema,
        });
        if (result && result.object) {
          if (this.onTelemetry) {
            this.onTelemetry(`✅ Key ${keyIndex} (${maskKey(currentKey)}) succeeded for \`${MODEL_NAME}\`.`);
          }
          break;
        }
      } catch (err: any) {
        lastError = err;
        const isRateLimit = String(err?.message || err).toLowerCase().includes('rate limit') || String(err?.message || err).includes('200000');
        if (this.onTelemetry) {
          if (isRateLimit) {
            this.onTelemetry(`⚠️ **Key ${keyIndex} (${maskKey(currentKey)}) hit rate limit!** Rotating to Key ${(keyIndex % keyList.length) + 1}...`);
          } else {
            this.onTelemetry(`⚠️ Attempt ${attempts + 1} via Key ${keyIndex} failed (${err?.message || 'Error'}). Retrying...`);
          }
        }
        if (attempts < Math.max(keyList.length * 2, 4) - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempts + 1)));
        }
      }
    }

    if (!result || !result.object) {
      throw new Error("All Groq fallback models failed to return a response.");
    }

    const obj: any = result.object;

    const normalizedContext: HackathonContext = {
      theme: obj.theme || 'Hackathon Project',
      sponsors: Array.isArray(obj.sponsors) ? obj.sponsors : [],
      judgingCriteria: obj.judgingCriteria || '',
      requiredTech: Array.isArray(obj.requiredTech) ? obj.requiredTech : [],
      timeConstraints: obj.timeConstraints || '',
      rawPrompt: obj.rawPrompt || rawText,
      requiredApiKeys: Array.isArray(obj.requiredApiKeys) ? obj.requiredApiKeys : [],
      platformLock: obj.platformLock || { isLocked: false, platformName: '', platformUrl: '', reason: '' }
    };

    return normalizedContext;
  }
}
