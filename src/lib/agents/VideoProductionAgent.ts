import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import ffmpeg from 'fluent-ffmpeg';
import { GoogleVideoForgeAgent } from './GoogleVideoForgeAgent';
import { spawn, execSync } from 'child_process';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegStatic = require('ffmpeg-static');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

export interface VideoSceneSpec {
  id: string;
  name: string;
  route?: string;
  duration?: number; // populated programmatically from audio
  narrationText: string;
  cursorSelector?: string; // Optional precise DOM selector for visual cursor hover
  actionScript?: string; // Optional javascript to evaluate before taking the screenshot
  engine?: 'playwright' | 'remotion'; // Determines which pipeline renders this scene
  // Advanced metadata for future engine use
  musicTrack?: string;
  animationPreset?: string;
  quality?: string;
  cameraZoom?: number;
  screenshotQuality?: string;
  waitForNetworkIdle?: boolean;
  cameraMovement?: string;
  transitionEffect?: string;
  highlightElements?: string[];
  waitForAnimations?: boolean;
  ctaButton?: { text: string; url: string; position: string };
}

export interface VideoProductionConfig {
  projectUrl: string;
  scenes: VideoSceneSpec[];
  outputDir: string;
  outputFileName: string;
  qualityPreset?: any;
  retryPolicy?: any;
  timeout?: number;
  errorHandling?: string;
}

export class VideoProductionAgent {
  private config: VideoProductionConfig;
  private ttsAgent: GoogleVideoForgeAgent;

  constructor(config: VideoProductionConfig) {
    this.config = config;
    this.ttsAgent = new GoogleVideoForgeAgent();
  }

