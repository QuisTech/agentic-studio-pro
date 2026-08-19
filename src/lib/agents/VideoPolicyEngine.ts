// ═══════════════════════════════════════════════════════════════════
//  VideoPolicyEngine — Layer 5: System Governance
// ═══════════════════════════════════════════════════════════════════
//  ENFORCEMENT: This file must NEVER import:
//    - playwright
//    - fluent-ffmpeg
//    - fs / path
//    - node-edge-tts
//
//  This is a PURE DECISION ENGINE. It consumes data produced by
//  other agents and returns structured recommendations.
//  It never executes, probes, or touches the filesystem.
// ═══════════════════════════════════════════════════════════════════

import type {
  PolicyConfig,
  PolicyFailure,
  PolicyValidationResult,
  CompositionResult,
} from '../types';

export class VideoPolicyEngine {
  private config: PolicyConfig;

  constructor(config: PolicyConfig) {
    this.config = config;
  }

  // ─── Duration Gate ────────────────────────────────────────────

  validateDuration(actualSec: number): { passed: boolean; failure?: PolicyFailure } {
    if (actualSec < this.config.minDurationSec) {
      return {
        passed: false,
        failure: {
          code: 'DURATION_TOO_SHORT',
          actual: actualSec,
          required: this.config.minDurationSec,
        },
      };
    }
    return { passed: true };
  }

  // ─── A/V Drift Gate ───────────────────────────────────────────

  validateDrift(driftSec: number): { passed: boolean; failure?: PolicyFailure } {
    if (driftSec > this.config.maxDriftSec) {
      return {
        passed: false,
        failure: {
          code: 'DRIFT_TOO_HIGH',
          actual: driftSec,
          threshold: this.config.maxDriftSec,
        },
      };
    }
    return { passed: true };
  }

  // ─── Vocabulary Gate ──────────────────────────────────────────
  //  Scans narration texts only — not CSS selectors, paths, or IDs.

  validateNarrationTokens(
    narrationTexts: string[]
  ): { passed: boolean; failures: PolicyFailure[] } {
    const failures: PolicyFailure[] = [];

    for (const text of narrationTexts) {
      const lower = text.toLowerCase();
      for (const token of this.config.prohibitedTokens) {
        if (lower.includes(token.toLowerCase())) {
          failures.push({
            code: 'PROHIBITED_TOKEN',
            token,
            segment: text.substring(0, 80),
          });
        }
      }
    }

    return { passed: failures.length === 0, failures };
  }

  // ─── Timeline Integrity Gate ──────────────────────────────────
  //  Validates that timeline event timestamps are monotonically increasing.

  validateTimelineIntegrity(
    events: { elapsedMs: number }[]
  ): { passed: boolean; failure?: PolicyFailure } {
    let previousTimestamp = -1;

    for (let i = 0; i < events.length; i++) {
      const ts = events[i].elapsedMs;

      if (typeof ts !== 'number' || ts < 0) {
        return {
          passed: false,
          failure: {
            code: 'TIMELINE_NON_MONOTONIC',
            eventIndex: i,
            timestamp: ts,
            previousTimestamp,
          },
        };
      }

      if (ts < previousTimestamp) {
        return {
          passed: false,
          failure: {
            code: 'TIMELINE_NON_MONOTONIC',
            eventIndex: i,
            timestamp: ts,
            previousTimestamp,
          },
        };
      }

      previousTimestamp = ts;
    }

    return { passed: true };
  }

  // ─── Composite Validation ─────────────────────────────────────
  //  Runs all gates against a CompositionResult.
  //  Returns a single PolicyValidationResult with recommendation.

  validateComposition(
    result: CompositionResult,
    timelineEvents: { elapsedMs: number }[],
    narrationTexts: string[]
  ): PolicyValidationResult {
    const failures: PolicyFailure[] = [];

    // Duration gate
    const durationCheck = this.validateDuration(result.videoDurationSec);
    if (!durationCheck.passed && durationCheck.failure) {
      failures.push(durationCheck.failure);
    }

    // Drift gate
    const driftCheck = this.validateDrift(result.driftSec);
    if (!driftCheck.passed && driftCheck.failure) {
      failures.push(driftCheck.failure);
    }

    // Timeline integrity gate
    const timelineCheck = this.validateTimelineIntegrity(timelineEvents);
    if (!timelineCheck.passed && timelineCheck.failure) {
      failures.push(timelineCheck.failure);
    }

    // Vocabulary gate
    const vocabCheck = this.validateNarrationTokens(narrationTexts);
    failures.push(...vocabCheck.failures);

    // If all passed
    if (failures.length === 0) {
      return { passed: true, failures: [] };
    }

    // Determine recommendation based on failure types
    const hasDurationFailure = failures.some(f => f.code === 'DURATION_TOO_SHORT');
    const hasVocabFailure = failures.some(f => f.code === 'PROHIBITED_TOKEN');
    const hasTimelineFailure = failures.some(f => f.code === 'TIMELINE_NON_MONOTONIC');

    // Vocab or timeline failures are non-recoverable via retry
    if (hasVocabFailure || hasTimelineFailure) {
      return { passed: false, failures, recommendation: 'abort' };
    }

    // Duration failure is recoverable via pacing adjustment
    if (hasDurationFailure) {
      const durationFailure = failures.find(
        f => f.code === 'DURATION_TOO_SHORT'
      ) as Extract<PolicyFailure, { code: 'DURATION_TOO_SHORT' }>;

      const paddingMs = this.computeRecoveryPadding(
        durationFailure.required - durationFailure.actual,
        timelineEvents.length
      );

      return {
        passed: false,
        failures,
        recommendation: 'retry_with_padding',
        suggestedPaddingMs: paddingMs,
      };
    }

    // Drift failure — retry might help if actions are re-paced
    return {
      passed: false,
      failures,
      recommendation: 'retry_with_padding',
      suggestedPaddingMs: 1500,
    };
  }

  // ─── Retry Budget ─────────────────────────────────────────────

  shouldRetry(attempt: number): boolean {
    return attempt < this.config.maxRetries;
  }

  // ─── Recovery Pacing ──────────────────────────────────────────
  //  Computes extra padding per action to meet duration target.

  computeRecoveryPadding(deficitSec: number, actionCount: number): number {
    if (actionCount <= 0 || deficitSec <= 0) return 0;

    const deficitMs = deficitSec * 1000;

    if (this.config.paddingStrategy === 'exponential') {
      // Exponential: more padding per action to account for overhead
      return Math.ceil((deficitMs / actionCount) * 1.5) + 500;
    }

    // Linear: even distribution with small buffer
    return Math.ceil(deficitMs / actionCount) + 500;
  }
}
