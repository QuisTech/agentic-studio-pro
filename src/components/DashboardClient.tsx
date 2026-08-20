"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AgentChat from "@/components/AgentChat";
import KanbanBoard from "@/components/KanbanBoard";
import CodeViewer from "@/components/CodeViewer";
import { Maximize2, Minimize2 } from "lucide-react";

export type Message = { id: number; role: string; content: string; sender: string };
export type Task = { id: number; title: string; status: "todo" | "in-progress" | "done" };
export type Column = { title: string; tasks: Task[] };

const DEFAULT_MESSAGES: Message[] = [
  { id: 1, role: "user", content: "Let's build a killer app for this hackathon.", sender: "User" },
  { id: 2, role: "analyst", content: "I'll analyze the prompt and extract requirements.", sender: "Hackathon Analyst" },
];

const DEFAULT_COLUMNS: Column[] = [
  {
    title: "Analysis",
    tasks: [{ id: 1, title: "Extract constraints", status: "todo" }]
  },
  {
    title: "Strategy",
    tasks: [{ id: 2, title: "Generate Blueprint", status: "todo" }]
  },
  {
    title: "Scaffold",
    tasks: [{ id: 3, title: "Generate Project", status: "todo" }]
  },
  {
    title: "GitOps",
    tasks: [{ id: 4, title: "Push to GitHub", status: "todo" }]
  },
  {
    title: "Deploy",
    tasks: [{ id: 5, title: "Deploy to Vercel", status: "todo" }]
  },
  {
    title: "Demo",
    tasks: [{ id: 6, title: "Record Video", status: "todo" }]
  },
  {
    title: "Submission",
    tasks: [{ id: 7, title: "Write Devpost", status: "todo" }]
  }
];

const DEFAULT_FILES: Record<string, string> = {
  "/App.tsx": `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">\n      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-700">\n        <h1 className="text-3xl font-bold text-white mb-2">Hackathon Dashboard</h1>\n        <p className="text-gray-400 mb-6">Agents are assembling...</p>\n      </div>\n    </div>\n  );\n}`,
  "/styles.css": `body {\n  margin: 0;\n  background-color: #090b10;\n  color: #fff;\n}`
};

export default function DashboardClient() {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [files, setFiles] = useState<Record<string, string>>(DEFAULT_FILES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTypingAgent, setCurrentTypingAgent] = useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<"chat" | "preview" | "kanban" | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem("agentic_messages");
    const savedColumns = localStorage.getItem("agentic_columns");
    const savedFiles = localStorage.getItem("agentic_files");
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedColumns) setColumns(JSON.parse(savedColumns));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        for (const k of Object.keys(parsed)) {
          if (k.endsWith('.css') && typeof parsed[k] === 'string') {
            parsed[k] = parsed[k]
              .replace(/@import\b[^;\n]*;?/gi, '')
              .replace(/@tailwind\b[^;\n]*;?/gi, '');
          }
        }
        setFiles(parsed);
      } catch {}
    }
    
    setIsHydrated(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("agentic_messages", JSON.stringify(messages));
      localStorage.setItem("agentic_columns", JSON.stringify(columns));
      localStorage.setItem("agentic_files", JSON.stringify(files));
    }
  }, [messages, columns, files, isHydrated]);

  const handleClearSession = () => {
    if (confirm("Are you sure you want to clear your entire session? This cannot be undone.")) {
      localStorage.removeItem("agentic_messages");
      localStorage.removeItem("agentic_columns");
      localStorage.removeItem("agentic_files");
      setMessages([]);
      
      const resetColumns = DEFAULT_COLUMNS.map(col => ({
        ...col,
        tasks: col.tasks.map(task => ({ ...task, status: "todo" as const }))
      }));
      setColumns(resetColumns);
      setFiles(DEFAULT_FILES);
    }
  };

  const startWorkflow = async (prompt: string) => {
    const finalPrompt = prompt.trim() || "Resume orchestration";
    
    const newMessages = [...messages, { id: Date.now(), role: "user", content: finalPrompt, sender: "User" }];
    setMessages(newMessages);
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, history: newMessages })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const data = JSON.parse(line);
            
            if (data.type === "message") {
              setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                role: data.role,
                sender: data.sender,
                content: data.content
              }]);
            } else if (data.type === "typing") {
              setCurrentTypingAgent(data.agent);
            } else if (data.type === "kanban") {
              setColumns(prev => {
                const newCols = [...prev];
                const colIndex = newCols.findIndex(c => c.title === data.column);
                if (colIndex > -1) {
                  const taskIndex = newCols[colIndex].tasks.findIndex(t => t.id === data.taskId);
                  if (taskIndex > -1) {
                    newCols[colIndex].tasks[taskIndex].status = data.status;
                  }
                }
                return newCols;
              });
            } else if (data.type === "code") {
              const cleanFiles = { ...data.files };
              for (const k of Object.keys(cleanFiles)) {
                if (k.endsWith('.css') && typeof cleanFiles[k] === 'string') {
                  cleanFiles[k] = cleanFiles[k]
                    .replace(/@import\b[^;\n]*;?/gi, '')
                    .replace(/@tailwind\b[^;\n]*;?/gi, '');
                }
              }
              setFiles(cleanFiles);
            }
          } catch {
            console.error("Failed to parse chunk", line);
          }
        }
      }
    } catch (error) {
      console.error("Workflow failed", error);
    } finally {
      setIsProcessing(false);
      setCurrentTypingAgent(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      <Header files={files} onClearSession={handleClearSession} />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Panel 1: Agent Chat */}
        {(!expandedPanel || expandedPanel === "chat") && (
          <div className={`${expandedPanel === "chat" ? "w-full" : "w-[420px] shrink-0"} flex flex-col h-full border-r border-white/5 transition-all duration-200`}>
            <AgentChat 
              messages={messages} 
              isProcessing={isProcessing} 
              typingAgent={currentTypingAgent}
              onSendMessage={startWorkflow}
              isExpanded={expandedPanel === "chat"}
              onToggleExpand={() => setExpandedPanel(prev => prev === "chat" ? null : "chat")}
            />
          </div>
        )}
        
        {/* Panel 2 & 3: Workspace (Code & Kanban) */}
        {(!expandedPanel || expandedPanel === "preview" || expandedPanel === "kanban") && (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
            {/* Live Code & Browser Preview */}
            {(!expandedPanel || expandedPanel === "preview") && (
              <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
                {/* Control bar for Preview Maximize */}
                <div className="h-9 px-4 bg-[#0d1017] border-b border-white/5 flex items-center justify-between shrink-0 z-10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    <span className="text-xs font-semibold text-gray-300">Live Code & Sandbox Preview</span>
                  </div>
                  <button
                    onClick={() => setExpandedPanel(prev => prev === "preview" ? null : "preview")}
                    title={expandedPanel === "preview" ? "Restore Split View" : "Maximize Preview (Fullscreen)"}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors border border-white/5"
                  >
                    {expandedPanel === "preview" ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Restore</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Maximize</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative flex">
                  <CodeViewer files={files} />
                </div>
              </div>
            )}

            {/* Kanban Board */}
            {(!expandedPanel || expandedPanel === "kanban") && (
              <div className={`${expandedPanel === "kanban" ? "flex-1" : "h-[250px] shrink-0"} border-t border-white/5 transition-all duration-200 overflow-hidden flex flex-col`}>
                <KanbanBoard 
                  columns={columns} 
                  isExpanded={expandedPanel === "kanban"}
                  onToggleExpand={() => setExpandedPanel(prev => prev === "kanban" ? null : "kanban")}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
