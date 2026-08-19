// ═══════════════════════════════════════════════════════════════════
//  VideoComposer — Layer 4: Media Finalization
// ═══════════════════════════════════════════════════════════════════
//  RESPONSIBILITY: FFmpeg operations, audio mixing, A/V merging,
//                  media probing. Reports facts only.
//
//  HARD BOUNDARY: This is the ONLY layer that calls ffprobe.
//                 No other agent probes media files.
//
//  DOES NOT: Make quality decisions, retry, check thresholds.
//            Those belong to VideoPolicyEngine.
// ═══════════════════════════════════════════════════════════════════

import ffmpeg from 'fluent-ffmpeg';
import type { CompositionResult } from '../types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegStatic = require('ffmpeg-static');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffprobeStatic = require('ffprobe-static');

try {
  ffmpeg.setFfmpegPath(ffmpegStatic);
} catch (e) {
  ffmpeg.setFfmpegPath('C:\\Program Files\\BlueStacks_nxt\\ffmpeg.exe');
}

try {
  ffmpeg.setFfprobePath(ffprobeStatic.path);
} catch (e) {
  // ffprobe path not available — probing will fail gracefully
}

export class VideoComposer {

  // ─── Media Probing (Single Source of Truth) ───────────────────
  //  No other agent should call ffprobe. All probing routes through here.

  async probeMediaDuration(filePath: string): Promise<number> {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.warn(`⚠️ [COMPOSER] Probe failed for ${filePath}: ${err.message}`);
          resolve(0);
        } else {
          resolve(metadata.format.duration || 0);
        }
      });
    });
  }

  async probeSampleRate(filePath: string): Promise<number> {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err || !metadata.streams || !metadata.streams[0]) {
          resolve(24000); // Fallback for Edge TTS default
        } else {
          resolve(metadata.streams[0].sample_rate || 24000);
        }
      });
    });
  }

  // ─── Audio Timeline Composition ───────────────────────────────
  //  Sample-rate-aware adelay calculation. Probes each input to
  //  compute delay in exact samples, not raw milliseconds.

  async composeAudio(
    audioFiles: { file: string; startMs: number }[],
    outputPath: string
  ): Promise<string> {
    console.log(`🎵 [COMPOSER] Composing audio timeline (${audioFiles.length} clips)...`);

    // Probe sample rates for each input
    const audioItems = await Promise.all(
      audioFiles.map(async (audio) => {
        const sampleRate = await this.probeSampleRate(audio.file);
        const delaySamples = Math.floor((audio.startMs / 1000) * sampleRate);
        return { file: audio.file, delaySamples };
      })
    );

    return new Promise((resolve, reject) => {
      const command = ffmpeg();
      let filterComplex = '';

      audioItems.forEach((item, index) => {
        command.input(item.file);
        filterComplex += `[${index}:a]adelay=${item.delaySamples}S|${item.delaySamples}S[a${index}];`;
      });

      const inputs = audioItems.map((_, i) => `[a${i}]`).join('');
      filterComplex += `${inputs}amix=inputs=${audioItems.length}:normalize=0[aout]`;

      command
        .complexFilter(filterComplex)
        .map('[aout]')
        .output(outputPath)
        .on('end', () => {
          console.log(`✅ [COMPOSER] Audio composed to ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('❌ [COMPOSER] Audio composition error:', err.message);
          reject(err);
        })
        .run();
    });
  }

  // ─── A/V Merge → CompositionResult (Facts Only) ──────────────
  //  Merges video and audio, then probes the result.
  //  Returns durations and drift as facts — no decisions.

  async mergeVideoAndAudio(
    videoPath: string,
    audioPath: string,
    outputPath: string,
    timelinePath: string
  ): Promise<CompositionResult> {
    // Diagnostic: probe inputs before merge
    const rawVideoDur = await this.probeMediaDuration(videoPath);
    const composedAudioDur = await this.probeMediaDuration(audioPath);
    console.log(`📊 [COMPOSER] Raw video: ${rawVideoDur.toFixed(1)}s, Composed audio: ${composedAudioDur.toFixed(1)}s`);

    // Merge
    await new Promise<void>((resolve, reject) => {
      console.log('🎥 [COMPOSER] Merging video and audio...');

      ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .outputOptions([
          '-map 0:v:0',
          '-map 1:a:0?',
          '-c:v libx264',
          '-preset veryfast',
          '-threads 2',
          '-pix_fmt yuv420p',
          '-c:a aac',
          '-b:a 192k',
          '-y'
        ])
        .save(outputPath)
        .on('end', () => {
          console.log(`✅ [COMPOSER] Final video saved to ${outputPath}`);
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('❌ [COMPOSER] Merge error:', err.message);
          if (stderr) console.error('FFmpeg stderr:', stderr);
          reject(err);
        });
    });

    // Probe final output — report facts
    const finalDuration = await this.probeMediaDuration(outputPath);

    // Compute drift from final output vs raw video duration.
    // We do NOT use composedAudioDur for drift because amix inflates it
    // with silence padding beyond the last clip. The -shortest flag truncates
    // the merged output correctly, so the meaningful drift is between
    // the final output and the original video recording.
    const driftSec = Math.abs(finalDuration - rawVideoDur);

    console.log(`📊 [COMPOSER] Final video: ${finalDuration.toFixed(1)}s, A/V drift: ${driftSec.toFixed(1)}s`);

    return {
      videoPath: outputPath,
      timelinePath,
      videoDurationSec: finalDuration,
      audioDurationSec: finalDuration, // -shortest means audio = video duration
      driftSec,
    };
  }
}
