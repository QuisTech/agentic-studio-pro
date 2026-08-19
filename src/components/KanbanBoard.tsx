"use client";

import {
  CheckCircle2,
  Circle,
  Code2,
  ListTodo,
  CheckCircle,
  Brain,
  GitBranch,
  Rocket,
  GitPullRequest,
  Video,
  FileText,
  Maximize2,
  Minimize2,
  Loader2
} from "lucide-react";
import { Column } from "./DashboardClient";

export default function KanbanBoard({
  columns,
  isExpanded,
  onToggleExpand
}: {
  columns: Column[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const getIconForColumn = (title: string) => {
    if (title === "Analysis") return <ListTodo className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    if (title === "Strategy") return <Brain className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (title === "Scaffold") return <Code2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    if (title === "GitOps") return <GitBranch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (title === "Deploy") return <Rocket className="w-3.5 h-3.5 text-red-400 shrink-0" />;
    if (title === "GitHub") return <GitPullRequest className="w-3.5 h-3.5 text-white shrink-0" />;
    if (title === "Demo") return <Video className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    if (title === "Submission") return <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  };

  return (
    <div className="flex-1 bg-[#0c0e12] border-t border-white/5 p-3 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2.5 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-gray-300">
            Autonomous Pipeline Workflow
          </h2>
          <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 border border-white/10 uppercase font-mono font-medium">
            7 Stages Active
          </span>
        </div>
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            title={isExpanded ? "Restore Split View" : "Maximize Workflow Board"}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">Restore</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">Maximize</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 7-Column Workflow Grid */}
      <div className="grid grid-cols-7 gap-2 h-full min-h-0 w-full overflow-x-auto overflow-y-hidden">
        {columns.map((col, idx) => {
          const hasInProgress = col.tasks.some(t => t.status === "in-progress");
          const allDone = col.tasks.length > 0 && col.tasks.every(t => t.status === "done");

          return (
            <div
              key={idx}
              className={`rounded-xl flex flex-col overflow-hidden border transition-all h-full min-h-0 ${
                hasInProgress
                  ? "bg-[#141824] border-indigo-500/50 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                  : allDone
                  ? "bg-[#0f131a] border-emerald-500/20"
                  : "bg-[#111319] border-white/[0.06]"
              }`}
            >
              {/* Column Header */}
              <div className="p-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  {getIconForColumn(col.title)}
                  <h3 className="text-[11px] font-bold text-gray-200 truncate">{col.title}</h3>
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  allDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : hasInProgress
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-white/5 text-gray-500"
                }`}>
                  {allDone ? "DONE" : hasInProgress ? "ACTIVE" : `${col.tasks.length}`}
                </span>
              </div>

              {/* Tasks List (Scrollable) */}
              <div className="p-1.5 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
                {col.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-2 rounded-lg border transition-all text-left ${
                      task.status === "done"
                        ? "bg-black/30 border-white/[0.03] text-gray-500"
                        : task.status === "in-progress"
                        ? "bg-indigo-950/40 border-indigo-500/40 text-gray-200 shadow-sm"
                        : "bg-black/40 border-white/[0.04] text-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-1.5">
                      {task.status === "done" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : task.status === "in-progress" ? (
                        <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-[11px] font-medium leading-snug break-words ${
                        task.status === "done" ? "line-through text-gray-500" : "text-gray-200"
                      }`}>
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
