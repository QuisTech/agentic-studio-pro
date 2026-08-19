export class GithubAnalystAgent {
  /**
   * Fetches the README content for a given GitHub repository URL.
   * Works with standard GitHub URLs like https://github.com/owner/repo
   */
  async fetchRepoContext(githubUrl: string): Promise<string> {
    try {
      console.log(`🔍 Analyzing GitHub Repository: ${githubUrl}`);
      
      const urlObj = new URL(githubUrl);
      const parts = urlObj.pathname.split('/').filter(Boolean);
      
      if (parts.length < 2) {
        throw new Error('Invalid GitHub URL format');
      }

      const owner = parts[0];
      const repo = parts[1];
      
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'DemoForge-AI'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
      }

      const readmeContent = await response.text();
      console.log(`✅ Extracted README (${readmeContent.length} chars)`);
      return readmeContent;
    } catch (error: any) {
      console.error('❌ Failed to fetch GitHub context:', error.message);
      return 'No repository context available.';
    }
  }
}
