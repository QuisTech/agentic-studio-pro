"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack
} from "@codesandbox/sandpack-react";
import { useMemo, useEffect, useState } from "react";
import { Eye, Code2, Columns, RefreshCw } from "lucide-react";

function SandpackForceUpdater({ newFiles }: { newFiles: Record<string, string> }) {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    for (const [path, content] of Object.entries(newFiles)) {
      if (sandpack.files[path]?.code !== content) {
        sandpack.updateFile(path, content);
      }
    }
  }, [newFiles, sandpack]);

  return null;
}

export default function CodeViewer({ files }: { files: Record<string, string> }) {
  const [viewMode, setViewMode] = useState<"split" | "preview" | "code">("split");
  const [previewKey, setPreviewKey] = useState(0);

  // Sandpack expects absolute paths for files
  const sandpackFiles = useMemo(() => {
    const formatted: Record<string, string> = {};
    for (const [key, value] of Object.entries(files)) {
      const normalizedPath = '/' + key.replace(/^\/+/, '');
      
      // Hotfix: lucide-react removed brand icons, so map each to a distinct valid UI icon to avoid duplicate identifier errors
      let safeContent = value;
      if (safeContent.includes('lucide-react')) {
        const iconMap: Record<string, string> = {
          Github: 'Code',
          Twitter: 'Share2',
          Linkedin: 'Globe',
          Facebook: 'MessageCircle',
          Instagram: 'Camera',
          Youtube: 'Video',
          Discord: 'MessageSquare',
          Twitch: 'Tv',
          Slack: 'Hash',
        };
        safeContent = safeContent.replace(
          /\b(Github|Twitter|Linkedin|Facebook|Instagram|Youtube|Discord|Twitch|Slack)\b/g,
          (m) => iconMap[m] || 'Globe'
        );
      }
      
      // Strip ALL @import and @tailwind directives to prevent Sandpack PostCSS path.isAbsolute(null) errors ("Path must be a string. Received null")
      if (normalizedPath.endsWith('.css')) {
        safeContent = safeContent
          .replace(/@import\b[^;\n]*;?/gi, '')
          .replace(/@tailwind\b[^;\n]*;?/gi, '');
      }

      formatted[normalizedPath] = safeContent;
    }

    // Sandpack expects /App.tsx as the entry point
    if (!formatted['/App.tsx']) {
      let appPath = '';
      if (formatted['/src/App.tsx']) appPath = './src/App';
      else if (formatted['/src/App.jsx']) appPath = './src/App';
      else if (formatted['/App.jsx']) appPath = './App';
      else {
        const mainComponent = Object.keys(formatted).find(f => 
          f.endsWith('.tsx') || f.endsWith('.jsx')
        );
        if (mainComponent) {
          appPath = '.' + mainComponent.replace(/\.(tsx|jsx)$/, '');
        }
      }

      if (appPath) {
        formatted['/App.tsx'] = `import React from 'react';
import AppMain from '${appPath}';

export default function App() {
  return <AppMain />;
}`;
      }
    }

    // Provide default clean /styles.css to override Sandpack's fallback
    if (!formatted['/styles.css'] && !formatted['/src/styles.css']) {
      formatted['/styles.css'] = `body {
  margin: 0;
  padding: 0;
  background-color: #07090e;
  color: #f3f4f6;
  font-family: system-ui, -apple-system, sans-serif;
}`;
    }

    // Configure tsconfig.json for module resolution
    if (!formatted['/tsconfig.json']) {
      formatted['/tsconfig.json'] = JSON.stringify({
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "@/*": ["./src/*", "./*"]
          }
        }
      }, null, 2);
    }

    return formatted;
  }, [files]);

  // Extract third party packages with pinned versions to prevent timeout delays
  const sandpackDependencies = useMemo(() => {
    const deps: Record<string, string> = {
      "lucide-react": "^0.469.0",
      "framer-motion": "^11.15.0",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.6.0"
    };

    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    
    for (const fileContent of Object.values(files)) {
      let match;
      while ((match = importRegex.exec(fileContent)) !== null) {
        const pkgName = match[1];
        if (!pkgName.startsWith('.') && !pkgName.startsWith('/') && !pkgName.startsWith('@/') && !pkgName.startsWith('~/') && pkgName !== 'react' && pkgName !== 'react-dom') {
            const parts = pkgName.split('/');
            const basePkg = pkgName.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
            if (basePkg && !deps[basePkg]) {
              deps[basePkg] = "latest";
            }
        }
      }
    }
    return deps;
  }, [files]);

  return (
    <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-[#090b10]">
      {/* View Mode Switcher Header Bar */}
      <div className="h-8 px-3 bg-[#0d1017] border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
              viewMode === "preview"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview Only</span>
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
              viewMode === "code"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Code Only</span>
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
              viewMode === "split"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Split View</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewKey(k => k + 1)}
            title="Reload Sandbox Preview"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[11px] font-medium text-gray-300 hover:text-white transition-colors border border-white/10"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Sandbox</span>
          </button>

          <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
            {viewMode === "preview" ? "Full-Width Live App View" : viewMode === "code" ? "TypeScript Code Studio" : "Side-by-Side View"}
          </span>
        </div>
      </div>

      <SandpackProvider
        key={previewKey}
        template="react-ts"
        theme="dark"
        files={sandpackFiles}
        customSetup={{
          dependencies: sandpackDependencies
        }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          ],
          classes: {
            "sp-layout": "h-full w-full !border-0 !rounded-none",
            "sp-file-explorer": "bg-[#0d1017] !h-full !max-h-full !overflow-y-auto !overflow-x-auto min-h-0",
            "sp-editor": "border-r border-white/5 h-full font-mono text-xs overflow-y-auto",
            "sp-preview": "bg-[#0a0c10] h-full overflow-y-auto",
          }
        }}
      >
        <SandpackForceUpdater newFiles={sandpackFiles} />
        <SandpackLayout className="h-full w-full flex overflow-hidden">
          {/* File Explorer (Hidden in Preview Only mode) */}
          <div className={`w-52 shrink-0 h-full max-h-full overflow-y-auto overflow-x-auto border-r border-white/5 bg-[#0b0d13] min-h-0 ${viewMode === "preview" ? "hidden" : "flex flex-col"}`}>
            <SandpackFileExplorer autoHiddenFiles style={{ height: "100%", overflowY: "auto" }} />
          </div>

          {/* Code Editor (Hidden in Preview Only mode) */}
          <div className={`flex-1 relative min-w-0 min-h-0 h-full overflow-hidden flex flex-col ${viewMode === "split" ? "border-r border-white/5" : ""} ${viewMode === "preview" ? "hidden" : "flex"}`}>
            <SandpackCodeEditor showTabs={true} showLineNumbers={true} wrapContent={true} style={{ height: "100%" }} />
          </div>

          {/* Live Preview (Kept mounted in DOM, hidden in Code Only mode to prevent unmount white-screen glitches) */}
          <div className={`flex-1 relative min-w-0 min-h-0 h-full overflow-hidden flex flex-col bg-[#090b10] ${viewMode === "code" ? "hidden" : "flex"}`}>
            <SandpackPreview showNavigator={true} showOpenInCodeSandbox={false} showRefreshButton={true} style={{ height: "100%" }} />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

