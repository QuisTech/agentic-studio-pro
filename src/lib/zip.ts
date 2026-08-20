import JSZip from "jszip";

export function extractProjectName(files: Record<string, string>): string {
  // 1. Try App.tsx workspaceTitle or title regex
  if (files["App.tsx"]) {
    const titleMatch = files["App.tsx"].match(/workspaceTitle:\s*["']([^"']+)["']/i)
      || files["App.tsx"].match(/const\s+cleanDomainName\s*=\s*["']([^"']+)["']/i);
    if (titleMatch && titleMatch[1]) {
      const name = titleMatch[1].replace(/•.*/, '').replace(/Production Canvas.*/, '').trim();
      if (name && name !== "Agentic Studio") {
        return name.replace(/[^a-zA-Z0-9_-]/g, '-');
      }
    }
  }

  // 2. Try package.json
  if (files["package.json"]) {
    try {
      const pkg = JSON.parse(files["package.json"]);
      if (pkg.name && pkg.name !== "agentic-studio") {
        return pkg.name;
      }
    } catch {}
  }

  // 3. Try pubspec.yaml (Flutter)
  if (files["pubspec.yaml"]) {
    const nameMatch = files["pubspec.yaml"].match(/name:\s*([a-zA-Z0-9_]+)/);
    if (nameMatch && nameMatch[1]) return nameMatch[1];
  }

  // 4. Try Cargo.toml (Rust)
  if (files["Cargo.toml"]) {
    const nameMatch = files["Cargo.toml"].match(/name\s*=\s*["']([^"']+)["']/);
    if (nameMatch && nameMatch[1]) return nameMatch[1];
  }

  // 5. Try go.mod (Go)
  if (files["go.mod"]) {
    const nameMatch = files["go.mod"].match(/module\s+([a-zA-Z0-9_/-]+)/);
    if (nameMatch && nameMatch[1]) {
      const parts = nameMatch[1].split("/");
      return parts[parts.length - 1];
    }
  }

  return "agentic-project";
}

export async function downloadProjectAsZip(files: Record<string, string>, customName?: string) {
  const zip = new JSZip();
  const projectName = customName || `${extractProjectName(files)}-code`;

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
