import { execSync } from 'child_process';

export class DeployAgent {
  /**
   * Deploys a project directory to Vercel and returns the production URL.
   * Uses the Vercel CLI in non-interactive mode.
   */
  async deployToVercel(projectDir: string, projectName?: string): Promise<string> {
    try {
      // 1. Deploy to Vercel (production)
      console.log('     🚀 Deploying to Vercel...');
      
      const nameFlag = projectName ? `--name ${this.slugify(projectName)}` : '';
      
      // First deploy creates the project and gives a preview URL
      const previewUrl = this.run(
        `vercel ${nameFlag} --yes`,
        projectDir
      );
      console.log(`     📋 Preview: ${previewUrl}`);

      // Promote to production
      console.log('     🌐 Promoting to production...');
      const prodUrl = this.run(
        `vercel --prod ${nameFlag} --yes`,
        projectDir
      );

      console.log(`     ✅ Live at: ${prodUrl}`);
      return prodUrl;
    } catch (error: any) {
      console.error(`     ❌ Deployment failed: ${error.message}`);
      
      // If the deployment fails, try a simpler approach
      try {
        console.log('     🔄 Retrying with simpler config...');
        const url = this.run('vercel --yes --prod', projectDir);
        console.log(`     ✅ Live at: ${url}`);
        return url;
      } catch (retryErr: any) {
        throw new Error(`Vercel deployment failed: ${retryErr.message}`);
      }
    }
  }

  /**
   * Checks if a Vercel deployment is accessible by polling the URL.
   */
  async waitForDeployment(url: string, maxWaitMs: number = 60000): Promise<boolean> {
    console.log('     ⏳ Waiting for deployment to go live...');
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok || response.status === 304) {
          console.log('     ✅ Deployment is live!');
          return true;
        }
      } catch (e) {
        // Not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('     ⚠️ Deployment may still be building. Proceeding anyway...');
    return false;
  }

  /**
   * Executes a shell command synchronously.
   */
  private run(command: string, cwd: string): string {
    try {
      return execSync(command, {
        cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 120000, // 2 minutes for deployment
      }).trim();
    } catch (err: any) {
      const stderr = err.stderr?.trim() || err.message;
      throw new Error(`Command failed: ${command}\n${stderr}`);
    }
  }

  /**
   * Converts a name to a URL-safe slug.
   */
  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
