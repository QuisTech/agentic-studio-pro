import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { DemoStoryboard } from '../types';

export class PlannerAgent {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
  }

  /**
   * Generates a storyboard from context and live DOM tree.
   */
  async generateStoryboard(url: string, githubContext: string, domContext: any[], customInstructions?: string): Promise<DemoStoryboard> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY is not set.");
    }
    
    const keyList = this.apiKey.split(",").map(k => k.trim()).filter(Boolean);
    const selectedKey = keyList[Math.floor(Math.random() * keyList.length)];

    const groq = createGroq({
      apiKey: selectedKey,
    });

    const prompt = `
You are an expert Cinematic Demo Director. Create a structured JSON storyboard for a **3-minute** hackathon demo video.
The app URL is: ${url}

--- GITHUB CONTEXT ---
${githubContext.substring(0, 3000)} // Truncated to avoid token limits

--- LIVE DOM ELEMENTS ---
Here are the actual interactive elements extracted from the live page. YOU MUST ONLY USE THESE EXACT SELECTORS for 'click', 'hover', or 'type' actions.
${JSON.stringify(domContext, null, 2)}

${customInstructions ? `--- USER DIRECTIVES ---\nThe user has provided specific instructions for this demo. You MUST follow these instructions and incorporate them into the storyboard:\n${customInstructions}\n` : ''}
Output a JSON object with this exact schema:
{
  "title": "A short title for the demo",
  "actions": [
    {
      "id": "unique_action_id",
      "action": "goto" | "click" | "type" | "narrate" | "wait" | "hover" | "scroll" | "zoom" | "backtrack" | "cursor",
      "value": "Optional string (URL to goto, text to type, script to narrate, px to scroll, 'show'/'hide' for cursor)",
      "selector": "Optional CSS selector for click/type/hover/zoom.",
      "duration": "Optional number (milliseconds to wait)"
    }
  ]
}

Guidelines:
1. Every action MUST have a unique "id" field (e.g., "intro_goto", "hero_narrate", "form_type_email"). IDs must be unique across the entire storyboard.
2. Start with a "goto" action to navigate to the URL: ${url}.
3. Follow with a "narrate" action (30-40 seconds) introducing the project with cinematic, professional language.
4. **TARGET 3+ MINUTES (180 seconds).** Generate enough actions and narration to fill at least 3 minutes. Use 5-6 narration segments of 25-40 seconds each.
5. **ACT OUT THE FULL DEMO FLOW:** Perform a realistic sequence of interactions demonstrating core value.
   - Use "type" to fill inputs with realistic data. Use "click" to trigger actions. Use "hover" to highlight features.
6. **CINEMATIC EFFECTS:**
   - Use "scroll" with value (e.g., "300" or "-300") for smooth vertical scrolling.
   - Use "zoom" with a selector to focus attention on a critical UI element.
   - Use "backtrack" to smoothly scroll back to the top (optionally with a selector to move cursor to).
   - Use "cursor" with value "hide" or "show" to control cursor visibility for cinematic moments.
7. **SELECTOR PRECISION:** Use ONLY the exact selectors from LIVE DOM ELEMENTS. DO NOT invent selectors.
8. **NARRATION SYNC:** For every major action (click, type, hover, zoom), add a "narrate" explaining what the viewer is seeing.
9. Use "wait" (duration: 2000-4000) after significant interactions to let the viewer absorb the result.
10. Include at least one "backtrack" near the end to scroll back to the hero section for a cinematic conclusion.
11. Return valid JSON only, without any markdown formatting.
12. Do NOT use the words "sovereign" or "sovereignty" in any narration text.
`;

    const schema = z.object({
      title: z.string(),
      actions: z.array(z.object({
        id: z.string(),
        action: z.enum(["goto", "click", "type", "narrate", "wait", "hover", "scroll", "zoom", "backtrack", "cursor"]),
        value: z.string().describe("Optional string. Leave empty if not needed."),
        selector: z.string().describe("Optional CSS selector. Leave empty if not needed."),
        duration: z.number().describe("Optional number. Use 0 if not needed.")
      }))
    });

    let result;

    const callGenerate = async (modelName: string) => {
      return await generateObject({
        model: groq(modelName),
        prompt,
        temperature: 0.3,
        schema,
      });
    };

    try {
      // Primary
      result = await callGenerate("openai/gpt-oss-120b");
    } catch (err1: any) {
      console.warn("Primary model (llama-3.3-70b-versatile) failed, falling back to Catch 1", err1?.message || err1);
      try {
        // Catch 1 (Fallback)
        result = await callGenerate("openai/gpt-oss-120b");
      } catch (err2: any) {
        console.warn("Catch 1 (llama-3.1-8b-instant) failed, falling back to Catch 2", err2?.message || err2);
        // Catch 2 (Lightweight Fallback)
        result = await callGenerate("openai/gpt-oss-120b");
      }
    }

    if (!result || !result.object || !Array.isArray((result.object as any).actions)) {
      throw new Error("Failed to generate storyboard from Groq.");
    }

    const storyboard = result.object as DemoStoryboard;

    // ── Post-processing: enforce actionId contract ──
    // Guarantee every action has a unique id, even if the LLM skipped some.
    const usedIds = new Set<string>();
    for (let i = 0; i < storyboard.actions.length; i++) {
      const action = storyboard.actions[i];
      if (!action.id || usedIds.has(action.id)) {
        action.id = `${action.action}_${i}`;
      }
      usedIds.add(action.id);
    }

    return storyboard;
  }
}
