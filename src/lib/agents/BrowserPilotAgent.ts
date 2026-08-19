// ═══════════════════════════════════════════════════════════════════
//  BrowserPilotAgent — Layer 2: UI Execution Engine
// ═══════════════════════════════════════════════════════════════════
//  RESPONSIBILITY: Navigation, input, scrolling, clicking, hovering,
//                  cursor rendering, zoom effects, backtrack scrolling.
//
//  RULE 1 ENFORCEMENT:
//    ✅ Executes actions
//    ❌ Never decides how or when to use them
//    ❌ No retry logic, no validation, no policy
//    ❌ No narration, no TTS, no media probing
// ═══════════════════════════════════════════════════════════════════

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import path from 'path';
import { DemoStoryboard } from '../types';

export interface AudioTimelineEntry {
  file: string;
  startMs: number;
}

export interface BrowserPilotConfig {
  headless?: boolean;
  viewport?: { width: number; height: number };
}

const DEFAULT_CONFIG: Required<BrowserPilotConfig> = {
  headless: true,
  viewport: { width: 1920, height: 1080 },
};

export class BrowserPilotAgent {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private startTime: number = 0;
  private outputVideoPath: string;
  private config: Required<BrowserPilotConfig>;

  constructor(
    outputVideoPath: string = 'output/demo.mp4',
    config?: BrowserPilotConfig
  ) {
    this.outputVideoPath = outputVideoPath;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async init(url?: string): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: this.config.headless,
        ignoreDefaultArgs: ['--enable-automation'],
      });
    }

    if (this.context) await this.context.close();

    this.context = await this.browser.newContext({
      viewport: this.config.viewport,
    });

    this.page = await this.context.newPage();

    if (url) {
      console.log(`🌐 Preparing ${url}...`);
      await this.page.goto(url, { waitUntil: 'load', timeout: 60000 });
      await this.page.waitForTimeout(2000);
    }
  }

  // ─── Premium Visual Cursor ────────────────────────────────────
  //  Glow, pulse, cubic-bezier transitions. Injected into page DOM.

  private async injectVisualCursor() {
    if (!this.page) return;
    await this.page.evaluate(() => {
      if (document.getElementById('demo-cursor')) return;

      const cursor = document.createElement('div');
      cursor.id = 'demo-cursor';
      Object.assign(cursor.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '24px',
        height: '24px',
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        border: '3px solid white',
        borderRadius: '50%',
        zIndex: '100000',
        pointerEvents: 'none',
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(-50%, -50%)',
      });

      const pulse = document.createElement('div');
      Object.assign(pulse.style, {
        width: '8px',
        height: '8px',
        backgroundColor: 'white',
        borderRadius: '50%',
      });
      cursor.appendChild(pulse);

      const style = document.createElement('style');
      style.innerHTML = `
        .cursor-clicking {
          transform: translate(-50%, -50%) scale(0.7) !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(cursor);
    });
  }

  // ─── Cursor Movement ──────────────────────────────────────────
  //  Moves the visual cursor to the center of a target element.
  //  Uses locator-first approach; falls back gracefully.

  private async moveVisualCursor(selector: string) {
    if (!this.page) return;
    try {
      const element = this.page.locator(selector).first();
      const box = await element.boundingBox();
      if (box) {
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await this.page.evaluate(({ x, y }) => {
          const cursor = document.getElementById('demo-cursor');
          if (cursor) {
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
          }
        }, { x, y });
        await this.page.waitForTimeout(600);
      }
    } catch (e) {
      // Cursor movement is cosmetic — never fail the pipeline
    }
  }

  // ─── Visual Click (ElementHandle-safe) ────────────────────────
  //  Uses locator().elementHandle() for page.evaluate calls.
  //  Never passes Playwright selectors into document.querySelector.

  private async performVisualClick(selector: string) {
    if (!this.page) return;
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 15000 });
      await this.moveVisualCursor(selector);

      const handle = await this.page.locator(selector).first().elementHandle();
      await this.page.evaluate((el) => el?.classList.add('cursor-clicking'), handle);
      await this.page.click(selector);
      await this.page.waitForTimeout(200);
      await this.page.evaluate((el) => el?.classList.remove('cursor-clicking'), handle);
    } catch (e) {
      console.warn(`   ⚠️ Click failed: ${selector}`);
    }
  }

  // ─── Storyboard Execution ─────────────────────────────────────
  //  Executes a storyboard action-by-action. Records via Playwright.
  //  Returns raw video path + audio timeline for composition.

  async executeStoryboard(
    storyboard: DemoStoryboard,
    extraWaitPaddingMs: number = 0
  ): Promise<{ videoPath: string; audioTimeline: AudioTimelineEntry[] }> {
    console.log(`🎬 Executing Storyboard: ${storyboard.title}`);

    if (this.context) await this.context.close();

    const tempDir = `temp_video_${Math.floor(Math.random() * 100000)}/`;
    fs.mkdirSync(tempDir, { recursive: true });
    (this as any)._tempDir = tempDir;

    this.context = await this.browser!.newContext({
      recordVideo: {
        dir: tempDir,
        size: this.config.viewport,
      },
      viewport: this.config.viewport,
    });
    this.page = await this.context.newPage();

    const startUrl = storyboard.actions.find((a) => a.action === 'goto')?.value || '';
    if (startUrl) {
      await this.page.goto(startUrl, { waitUntil: 'load' });
    }

    await this.injectVisualCursor();
    const audioTimeline: AudioTimelineEntry[] = [];
    this.startTime = Date.now();

    for (const action of storyboard.actions) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      console.log(`   [${elapsed.toFixed(1)}s] ${action.action} ${action.selector || action.value || ''}`);

      switch (action.action) {
        case 'goto':
          if (action.value) {
            await this.page.goto(action.value, { waitUntil: 'load' });
            await this.page.waitForTimeout(2000);
            await this.injectVisualCursor();
          }
          break;

        case 'click':
          if (action.selector) {
            await this.performVisualClick(action.selector);
            await this.page.waitForTimeout(1000 + extraWaitPaddingMs);
          }
          break;

        case 'type':
          if (action.selector && action.value) {
            try {
              await this.page.waitForSelector(action.selector, { state: 'visible', timeout: 15000 });
              await this.moveVisualCursor(action.selector);
              await this.page.locator(action.selector).first().fill('');
              await this.page.type(action.selector, action.value, { delay: 80 });
              await this.page.waitForTimeout(500 + extraWaitPaddingMs);
            } catch (e) {
              console.warn(`   ⚠️ Type failed: ${action.selector}`);
            }
          }
          break;

        case 'hover':
          if (action.selector) {
            try {
              await this.page.waitForSelector(action.selector, { state: 'visible', timeout: 15000 });
              await this.moveVisualCursor(action.selector);
              await this.page.hover(action.selector);
              await this.page.waitForTimeout(800 + extraWaitPaddingMs);
            } catch (e) {
              console.warn(`   ⚠️ Hover failed: ${action.selector}`);
            }
          }
          break;

        case 'scroll':
          try {
            if (action.selector) {
              await this.page.waitForSelector(action.selector, { state: 'attached', timeout: 15000 });
              await this.page.locator(action.selector).first().scrollIntoViewIfNeeded();
            } else if (action.value) {
              await this.page.evaluate((y) => window.scrollBy(0, parseInt(y)), action.value);
            }
            await this.page.waitForTimeout(1000 + extraWaitPaddingMs);
          } catch (e) {
            console.warn(`   ⚠️ Scroll failed: ${action.selector || action.value}`);
          }
          break;

        case 'wait':
          await this.page.waitForTimeout((action.duration || 1000) + extraWaitPaddingMs);
          break;

        case 'narrate':
          if (action.audioFile) {
            audioTimeline.push({
              file: action.audioFile,
              startMs: (elapsed + 0.2) * 1000,
            });
            await this.page.waitForTimeout(action.duration || 2000);
          }
          break;

        // ─── NEW: Zoom ──────────────────────────────────────
        //  CSS transform zoom via ElementHandle. Pure visual effect.
        case 'zoom':
          if (action.selector) {
            console.log(`   🔎 Zoom focus on: ${action.selector}`);
            try {
              const handle = await this.page.locator(action.selector).first().elementHandle();
              await this.page.evaluate((el) => {
                const htmlEl = el as HTMLElement;
                if (htmlEl) {
                  htmlEl.style.transition = 'all 2s ease-in-out';
                  htmlEl.style.transform = 'scale(1.2)';
                  htmlEl.style.zIndex = '9999';
                }
              }, handle);
            } catch (e) {
              // Zoom is cosmetic — never fail the pipeline
            }
            await this.page.waitForTimeout(2000 + extraWaitPaddingMs);
          }
          break;

        // ─── NEW: Backtrack ─────────────────────────────────
        //  Smooth scroll to top. Optionally moves cursor to target.
        case 'backtrack':
          console.log(`   ↩️ Smooth backtracking sequence...`);
          try {
            await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
          } catch (e) {
            console.warn(`   ⚠️ Backtrack scroll failed`);
          }
          await this.page.waitForTimeout(1000);
          if (action.selector) {
            try {
              const element = this.page.locator(action.selector).first();
              const box = await element.boundingBox();
              if (box) {
                await this.moveVisualCursor(action.selector);
              }
            } catch (e) {
              // Backtrack cursor is cosmetic — never fail
            }
          }
          await this.page.waitForTimeout(1500 + extraWaitPaddingMs);
          break;

        // ─── NEW: Cursor ────────────────────────────────────
        //  First-class cursor state control (show/hide/restyle).
        case 'cursor':
          if (action.value === 'hide') {
            await this.page.evaluate(() => {
              const cursor = document.getElementById('demo-cursor');
              if (cursor) cursor.style.display = 'none';
            });
          } else if (action.value === 'show') {
            await this.page.evaluate(() => {
              const cursor = document.getElementById('demo-cursor');
              if (cursor) cursor.style.display = 'flex';
            });
          }
          break;
      }
    }

    const videoPath = await this.cleanup();
    return { videoPath, audioTimeline };
  }

  // ─── Cleanup ──────────────────────────────────────────────────

  async cleanup(): Promise<string> {
    const tempDir = (this as any)._tempDir || 'temp_video/';
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();

    if (!fs.existsSync(tempDir)) throw new Error(`Temp dir ${tempDir} not found`);

    const videoFiles = fs.readdirSync(tempDir);
    if (videoFiles.length > 0) {
      const latestVideo = videoFiles[videoFiles.length - 1];
      const finalPath = this.outputVideoPath;
      const sourcePath = path.join(tempDir, latestVideo);

      fs.renameSync(sourcePath, finalPath);
      fs.rmSync(tempDir, { recursive: true, force: true });

      return finalPath;
    }
    throw new Error('No video recorded');
  }

  // ─── DOM Extraction (for PlannerAgent context) ────────────────

  async extractDOM(url: string): Promise<any> {
    if (!this.page) {
      await this.init(url);
    }
    if (!this.page) return [];
    return await this.page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('button, a, input, [role="button"]')
      );
      return elements
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().substring(0, 50) || '',
          id: el.id,
          className: el.className,
          placeholder: (el as HTMLInputElement).placeholder || '',
          selector:
            el.tagName.toLowerCase() +
            (el.id ? `#${el.id}` : '') +
            (el.textContent
              ? `:has-text("${el.textContent.trim().substring(0, 20)}")`
              : ''),
        }))
        .slice(0, 20);
    });
  }
}
