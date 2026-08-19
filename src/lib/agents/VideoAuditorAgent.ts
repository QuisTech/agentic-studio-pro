import fs from 'fs';
import path from 'path';

export class VideoAuditorAgent {
  constructor(apiKey?: string) {
    // API key not needed for the mock version
  }

  /**
   * Mocks auditing a generated video.
   */
  async auditVideo(videoPath: string, hackathonRules: string): Promise<string> {
    try {
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found for audit at: ${videoPath}`);
      }

      const fileSizeMB = fs.statSync(videoPath).size / (1024 * 1024);
      console.log(`📦 Mock analyzing video (${fileSizeMB.toFixed(1)} MB): ${path.basename(videoPath)}...`);

      // Mocked delay to simulate analysis
      await new Promise(r => setTimeout(r, 2000));

      return `
# HACKATHON DEMO VIDEO AUDIT REPORT (MOCK)

## 1. Compliance Scorecard
*   **Video Duration Check:** [Pass] - Video length is within typical limits.
*   **Technical Content Verification:** [Pass] - Core technology appears to be demonstrated.
*   **A/V Sync and Drift Assessment:** [Pass] - Narration sync is acceptable.
*   **Branding & Intellectual Property Check:** [Pass] - No obvious violations detected.

## 2. Minute-by-Minute Timeline Review
*   0:00 - 0:15 Intro and Title Screen
*   0:15 - 1:00 Core Feature Demonstration
*   1:00 - 1:30 Final Polish and CTA

## 3. Critical Recommendations
*   Video pacing is acceptable. No critical adjustments needed.
      `.trim();
    } catch (err: any) {
      console.error('❌ [VideoAuditorAgent] Mock audit failed:', err);
      return `### Video Audit Blocked\nAn error occurred during video processing: ${err.message}`;
    }
  }

  /**
   * Mocks generating a clean .vtt subtitle file.
   */
  async generateSubtitles(videoPath: string): Promise<string> {
    try {
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found for subtitles at: ${videoPath}`);
      }

      // Mocked delay
      await new Promise(r => setTimeout(r, 1000));

      return `WEBVTT

00:00:00.000 --> 00:00:05.000
[Auto-generated mock subtitles: Demonstration starting...]

00:00:05.000 --> 00:00:10.000
[Auto-generated mock subtitles: Please see the video for visual context.]`;
    } catch (err: any) {
      console.error('❌ [VideoAuditorAgent] Mock subtitle generation failed:', err);
      return `WEBVTT\n\n00:00:00.000 --> 00:00:05.000\n[Transcribing failed: ${err.message}]`;
    }
  }
}
