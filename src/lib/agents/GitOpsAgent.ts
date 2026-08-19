import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export class GitOpsAgent {
  /**
   * Initializes a git repo, commits all files, creates a GitHub repo, and pushes.
   * Returns the GitHub repository URL.
   */
  async publishToGitHub(
    projectDir: string,
    projectName: string,
    description: string,
    isPublic: boolean = true
  ): Promise<string> {
    const slug = this.slugify(projectName);
    const visibility = isPublic ? '--public' : '--private';

    try {
      // 1. Initialize git repo
      console.log('     📂 Initializing git repository...');
      this.run('git init', projectDir);
      this.run('git branch -M main', projectDir);

      // 2. Create .gitignore if it doesn't exist
      const gitignorePath = path.join(projectDir, '.gitignore');
      if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, 'node_modules/\n.next/\ndist/\n.env\n.env.local\n');
      }

      // 3. Stage and commit
      console.log('     📝 Staging and committing...');
      this.run('git add -A', projectDir);
      this.run('git commit -m "Initial commit — scaffolded by Agents Assemble 🦸"', projectDir);

      // 4. Create GitHub repo using gh CLI
      console.log(`     🐙 Creating GitHub repo: ${slug}...`);
      const createOutput = this.run(
        `gh repo create ${slug} ${visibility} --description "${description.replace(/"/g, '\\"')}" --source . --push --remote origin`,
        projectDir
      );

      // 5. Extract the repo URL
      const repoUrl = `https://github.com/QuisTech/${slug}`;
      console.log(`     ✅ Published: ${repoUrl}`);
      
      return repoUrl;
    } catch (error: any) {
      // If repo already exists, try to push to it anyway
      if (error.message?.includes('already exists')) {
        console.log(`     ⚠️ Repo "${slug}" already exists. Pushing to existing repo...`);
        try {
          this.run(`git remote add origin https://github.com/QuisTech/${slug}.git`, projectDir);
        } catch (e) {
          // Remote might already exist
          this.run(`git remote set-url origin https://github.com/QuisTech/${slug}.git`, projectDir);
        }
        this.run('git push -u origin main --force', projectDir);
        const repoUrl = `https://github.com/QuisTech/${slug}`;
        console.log(`     ✅ Pushed to: ${repoUrl}`);
        return repoUrl;
      }
      throw error;
    }
  }

  /**
   * Executes a shell command synchronously in the given directory.
   */
  private run(command: string, cwd: string): string {
    try {
      return execSync(command, {
        cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 30000,
      }).trim();
    } catch (err: any) {
      const stderr = err.stderr?.trim() || err.message;
      if (command.includes('git commit')) {
        console.log('     ℹ️  Proceeding (Git commit likely already completed or nothing to change).');
        return '';
      }
      throw new Error(`Command failed: ${command}\n${stderr}`);
    }
  }

  /**
   * Converts a project name to a URL-safe slug.
   */
  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