  /**
   * Orchestrates the entire Frame-to-Video production pipeline deterministically.
   */
  async produceVideo(): Promise<string> {
    console.log(`🎬 [VideoProductionAgent] Starting video production for AegisMCP...`);

    const tempDir = path.join(this.config.outputDir, 'temp_production');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    const clipsList: string[] = [];

    try {
      // 1. Synthesize Narration Tracks and Measure Durations
      console.log(`🗣️ [VideoProductionAgent] Synthesizing premium narration audio tracks...`);
      for (let i = 0; i < this.config.scenes.length; i++) {
        const scene = this.config.scenes[i];
        const audioPath = path.join(tempDir, `audio_${scene.id}.mp3`);
        
        console.log(`   🎤 Synthesizing audio for scene: ${scene.id}...`);
        const result = await this.ttsAgent.generateAudio(
          scene.narrationText, 
          audioPath, 
          ["sovereign", "sovereignty"]
        );

        scene.duration = result.duration; // Store duration in ms
        console.log(`   ✅ Audio duration: ${(result.duration / 1000).toFixed(2)}s`);
      }

      // 2. Playwright Headless Scene Navigation & High-Fidelity Capture
      console.log(`🌐 [VideoProductionAgent] Driving browser via Playwright scene controller...`);
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 } // High-Fidelity 1080p
      });
      const page = await context.newPage();

      // Navigate to entry point
      console.log(`   🌐 Navigating to entry target: ${this.config.projectUrl}`);
      await page.goto(this.config.projectUrl, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForTimeout(2000);

      // Extract screenshots for each scene by invoking window.startScene
      for (let i = 0; i < this.config.scenes.length; i++) {
        const scene = this.config.scenes[i];
        console.log(`   🎬 Transitioning UI to scene: ${scene.id} ("${scene.name}")...`);
        
        if (scene.route) {
          console.log(`   📍 Navigating to route: ${scene.route}`);
          await page.goto(this.config.projectUrl + scene.route, { waitUntil: 'networkidle', timeout: 90000 });
        }
        
        // Evaluate window.startScene(id) and emit frame-accurate beat-drop event
        try {
          await page.evaluate((id) => {
            if ((window as any).startScene) {
              (window as any).startScene(id);
              // Dispatch beat-drop custom event that CSS/JS overlays can key off
              window.dispatchEvent(new CustomEvent('beat-drop', { 
                detail: { 
                  timestamp: Date.now(), 
                  sceneId: id,
                  frame: (window as any).currentFrame || 0
                } 
              }));
            } else {
              console.error('window.startScene is not defined on the frontend!');
            }
          }, scene.id);
        } catch (err: any) {
          if (err.message.includes('Execution context was destroyed') || err.message.includes('navigation')) {
            console.log(`   ⚠️ [Playwright] Navigation / context destroyed during page.evaluate for scene ${scene.id}, continuing to stabilization...`);
          } else {
            throw err;
          }
        }

        // Stabilize visual layout / let Next.js compile and Framer Motion settle
        let stabilizationDelay = 2500;
        if (scene.id === 'incident-analysis') {
          stabilizationDelay = 6500;
        } else if (scene.id === 'dashboard-initial' || scene.id === 'incident-select') {
          stabilizationDelay = 8500; // Let Turbopack completely compile new routes safely
        } else if (scene.id === 'sandbox-dryrun') {
          stabilizationDelay = 5000; // Allow scroll-to-sandbox animation to complete
        }
        await page.waitForTimeout(stabilizationDelay);

        if (scene.actionScript) {
          console.log(`   ⚙️ Executing DOM action script for scene ${scene.id}...`);
          try {
            await page.evaluate(scene.actionScript);
            await page.waitForTimeout(1500); // Wait for modals and tabs to animate
          } catch (e: any) {
            console.warn(`   ⚠️ [Playwright] actionScript execution failed:`, e.message);
          }
        }

        // Inject high-fidelity red visual pointer representing mouse focus and apply Premium Glowing Outline
        await page.evaluate(({ id, selector }) => {
          // Remove old glows if present
          const oldGlows = document.querySelectorAll('.glow-focused-element');
          oldGlows.forEach(el => {
            el.classList.remove('glow-focused-element');
            (el as any).style.boxShadow = '';
            (el as any).style.border = '';
          });

          let target = null;
          if (selector) {
            target = document.querySelector(selector);
          }

          if (target && (window as any).activeSceneId === id) {
            // Apply Dynamic Orbiting Gradient Outline Styles (Concept B)
            target.style.position = 'relative';
            target.style.transition = 'all 0.6s ease-in-out';
            
            let glowStyle = document.getElementById('production-glow-style');
            if (!glowStyle) {
              glowStyle = document.createElement('style');
              glowStyle.id = 'production-glow-style';
              glowStyle.innerHTML = `
                @keyframes rotateGlowBorder {
                  0% { border-color: #06b6d4; box-shadow: 0 0 25px rgba(6, 182, 212, 0.5); }
                  50% { border-color: #10b981; box-shadow: 0 0 25px rgba(16, 185, 129, 0.5); }
                  100% { border-color: #06b6d4; box-shadow: 0 0 25px rgba(6, 182, 212, 0.5); }
                }
                .glow-focused-element {
                  border: 3px solid #06b6d4 !important;
                  animation: rotateGlowBorder 3s linear infinite !important;
                }
              `;
              document.head.appendChild(glowStyle);
            }
            target.classList.add('glow-focused-element');

            let cursor = document.getElementById('production-visual-cursor');
            if (!cursor) {
              cursor = document.createElement('div');
              cursor.id = 'production-visual-cursor';
              Object.assign(cursor.style, {
                position: 'fixed',
                width: '28px',
                height: '28px',
                backgroundColor: 'rgba(239, 68, 68, 0.75)', // Red premium visual indicator
                border: '3px solid white',
                borderRadius: '50%',
                zIndex: '999999',
                pointerEvents: 'none',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
              });
              document.body.appendChild(cursor);
            }

            // Get target center coordinates relative to viewport
            const rect = target.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
            cursor.style.display = 'block';
          } else {
            const cursor = document.getElementById('production-visual-cursor');
            if (cursor) cursor.style.display = 'none';
          }
        }, { id: scene.id, selector: scene.cursorSelector });

        await page.waitForTimeout(1000); // Let visual cursor center

        const imagePath = path.join(tempDir, `frame_${scene.id}.png`);
        console.log(`   📸 Capturing 1080p frame: frame_${scene.id}.png`);
        await page.screenshot({ path: imagePath, fullPage: false });
      }

      await page.close();
      await context.close();
      await browser.close();

      // 3. Programmatic Video Encoding and Cinematic Zooming (Ken Burns Effect + Ambient sound)
      console.log(`🎼 [VideoProductionAgent] Compiling sub-clips programmatically using Hybrid Multi-Engine...`);
      let cumulativeTimeMs = 0;
      let currentRemotionFrame = 0;
      
      for (let i = 0; i < this.config.scenes.length; i++) {
        const scene = this.config.scenes[i];
        const imagePath = path.join(tempDir, `frame_${scene.id}.png`);
        const audioPath = path.join(tempDir, `audio_${scene.id}.mp3`);
        const clipPath = path.join(tempDir, `clip_${scene.id}.mp4`);
        const ambientAudioPath = 'C:\\Users\\Administrator\\Downloads\\Agents Assemble\\src\\resources\\background_ambient.wav';

        const durationSeconds = (scene.duration || 1000) / 1000;
        const frameCount = Math.ceil(durationSeconds * 60);
        const startFrame = currentRemotionFrame;
        const endFrame = currentRemotionFrame + frameCount - 1;
        currentRemotionFrame += frameCount;

        const seekOffsetSec = cumulativeTimeMs / 1000;
        cumulativeTimeMs += (scene.duration || 0);

        console.log(`   🎥 Rendering scene clip: ${scene.id} (${durationSeconds.toFixed(1)}s) [Engine: ${scene.engine || 'playwright'}]...`);

        if (scene.engine === 'remotion') {
          const remotionRawPath = path.join(tempDir, `remotion_raw_${scene.id}.mp4`);
          console.log(`      ⚡ Invoking Remotion CLI for frames ${startFrame}-${endFrame}...`);
          execSync(`npx remotion render remotion/index.ts SynaPathCinematic "${remotionRawPath}" --frames=${startFrame}-${endFrame}`, { 
            stdio: 'inherit',
            cwd: path.dirname(this.config.outputDir) 
          });
          
          await new Promise<void>((resolve, reject) => {
            ffmpeg()
              .input(remotionRawPath)
              .input(audioPath)
              .input(ambientAudioPath)
              .inputOptions([`-ss ${seekOffsetSec.toFixed(3)}`]) // For ambient sync
              .outputOptions([
                '-c:v copy',
                // Mix narration voice [1:a] (full) and background synth [2:a] (ambient volume 0.12)
                '-filter_complex [1:a]volume=1.0[narr];[2:a]volume=0.12[bg];[narr][bg]amix=inputs=2:duration=first[a]',
                '-map 0:v',
                '-map [a]',
                '-c:a aac',
                '-b:a 192k',
                '-video_track_timescale 60000',
                '-y'
              ])
              .save(clipPath)
              .on('end', () => { clipsList.push(clipPath); resolve(); })
              .on('error', reject);
          });
        } else {
          // Normal Playwright image looping
          await new Promise<void>((resolve, reject) => {
            ffmpeg()
              .input(imagePath)
              .loop(durationSeconds)
              .input(audioPath)
              .input(ambientAudioPath)
              .inputOptions([`-ss ${seekOffsetSec.toFixed(3)}`]) // Continuous chord transitions across scenes
              .outputOptions([
                '-c:v libx264',
                '-tune stillimage',
                '-pix_fmt yuv420p',
                '-r 60', // Force 60fps to match Remotion exactly for seamless concat
                '-shortest',
                // Zoompan filter updated to 60fps
                `-vf scale=1920:1080,zoompan=z='if(lt(on,15),1.045-on*0.002,min(zoom+0.0001,1.035))':d=${Math.ceil(durationSeconds * 60)}:fps=60:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080`,
                '-filter_complex [1:a]volume=1.0[narr];[2:a]volume=0.12[bg];[narr][bg]amix=inputs=2:duration=first[a]',
                '-map 0:v',
                '-map [a]',
                '-c:a aac',
                '-b:a 192k',
                '-video_track_timescale 60000', // Force consistent timebase
                '-y'
              ])
              .save(clipPath)
              .on('end', () => { clipsList.push(clipPath); resolve(); })
              .on('error', reject);
          });
        }
      }

      // 4. Concatenate all sub-clips into the Final Cinematic Master
      console.log(`🔗 [VideoProductionAgent] Concatenating all scenes into the final video...`);
      const concatListPath = path.join(tempDir, 'clips.txt');
      const listContent = clipsList.map(c => `file '${c.replace(/\\/g, '/')}'`).join('\n');
      fs.writeFileSync(concatListPath, listContent, 'utf8');

      const finalVideoPath = path.join(this.config.outputDir, this.config.outputFileName);
      
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(concatListPath)
          .inputOptions(['-f concat', '-safe 0'])
          .outputOptions(['-c copy', '-y'])
          .save(finalVideoPath)
          .on('end', () => resolve())
          .on('error', reject);
      });

      console.log(`\n🌟🌟🌟 [VideoProductionAgent] SUCCESS! Final demo video saved to: ${finalVideoPath} 🌟🌟🌟\n`);
      return finalVideoPath;

    } catch (err) {
      console.error(`❌ [VideoProductionAgent] Video production pipeline failed:`, err);
      throw err;
    } finally {
      // 5. Clean up temporary production workspace to conserve memory
      console.log(`🧹 [VideoProductionAgent] Cleaning up temporary workspace files...`);
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (e) {}
    }
  }
}
