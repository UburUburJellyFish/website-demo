// Where everything is at one scroll position. Pure: same input, same output.
//
// Unlike the reference (which only animates the current keyframe, so a fast scroll can leave elements halfway),
// every element's state is worked out from the whole timeline up to the current keyframe, so it is always right.

import type { CompiledTimeline } from "@/lib/parallax/compile";
import { clamp, ease, lerp } from "@/lib/parallax/math";
import type { ColorToken, Prop, TargetState } from "@/lib/parallax/types";
import { DEFAULT_STATE, PROPS } from "@/lib/parallax/types";

export type BackgroundState = { from: ColorToken; to: ColorToken; t: number };

export type FrameState = {
  index: number;
  /** 0–1 through the current keyframe, before easing. */
  progress: number;
  scene: string;
  tone: "light" | "dark";
  background: BackgroundState;
  /** Opacity already clamped to 0–1. */
  targets: Map<string, TargetState>;
};

/** Current keyframe and raw progress for a position (px from the start of the timeline). */
export function locate(compiled: CompiledTimeline, position: number): { index: number; progress: number } {
  const { keyframes, total } = compiled;
  const pos = clamp(position, 0, total);
  let index = keyframes.length - 1;
  for (let i = 0; i < keyframes.length; i++) {
    if (pos < keyframes[i].start + keyframes[i].duration) {
      index = i;
      break;
    }
  }
  const keyframe = keyframes[index];
  return { index, progress: clamp((pos - keyframe.start) / keyframe.duration, 0, 1) };
}

export function stateAt(compiled: CompiledTimeline, position: number): FrameState {
  const { index, progress } = locate(compiled, position);
  const eased = ease(progress);
  const targets = new Map<string, TargetState>();

  for (const [target, entries] of compiled.byTarget) {
    // Before its first keyframe, an element sits at that keyframe's "from" (e.g. opacity [0, 1] = hidden until then).
    const state: TargetState = { ...DEFAULT_STATE };
    for (const prop of PROPS) {
      const first = entries.find((entry) => entry.steps[prop] !== undefined)?.steps[prop];
      if (first?.from !== undefined) state[prop] = first.from;
    }

    for (const entry of entries) {
      if (entry.index > index) break;
      for (const prop of PROPS) {
        const step = entry.steps[prop];
        if (!step) continue;
        const from = step.from ?? state[prop];
        state[prop] = entry.index < index ? finished(prop, step.to) : lerp(from, step.to, eased);
      }
    }

    state.opacity = clamp(state.opacity, 0, 1);
    targets.set(target, state);
  }

  return {
    index,
    progress,
    scene: compiled.keyframes[index].scene,
    tone: toneAt(compiled, index, eased),
    background: backgroundAt(compiled, index, eased),
    targets,
  };
}

/** A finished keyframe hands on a clamped opacity, so an "opacity: [0, 1.75]" speed-up does not slow the next fade. */
function finished(prop: Prop, value: number): number {
  return prop === "opacity" ? clamp(value, 0, 1) : value;
}

function toneAt(compiled: CompiledTimeline, index: number, eased: number): "light" | "dark" {
  let tone: "light" | "dark" = "light";
  for (let i = 0; i <= index; i++) {
    const next = compiled.keyframes[i].tone;
    if (!next) continue;
    // The keyframe that changes the tone switches halfway, when its background is half way there.
    if (i < index || eased >= 0.5) tone = next;
  }
  return tone;
}

function backgroundAt(compiled: CompiledTimeline, index: number, eased: number): BackgroundState {
  let current: ColorToken = "stage";
  for (let i = 0; i <= index; i++) {
    const background = compiled.keyframes[i].background;
    if (!background) continue;
    const from = background.from ?? current;
    if (i === index) return { from, to: background.to, t: eased };
    current = background.to;
  }
  return { from: current, to: current, t: 1 };
}

/** CSS transform for a state. */
export function toTransform({ x, y, scale, rotate }: TargetState): string {
  return `translate3d(${round(x)}px, ${round(y)}px, 0) scale(${round(scale, 1000)}) rotate(${round(rotate, 100)}deg)`;
}

function round(value: number, precision = 10): number {
  return Math.round(value * precision) / precision;
}
