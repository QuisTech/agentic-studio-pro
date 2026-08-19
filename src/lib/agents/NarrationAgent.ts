// ═══════════════════════════════════════════════════════════════════
//  NarrationAgent — Layer 3: TTS Engine
// ═══════════════════════════════════════════════════════════════════
//  RESPONSIBILITY: Speech synthesis, text sanitization,
//                  audio duration probing (delegates to VideoComposer
//                  for centralized probing, but has local ffprobe for
//                  TTS audio duration — lightweight, single-file).
//
//  OWNS: TTS retry logic (network resilience = TTS concern)
//        Vocabulary sanitization (text preprocessing = narration concern)
//
//  DOES NOT OWN: Video concerns, pipeline-level retry,
//                drift analysis, media composition.
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { EdgeTTS } from 'node-edge-tts';

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ffprobeStatic = require('ffprobe-static');
  if (ffprobeStatic && typeof ffprobeStatic.path === 'string') {
    ffmpeg.setFfprobePath(ffprobeStatic.path);
  }
} catch (e) {
  // Ignore missing or null ffprobe-static path
}

export class NarrationAgent {
  private outputDir: string;
  private tts: EdgeTTS;
  private maxTtsRetries: number;
  private retryDelayMs: number;

  constructor(
    outputDir: string,
    options?: {
      maxTtsRetries?: number;
      retryDelayMs?: number;
    }
  ) {
    this.outputDir = outputDir;
    this.maxTtsRetries = options?.maxTtsRetries ?? 3;
    this.retryDelayMs = options?.retryDelayMs ?? 3000;

    // Using Microsoft's modern natural Ava voice
    this.tts = new EdgeTTS({
      voice: 'en-US-AvaNeural',
    });

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // ─── Text Sanitization ────────────────────────────────────────
  //  Strips prohibited tokens from narration text.
  //  Vocabulary policy comes from VideoTimeline.metadata.prohibitedTokens.

  sanitizeText(text: string, prohibitedTokens: string[]): string {
    let cleaned = text;

    for (const token of prohibitedTokens) {
      // Build a regex that matches the token with optional hyphens between chars
      const pattern = new RegExp(`\\b${token.split('').join('-?')}\\b`, 'gi');
      cleaned = cleaned.replace(pattern, (match) => {
        // Sovereignty-class words → autonomy
        if (match.toLowerCase().includes('ty')) {
          return 'autonomy';
        }
        // Sovereign-class words → autonomous
        return 'autonomous';
      });
    }

    // Extra checks for compound hyphenated forms
    cleaned = cleaned.replace(/\bsovereign-grade\b/gi, 'enterprise-grade');
    cleaned = cleaned.replace(/\bsovereignty-based\b/gi, 'autonomy-based');

    return cleaned;
  }

  // ─── TTS Synthesis with Retry ─────────────────────────────────
  //  3-attempt retry loop for transient network failures.
  //  This is TTS-level resilience, not pipeline-level retry.

  async generateAudio(
    text: string,
    index: number,
    prohibitedTokens: string[] = []
  ): Promise<{ filePath: string; duration: number }> {
    const sanitized = prohibitedTokens.length > 0
      ? this.sanitizeText(text, prohibitedTokens)
      : text;

    const filePath = path.join(this.outputDir, `audio_${index}.mp3`);

    let attempts = this.maxTtsRetries;
    while (attempts > 0) {
      try {
        await this.tts.ttsPromise(sanitized, filePath);
        break;
      } catch (err: any) {
        attempts--;
        const errMsg = (err && err.message) || String(err) || 'Unknown TTS error';
        console.warn(
          `   ⚠️ TTS synthesis failed for chunk ${index}, retrying... (${attempts} left). Error: ${errMsg}`
        );
        if (attempts === 0) throw err;
        await new Promise((r) => setTimeout(r, this.retryDelayMs));
      }
    }

    const durationSeconds = await this.getAudioDuration(filePath);
    return { filePath, duration: Math.ceil(durationSeconds * 1000) };
  }

  // Alias for direct synthesis without retry index tracking
  async narrate(text: string, filePath: string): Promise<void> {
    let attempts = this.maxTtsRetries;
    while (attempts > 0) {
      try {
        await this.tts.ttsPromise(text, filePath);
        return;
      } catch (err: any) {
        attempts--;
        if (attempts === 0) throw err;
        await new Promise((r) => setTimeout(r, this.retryDelayMs));
      }
    }
  }

  // ─── Audio Duration Probing ───────────────────────────────────
  //  Lightweight, single-file probing for TTS output duration.

  private getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });
  }

  // ─── Audio Timeline Composition (delegated to VideoComposer) ─
  //  Preserved for backward compatibility. In the new architecture,
  //  audio composition is handled by VideoComposer.

  async composeAudioTimeline(
    timeline: { file: string; startMs: number }[],
    outputPath: string
  ): Promise<void> {
    console.log(`   🎼 Composing audio timeline with ${timeline.length} clips...`);
    const command = ffmpeg();

    timeline.forEach((entry) => command.input(entry.file));

    const filter =
      timeline
        .map((entry, i) => {
          return `[${i}:a]adelay=${Math.floor(entry.startMs)}|${Math.floor(entry.startMs)}[a${i}]`;
        })
        .join(';') +
      ';' +
      timeline.map((_, i) => `[a${i}]`).join('') +
      `amix=inputs=${timeline.length}:dropout_transition=0[out]`;

    return new Promise((resolve, reject) => {
      command
        .complexFilter(filter, 'out')
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // ─── A/V Merge (legacy, prefer VideoComposer.mergeVideoAndAudio) ─

  async mergeVideoAudio(
    videoPath: string,
    audioPath: string,
    outputPath: string
  ): Promise<void> {
    console.log(`   🎥 Finalizing cinematic merge...`);
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .input(audioPath)
        .outputOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
