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

    let result;

    const callGenerate = async (modelName: string) => {
      return await generateText({
        model: groq(modelName),
        prompt,
        temperature: 0.3,
      });
    };

    // Multi-Tier Fallback Cascade for Groq with distinct model quotas
    try {
      // Primary (Llama 3.3 70B Versatile)
      result = await callGenerate("llama-3.3-70b-versatile");
    } catch (err1: any) {
      console.warn("Primary model (llama-3.3-70b-versatile) failed, falling back to Catch 1", err1?.message || err1);
      try {
        // Catch 1 (Llama 3.1 8B Instant)
        result = await callGenerate("llama-3.1-8b-instant");
      } catch (err2: any) {
        console.warn("Catch 1 (llama-3.1-8b-instant) failed, falling back to Catch 2", err2?.message || err2);
        try {
          // Catch 2 (Mixtral 8x7B)
          result = await callGenerate("mixtral-8x7b-32768");
        } catch (err3: any) {
          console.warn("Catch 2 (mixtral-8x7b-32768) failed, falling back to Catch 3", err3?.message || err3);
          // Catch 3 (Gemma 2 9B)
          result = await callGenerate("gemma2-9b-it");
        }
      }
    }

    if (!result || !result.text) {
      throw new Error("Failed to generate submission write-up from Groq.");
    }

    return result.text;
  }
}
