import JSZip from "jszip";

export function extractProjectName(files: Record<string, string>): string {
  const sanitizeName = (str: string): string => {
    return str
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  // 1. Check DEVPOST.md or README.md first (highest reliability for exact app name)
  for (const docKey of ["DEVPOST.md", "README.md", "devpost.md", "readme.md"]) {
    if (files[docKey]) {
      const headingMatch = files[docKey].match(/^#\s+([A-Za-z0-9_\-\s]+)/m) 
        || files[docKey].match(/What's next for\s+([A-Za-z0-9_\-\s]+)/i);
      if (headingMatch && headingMatch[1]) {
        const name = headingMatch[1].trim();
        if (name && !name.toLowerCase().includes("agentic studio") && name !== "Project") {
          return sanitizeName(name);
        }
      }
    }
  }

  // 2. Check App.tsx header or canvas title
  if (files["App.tsx"]) {
    const h1Match = files["App.tsx"].match(/<h1[^>]*>\s*([^<•]+?)(?:\s*•|\s*<\/h1>)/i)
      || files["App.tsx"].match(/title:\s*["']([^"']+)["']/i);
    if (h1Match && h1Match[1]) {
      const name = h1Match[1].trim();
      if (name && !name.toLowerCase().includes("agentic studio")) {
        return sanitizeName(name);
      }
    }
  }

  // 3. Check package.json
  if (files["package.json"]) {
    try {
      const pkg = JSON.parse(files["package.json"]);
      if (pkg.name && pkg.name !== "agentic-studio" && pkg.name !== "agentic-generated-code") {
        return sanitizeName(pkg.name);
      }
    } catch {}
  }

  // 4. Check pubspec.yaml (Flutter)
  if (files["pubspec.yaml"]) {
    const nameMatch = files["pubspec.yaml"].match(/name:\s*([a-zA-Z0-9_]+)/);
    if (nameMatch && nameMatch[1]) return sanitizeName(nameMatch[1]);
  }

  // 5. Check Cargo.toml (Rust)
  if (files["Cargo.toml"]) {
    const nameMatch = files["Cargo.toml"].match(/name\s*=\s*["']([^"']+)["']/);
    if (nameMatch && nameMatch[1]) return sanitizeName(nameMatch[1]);
  }

  // 6. Check go.mod (Go)
  if (files["go.mod"]) {
    const nameMatch = files["go.mod"].match(/module\s+([a-zA-Z0-9_/-]+)/);
    if (nameMatch && nameMatch[1]) {
      const parts = nameMatch[1].split("/");
      return sanitizeName(parts[parts.length - 1]);
    }
  }

  // 7. Check Swift app files in ios/
  for (const k of Object.keys(files)) {
    if (k.startsWith("ios/") && k.endsWith("App.swift")) {
      const appName = k.replace("ios/", "").replace("App.swift", "");
      if (appName) return sanitizeName(appName);
    }
  }

  return "agentic-project";
}

export async function downloadProjectAsZip(files: Record<string, string>, customName?: string) {
  const zip = new JSZip();
  const projectName = customName || extractProjectName(files);

  // Add files to the zip
  Object.entries(files).forEach(([filename, content]) => {
    zip.file(filename, content);
  });

  // Generate the zip file
  const blob = await zip.generateAsync({ type: "blob" });
  
  // Trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName}.zip`;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
