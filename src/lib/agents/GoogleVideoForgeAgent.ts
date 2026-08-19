import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import { EdgeTTS } from 'node-edge-tts';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfprobePath(ffprobeStatic.path);

export interface GoogleTtsConfig {
  voiceName?: string;
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export class GoogleVideoForgeAgent {
  private apiKey: string;
  private voiceName: string;
  private languageCode: string;
  private speakingRate: number;
  private pitch: number;
  private maxRetries: number;
  private retryDelayMs: number;

  constructor(options?: GoogleTtsConfig) {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.voiceName = options?.voiceName ?? 'en-US-Journey-F'; // Cinematic premium Journey voice
    this.languageCode = options?.languageCode ?? 'en-US';
    this.speakingRate = options?.speakingRate ?? 1.0;
    this.pitch = options?.pitch ?? 0.0;
    this.maxRetries = options?.maxRetries ?? 3;
    this.retryDelayMs = options?.retryDelayMs ?? 3000;

    if (!this.apiKey) {
      console.warn('⚠️ [GoogleVideoForgeAgent] No GOOGLE_API_KEY found in process.env. TTS might fail.');
    }
  }

  /**
   * Sanitizes forbidden words in narration text to maintain compliance policies.
   */
  sanitizeText(text: string, prohibitedTokens: string[]): string {
    let cleaned = text;

    for (const token of prohibitedTokens) {
      const pattern = new RegExp(`\\b${token.split('').join('-?')}\\b`, 'gi');
      cleaned = cleaned.replace(pattern, (match) => {
        if (match.toLowerCase().includes('ty')) {
          return 'autonomy';
        }
        return 'autonomous';
      });
    }

    cleaned = cleaned.replace(/\bsovereign-grade\b/gi, 'enterprise-grade');
    cleaned = cleaned.replace(/\bsovereignty-based\b/gi, 'autonomy-based');

    return cleaned;
  }

  /**
   * Generates highly natural voiceover audio using Google Cloud Text-to-Speech REST API.
   * Leverages simple API key authorization for zero-setup execution.
   */
  async generateAudio(
    text: string,
    outputPath: string,
    prohibitedTokens: string[] = []
  ): Promise<{ filePath: string; duration: number }> {
    const sanitized = prohibitedTokens.length > 0
      ? this.sanitizeText(text, prohibitedTokens)
      : text;

    const requestBody = {
      input: { text: sanitized },
      voice: {
        languageCode: this.languageCode,
        name: this.voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: this.speakingRate,
        pitch: this.pitch
      }
    };

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;
    let attempts = this.maxRetries;
    let base64Audio = '';

    while (attempts > 0) {
      try {
        const response = await axios.post(url, requestBody, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.audioContent) {
          base64Audio = response.data.audioContent;
          break;
        } else {
          throw new Error('Invalid response structure from Google TTS API');
        }
      } catch (err: any) {
        attempts--;
        const status = err.response?.status;
        const errMsg = err.response?.data?.error?.message || err.message || 'Unknown network error';
        
        console.warn(
          `   ⚠️ Google TTS API synthesis failed (Status: ${status}), retrying... (${attempts} left). Error: ${errMsg}`
        );

        if (attempts === 0) {
          console.warn(`   🚨 Google TTS API is unavailable or disabled. Falling back to high-fidelity EdgeTTS voice for continuity...`);
          try {
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            const fallbackTts = new EdgeTTS({ voice: 'en-US-AvaNeural' });
            await fallbackTts.ttsPromise(sanitized, outputPath);
            const durationSeconds = await this.getAudioDuration(outputPath);
            return { filePath: outputPath, duration: Math.ceil(durationSeconds * 1000) };
          } catch (fallbackErr: any) {
            throw new Error(`Google TTS API failed (${errMsg}), and fallback EdgeTTS also failed. Details: ${fallbackErr.message || fallbackErr}`);
          }
        }
        
        await new Promise((r) => setTimeout(r, this.retryDelayMs));
      }
    }

    // Ensure parent directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write binary MP3 file
    const buffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(outputPath, buffer);

    const durationSeconds = await this.getAudioDuration(outputPath);
    return { filePath: outputPath, duration: Math.ceil(durationSeconds * 1000) };
  }

  /**
   * Measures the duration of the generated audio chunk using ffprobe.
   */
  private getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });
  }
}
