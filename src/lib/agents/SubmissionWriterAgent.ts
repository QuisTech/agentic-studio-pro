import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { DemoStoryboard } from '../types';

export class SubmissionWriterAgent {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
  }

  /**
   * Generates a Devpost submission markdown file based on the context.
   */
  async generateSubmission(githubContext: string, storyboard: DemoStoryboard): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY is not set.");
    }
    
    const keyList = this.apiKey.split(",").map(k => k.trim()).filter(Boolean);
    const selectedKey = keyList[Math.floor(Math.random() * keyList.length)];

    const groq = createGroq({
      apiKey: selectedKey,
    });

    const prompt = `
You are an expert Hackathon Strategist and Copywriter. Your goal is to write a winning Devpost submission for a hackathon project.
You have access to the GitHub README context and the Demo Storyboard (which shows exactly how the app is used).

--- GITHUB CONTEXT ---
${githubContext.substring(0, 4000)}

--- DEMO STORYBOARD ---
${JSON.stringify(storyboard.actions.filter(a => a.action === 'narrate').map(a => a.value), null, 2)}

Write a highly compelling, professional, and technical Devpost submission in Markdown.
Use the following classic Devpost sections:

# Inspiration
(Why did we build this? What is the problem?)

# What it does
(A clear, concise explanation of the product)

# How we built it
(Technical architecture, tech stack, APIs used based on the GitHub context)

# Challenges we ran into
(Invent 2 realistic, technical challenges a team would face building this architecture, and how they solved it)

# Accomplishments that we're proud of
(Highlight the best features or engineering feats)

# What we learned
(Technical or domain-specific learnings)

# What's next for ${storyboard.title}
(Future features)

Output ONLY the Markdown content. Do not output JSON. Do not wrap in markdown code blocks (\`\`\`markdown). Just the raw markdown text.
`;

    const MODEL_NAME = "openai/gpt-oss-120b";
    let result: any = null;
    let lastError: any = null;

    for (let attempts = 0; attempts < Math.max(keyList.length * 2, 4); attempts++) {
      const currentKey = keyList[attempts % keyList.length];
      const groq = createGroq({ apiKey: currentKey });
      try {
        result = await generateText({
          model: groq(MODEL_NAME),
          prompt,
          temperature: 0.3,
        });
        if (result && result.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`⚠️ Groq API call attempt ${attempts + 1} failed for ${MODEL_NAME}: ${err?.message || err}`);
        if (attempts < Math.max(keyList.length * 2, 4) - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempts + 1)));
        }
      }
    }

    if (!result || !result.text) {
      throw new Error("Failed to generate submission write-up from Groq.");
    }

    return result.text;
  }
}
