/**
 * DevpostScraperAgent
 * 
 * Scrapes a Devpost hackathon page and extracts the full context:
 * theme, sponsors, judging criteria, requirements, prizes, etc.
 * 
 * This allows users to simply pass a Devpost URL instead of
 * manually copying the hackathon rules into a text file.
 */
export class DevpostScraperAgent {
  /**
   * Detects if a string is a Devpost hackathon URL.
   */
  static isDevpostUrl(input: string): boolean {
    return input.includes('devpost.com') && (
      input.startsWith('http://') || input.startsWith('https://')
    );
  }

  /**
   * Scrapes a Devpost hackathon page and returns the raw text content
   * containing the overview, rules, judging criteria, prizes, etc.
   */
  async scrapeHackathon(devpostUrl: string): Promise<string> {
    console.log(`  🌐 Scraping hackathon page: ${devpostUrl}`);

    // Normalize the URL (remove trailing slash)
    const baseUrl = devpostUrl.replace(/\/$/, '');

    // Fetch the main overview page + rules page in parallel
    const [overviewText, rulesText] = await Promise.all([
      this.fetchPageText(baseUrl),
      this.fetchPageText(`${baseUrl}/rules`).catch(() => ''),
    ]);

    // Combine and clean
    const combined = this.cleanDevpostContent(overviewText, rulesText);
    console.log(`  ✅ Scraped hackathon content (${combined.length} chars)`);

    return combined;
  }

  /**
   * Fetches a URL and returns the text content (HTML stripped).
   */
  private async fetchPageText(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return this.htmlToText(html);
    } catch (err: any) {
      console.log(`  ⚠️ Could not fetch ${url}: ${err.message}`);
      return '';
    }
  }

  /**
   * Strips HTML tags and extracts readable text content.
   * Focuses on the main content area of Devpost pages.
   */
  private htmlToText(html: string): string {
    // Remove script and style tags entirely
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '');

    // Replace common HTML entities
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#x200B;/g, '');

    // Convert headers to readable format
    text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n## $1\n');

    // Convert list items
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');

    // Convert links to readable format (keep text)
    text = text.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');

    // Strip remaining HTML tags
    text = text.replace(/<[^>]+>/g, ' ');

    // Clean up whitespace
    text = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return text;
  }

  /**
   * Combines overview and rules pages, removing Devpost navigation boilerplate
   * and extracting only the hackathon-specific content.
   */
  private cleanDevpostContent(overview: string, rules: string): string {
    let content = '';

    content += '=== HACKATHON OVERVIEW ===\n\n';
    content += this.extractMainContent(overview);
    
    if (rules) {
      content += '\n\n=== HACKATHON RULES ===\n\n';
      content += this.extractMainContent(rules);
    }

    // Truncate to avoid token limits (keep first 8000 chars — more than enough)
    if (content.length > 8000) {
      content = content.substring(0, 8000) + '\n\n[Content truncated for processing]';
    }

    return content;
  }

  /**
   * Extracts the main hackathon content, skipping Devpost navigation.
   */
  private extractMainContent(text: string): string {
    // Try to find where the actual content starts
    // Devpost pages have a lot of navigation before the meat
    const markers = [
      'Welcome to', 'What to Build', 'Requirements', 'Prizes',
      'Judging Criteria', 'Who can participate', 'Build with',
      '## Requirements', '## Prizes', '## Judges'
    ];

    let startIdx = 0;
    for (const marker of markers) {
      const idx = text.indexOf(marker);
      if (idx !== -1 && (startIdx === 0 || idx < startIdx)) {
        // Go back a bit to capture headers
        startIdx = Math.max(0, idx - 100);
        break;
      }
    }

    return text.substring(startIdx).trim();
  }
}
