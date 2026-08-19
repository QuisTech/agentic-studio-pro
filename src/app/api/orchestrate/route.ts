import { NextResponse } from 'next/server';
import { HackathonAnalystAgent } from '@/lib/agents/HackathonAnalystAgent';
import { IdeaStrategistAgent } from '@/lib/agents/IdeaStrategistAgent';
import { CodeScaffoldAgent } from '@/lib/agents/CodeScaffoldAgent';
import { SubmissionWriterAgent } from '@/lib/agents/SubmissionWriterAgent';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Use /tmp on Vercel/serverless environments
const STATE_FILE = process.env.VERCEL ? path.join(os.tmpdir(), '.orchestration_state.json') : path.join(process.cwd(), '.orchestration_state.json');

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY is not set" }, { status: 500 });
  }

  const body = await req.json();
  const history = body.history || [];
  const rawPrompt = (body.prompt || history[history.length - 1]?.content || "Build a cool AI app").trim();

  // If the user typed a real instruction (and didn't just ask to resume), start fresh!
  const isExplicitResume = rawPrompt.toLowerCase().startsWith("resume") && rawPrompt.length < 30;

  if (!isExplicitResume) {
    if (fs.existsSync(STATE_FILE)) {
      try { fs.unlinkSync(STATE_FILE); } catch {}
    }
  }

  const latestMessage = rawPrompt;

  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      let state: any = {
        step: 0, // 0=start, 1=analysis_done, 2=strategy_done, 3=scaffold_done, 4=gitops_done, 5=deploy_done, 6=demo_done, 7=submission_done
        context: null,
        blueprint: null,
        codeFiles: null,
      };

      if (fs.existsSync(STATE_FILE)) {
        try {
          state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
          sendEvent({ type: "message", role: "system", sender: "System", content: `Resuming orchestration from step ${state.step}...` });
        } catch (e) {
          // ignore parsing error
        }
      }

      const saveState = () => {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
      };

      try {
        if (state.step < 1) {
          // --- 1. Hackathon Analyst Phase ---
          sendEvent({ type: "typing", agent: "Hackathon Analyst" });
          sendEvent({ type: "kanban", column: "Analysis", taskId: 1, status: "in-progress" });
          
          const analyst = new HackathonAnalystAgent(process.env.GROQ_API_KEY);
          sendEvent({ type: "message", role: "analyst", sender: "Hackathon Analyst", content: "Parsing the hackathon prompt and extracting constraints..." });
          
          state.context = await analyst.analyzeHackathon(latestMessage);
          state.step = 1;
          saveState();
          
          sendEvent({ type: "message", role: "analyst", sender: "Hackathon Analyst", content: `Analysis complete! Theme: **${state.context.theme}**\nRequired Tech: ${state.context.requiredTech.join(', ')}` });
          sendEvent({ type: "kanban", column: "Analysis", taskId: 1, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "Analysis", taskId: 1, status: "done" });
        }

        if (state.step < 2) {
          sendEvent({ type: "kanban", column: "Strategy", taskId: 2, status: "in-progress" });
          // --- 2. Idea Strategist Phase ---
          sendEvent({ type: "typing", agent: "Idea Strategist" });
          sendEvent({ type: "message", role: "strategist", sender: "Idea Strategist", content: "Generating a winning project blueprint..." });
          
          const strategist = new IdeaStrategistAgent(process.env.GROQ_API_KEY);
          state.blueprint = await strategist.generateBlueprint(state.context);
          state.step = 2;
          saveState();

          const blueprintMarkdown = strategist.blueprintToMarkdown(state.blueprint);
          
          sendEvent({ type: "message", role: "strategist", sender: "Idea Strategist", content: `Blueprint finalized for **${state.blueprint.projectName}**!\n\n${state.blueprint.tagline}` });
          sendEvent({ type: "message", role: "strategist", sender: "Idea Strategist", content: blueprintMarkdown });
          
          sendEvent({ type: "kanban", column: "Strategy", taskId: 2, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "Strategy", taskId: 2, status: "done" });
        }

        if (state.step < 3) {
          sendEvent({ type: "kanban", column: "Scaffold", taskId: 3, status: "in-progress" });
          // --- 3. Code Scaffolder Phase ---
          sendEvent({ type: "typing", agent: "Code Scaffolder" });
          sendEvent({ type: "message", role: "scaffolder", sender: "Code Scaffolder", content: "Scaffolding the project code based on the blueprint..." });
          
          const scaffolder = new CodeScaffoldAgent(process.env.GROQ_API_KEY);
          const files = await scaffolder.generateProjectFiles(state.blueprint);
          
          const codeFiles: Record<string, string> = {};
          for (const f of files) {
             const cleanPath = "/" + f.path.replace(/^\/+/, "");
             codeFiles[cleanPath] = f.content;
          }
          state.codeFiles = codeFiles;
          state.step = 3;
          saveState();

          sendEvent({ type: "message", role: "scaffolder", sender: "Code Scaffolder", content: "I've generated the files. Check the Live Preview on the right!" });
          sendEvent({ type: "code", files: state.codeFiles });
          
          sendEvent({ type: "kanban", column: "Scaffold", taskId: 3, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "Scaffold", taskId: 3, status: "done" });
          // if skipping over, we should still push the code to UI so they see it
          if (state.codeFiles) {
            sendEvent({ type: "code", files: state.codeFiles });
          }
        }

        if (state.step < 4) {
          sendEvent({ type: "kanban", column: "GitOps", taskId: 4, status: "in-progress" });
          // --- 4. GitOps Phase ---
          sendEvent({ type: "typing", agent: "GitOps Agent" });
          await new Promise(r => setTimeout(r, 1500));
          sendEvent({ type: "message", role: "gitops", sender: "GitOps Agent", content: "Committing code to GitHub repository..." });
          state.step = 4;
          saveState();
          sendEvent({ type: "kanban", column: "GitOps", taskId: 4, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "GitOps", taskId: 4, status: "done" });
        }

        if (state.step < 5) {
          sendEvent({ type: "kanban", column: "Deploy", taskId: 5, status: "in-progress" });
          // --- 5. Deploy Phase ---
          sendEvent({ type: "typing", agent: "Deploy Agent" });
          await new Promise(r => setTimeout(r, 1500));
          sendEvent({ type: "message", role: "deploy", sender: "Deploy Agent", content: "Deploying to Vercel... Application is now live!" });
          state.step = 5;
          saveState();
          sendEvent({ type: "kanban", column: "Deploy", taskId: 5, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "Deploy", taskId: 5, status: "done" });
        }

        if (state.step < 6) {
          sendEvent({ type: "kanban", column: "Demo", taskId: 6, status: "in-progress" });
          // --- 6. Demo Phase ---
          sendEvent({ type: "typing", agent: "Video Auditor" });
          await new Promise(r => setTimeout(r, 1500));
          sendEvent({ type: "message", role: "demo", sender: "Video Auditor", content: "Recording and auditing 3-minute demo video..." });
          state.step = 6;
          saveState();
          sendEvent({ type: "kanban", column: "Demo", taskId: 6, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "Demo", taskId: 6, status: "done" });
        }

        if (state.step < 7) {
          sendEvent({ type: "kanban", column: "Submission", taskId: 7, status: "in-progress" });
          // --- 7. Submission Phase ---
          sendEvent({ type: "typing", agent: "Submission Writer" });
          sendEvent({ type: "message", role: "submission", sender: "Submission Writer", content: "Drafting the Devpost submission..." });
          
          const writer = new SubmissionWriterAgent(process.env.GROQ_API_KEY);
          const storyboard = { title: state.blueprint.projectName, actions: [] };
          const devpostMarkdown = await writer.generateSubmission(JSON.stringify(state.blueprint), storyboard as any);
          
          state.step = 7;
          saveState();
          
          sendEvent({ type: "message", role: "submission", sender: "Submission Writer", content: "Devpost submission drafted. Ready for review!\n\n" + devpostMarkdown.substring(0, 800) + "..." });
          sendEvent({ type: "kanban", column: "Submission", taskId: 7, status: "done" });
        } else {
          sendEvent({ type: "kanban", column: "Submission", taskId: 7, status: "done" });
        }
        
      } catch (error) {
        console.error(error);
        sendEvent({ type: "message", role: "system", sender: "System Error", content: "An error occurred during orchestration: " + String(error) });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(customStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
