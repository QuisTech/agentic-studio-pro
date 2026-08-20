"use client";

import React, { useState } from "react";
import { Activity, X, Terminal, Copy, Check, Trash2, Key } from "lucide-react";

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  type: "key" | "stage" | "error" | "info";
  sender: string;
  message: string;
}

interface SystemLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SystemLogEntry[];
  onClearLogs: () => void;
}

export default function SystemLogModal({ isOpen, onClose, logs, onClearLogs }: SystemLogModalProps) {
  const [filter, setFilter] = useState<"all" | "key" | "stage" | "error">("all");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    if (filter === "key") return log.type === "key" || log.message.includes("Key") || log.message.includes("🔑");
    if (filter === "stage") return log.type === "stage" || log.message.includes("Stage") || log.message.includes("📊");
    if (filter === "error") return log.type === "error" || log.message.includes("⚠️") || log.message.includes("Error");
    return true;
  });

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.sender}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b0d13] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1118]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                System Telemetry & API Key Log
                <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {logs.length} events
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Real-time API key rotation diagnostics, model latency metrics, and stage telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="px-6 py-3 border-b border-white/5 bg-[#090b10] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded font-medium transition-all ${
                filter === "all" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              All Logs ({logs.length})
            </button>
            <button
              onClick={() => setFilter("key")}
              className={`px-3 py-1 rounded font-medium flex items-center gap-1 transition-all ${
                filter === "key" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Key className="w-3 h-3" />
              Key Pool & Rotation
            </button>
            <button
              onClick={() => setFilter("stage")}
              className={`px-3 py-1 rounded font-medium transition-all ${
                filter === "stage" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Stage Telemetry
            </button>
            <button
              onClick={() => setFilter("error")}
              className={`px-3 py-1 rounded font-medium transition-all ${
                filter === "error" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Warnings & Errors
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 border border-white/5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Logs"}</span>
            </button>
            <button
              onClick={onClearLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 border border-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-[#06080d] selection:bg-purple-900 selection:text-white">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
              <Terminal className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
              <p className="text-gray-300 font-medium">No system telemetry logs recorded yet.</p>
              <p className="text-[11px] text-gray-500 mt-1">Run an orchestration prompt to stream key rotation & stage diagnostics.</p>
            </div>
          ) : (
            filteredLogs.map(log => {
              const isKey = log.type === "key" || log.message.includes("Key") || log.message.includes("🔑");
              const isError = log.type === "error" || log.message.includes("⚠️") || log.message.includes("Error");
              const isStage = log.type === "stage" || log.message.includes("📊") || log.message.includes("Stage");

              return (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 ${
                    isError
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      : isKey
                      ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-200"
                      : isStage
                      ? "bg-purple-950/20 border-purple-500/30 text-purple-200"
                      : "bg-white/[0.02] border-white/5 text-gray-300"
                  }`}
                >
                  <span className="text-[10px] text-gray-500 shrink-0 font-mono pt-0.5">
                    {log.timestamp}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    isError
                      ? "bg-amber-500/20 text-amber-300"
                      : isKey
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {log.sender}
                  </span>
                  <p className="flex-1 whitespace-pre-wrap break-words leading-relaxed text-xs">
                    {log.message}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
