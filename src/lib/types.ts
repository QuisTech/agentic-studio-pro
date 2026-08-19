// ═══════════════════════════════════════════════════════════════════
//  AGENTS ASSEMBLE — Canonical Data Contracts
// ═══════════════════════════════════════════════════════════════════
//  These types are the shared contract between all 5 layers:
//    Layer 1: forge.ts (orchestration)
//    Layer 2: BrowserPilotAgent (UI execution)
//    Layer 3: NarrationAgent (TTS engine)
//    Layer 4: VideoComposer (media finalization)
//    Layer 5: VideoPolicyEngine (governance)
// ═══════════════════════════════════════════════════════════════════

// ---------------------------------------------------------------------------
//  Action Types & Storyboard
// ---------------------------------------------------------------------------

export type ActionType =
  | 'goto'
  | 'click'
  | 'type'
  | 'hover'
  | 'scroll'
  | 'wait'
  | 'narrate'
  | 'zoom'
  | 'backtrack'
  | 'cursor';

export interface StoryboardAction {
  /** Unique identifier for this action — used for narration coupling. */
  id: string;
  action: ActionType;
  /** For 'goto' (URL), 'type' (text to type), 'narrate' (text to speak), 'scroll' (px delta) */
  value?: string;
  /** For 'click', 'type', 'hover', 'zoom', 'cursor' */
  selector?: string;
  /** For 'wait' (milliseconds), or 'narrate' (pre-calculated TTS duration) */
  duration?: number;
  /** Injected during generation to link the TTS audio file */
  audioFile?: string;
}

export interface DemoStoryboard {
  title: string;
  actions: StoryboardAction[];
}

// ---------------------------------------------------------------------------
//  Narration Segments — linked to storyboard via actionId
// ---------------------------------------------------------------------------

export interface NarrationSegment {
  /** The raw narration text (before sanitization). */
  text: string;
  /** Path to synthesized audio file (populated after TTS). */
  audioFile?: string;
  /** Duration of synthesized audio in milliseconds (populated after TTS). */
  durationMs?: number;
  /** Links to DemoStoryboard.actions[].id — resilient to reordering/filtering. */
  actionId: string;
}

// ---------------------------------------------------------------------------
//  VideoTimeline — the canonical shared contract
// ---------------------------------------------------------------------------

export interface VideoTimeline {
  storyboard: DemoStoryboard;
  narration: NarrationSegment[];
  metadata: {
    targetUrl: string;
    targetDurationSec: number;
    style: 'cinematic' | 'technical';
    prohibitedTokens: string[];
  };
}

// ---------------------------------------------------------------------------
//  Composition Result — facts only, no decisions
// ---------------------------------------------------------------------------

export interface CompositionResult {
  videoPath: string;
  timelinePath: string;
  videoDurationSec: number;
  audioDurationSec: number;
  driftSec: number;
}

// ---------------------------------------------------------------------------
//  Policy Engine Types — structured failure codes, no string parsing
// ---------------------------------------------------------------------------

export type PolicyFailure =
  | { code: 'DURATION_TOO_SHORT'; actual: number; required: number }
  | { code: 'DRIFT_TOO_HIGH'; actual: number; threshold: number }
  | { code: 'PROHIBITED_TOKEN'; token: string; segment: string }
  | { code: 'TIMELINE_NON_MONOTONIC'; eventIndex: number; timestamp: number; previousTimestamp: number };

export interface PolicyValidationResult {
  passed: boolean;
  failures: PolicyFailure[];
  recommendation?: 'retry_with_padding' | 'abort';
  suggestedPaddingMs?: number;
}

export interface PolicyConfig {
  minDurationSec: number;
  maxRetries: number;
  maxDriftSec: number;
  prohibitedTokens: string[];
  paddingStrategy: 'linear' | 'exponential';
}
