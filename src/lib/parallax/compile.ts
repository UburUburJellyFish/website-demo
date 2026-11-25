// Turns a timeline (keyframes in vh/vw) into px for one viewport, ready for stateAt().

import { toPx } from "@/lib/parallax/math";
import type { ColorToken, Keyframe, Length, Prop, Range, Viewport } from "@/lib/parallax/types";
import { PROPS } from "@/lib/parallax/types";

/** from undefined = continue from the element's previous value. */
export type Step = { from?: number; to: number };

export type CompiledKeyframe = {
  scene: string;
  start: number;
  duration: number;
  background?: { from?: ColorToken; to: ColorToken };
  tone?: "light" | "dark";
  anchor?: string;
};

/** One keyframe's animation of one element. */
export type TargetEntry = { index: number; steps: Partial<Record<Prop, Step>> };

export type CompiledTimeline = {
  viewport: Viewport;
  keyframes: CompiledKeyframe[];
  /** Total scroll length of the timeline in px. */
  total: number;
  /** For each data-px target, the keyframes that animate it, in order. */
  byTarget: Map<string, TargetEntry[]>;
};

function toStep<T extends number | Length>(range: Range<T>, convert: (value: T) => number): Step {
  if (Array.isArray(range)) {
    const [from, to] = range as readonly [T, T];
    return { from: convert(from), to: convert(to) };
  }
  return { to: convert(range as T) };
}

export function compileTimeline(keyframes: Keyframe[], viewport: Viewport): CompiledTimeline {
  const compiled: CompiledKeyframe[] = [];
  const byTarget = new Map<string, TargetEntry[]>();
  let start = 0;

  keyframes.forEach((keyframe, index) => {
    // At least 1px so a keyframe always has a progress, even with a 0vh duration.
    const duration = Math.max(1, toPx(keyframe.duration, viewport));
    const background = keyframe.background
      ? Array.isArray(keyframe.background)
        ? { from: keyframe.background[0], to: keyframe.background[1] }
        : { to: keyframe.background as ColorToken }
      : undefined;
    compiled.push({ scene: keyframe.scene, start, duration, background, tone: keyframe.tone, anchor: keyframe.anchor });
    start += duration;

    for (const animation of keyframe.animations) {
      const steps: Partial<Record<Prop, Step>> = {};
      for (const prop of PROPS) {
        const range = animation[prop];
        if (range === undefined) continue;
        steps[prop] =
          prop === "x" || prop === "y"
            ? toStep(range as Range<Length>, (value) => toPx(value, viewport))
            : toStep(range as Range<number>, (value) => value);
      }
      const entries = byTarget.get(animation.target) ?? [];
      entries.push({ index, steps });
      byTarget.set(animation.target, entries);
    }
  });

  return { viewport, keyframes: compiled, total: start, byTarget };
}

/** Index of the keyframe with this anchor, or -1. */
export function findAnchor(compiled: CompiledTimeline, anchor: string): number {
  return compiled.keyframes.findIndex((keyframe) => keyframe.anchor === anchor);
}

/** Index of the first keyframe that shows this scene, or -1. */
export function findScene(compiled: CompiledTimeline, scene: string): number {
  return compiled.keyframes.findIndex((keyframe) => keyframe.scene === scene);
}
