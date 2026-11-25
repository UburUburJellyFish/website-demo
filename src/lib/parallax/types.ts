// Types for the scroll-driven parallax engine. Spec: docs/02-parallax.md, section 4.
// Works like davegamache.com/parallax: one timeline of keyframes, each with a duration in viewport heights and a
// list of animations that move elements from one value to another while the keyframe is scrolled through.

/** A length in px (number), or a percentage of the viewport width/height. */
export type Length = number | `${number}vw` | `${number}vh`;

/** One value = from the element's previous value to this one. Two values = [from, to]. */
export type Range<T> = T | readonly [T, T];

export type Animation = {
  /** The data-px attribute of the element(s) to move. */
  target: string;
  x?: Range<Length>;
  y?: Range<Length>;
  scale?: Range<number>;
  /** Degrees. */
  rotate?: Range<number>;
  /** May go past 0–1 to make a fade feel faster (as in the reference); the output is clamped to 0–1. */
  opacity?: Range<number>;
};

/**
 * AppColor tokens the stage background can show (the CSS variables in src/app/globals.css).
 * "stage" = no color layer, so the default stage gradient shows through.
 */
export type ColorToken =
  | "stage"
  | "navy"
  | "home-background"
  | "home-card"
  | "home-cream"
  | "home-tile"
  | "home-accent"
  | "home-ink"
  | "home-star"
  | "highlight-chart"
  | "orange"
  | "range-low"
  | "range-high"
  | "voice-top"
  | "voice-bottom"
  | "voice-glow";

export type Keyframe = {
  /** data-scene id of the scene shown during this keyframe. */
  scene: string;
  duration: `${number}vh`;
  /** Empty = a pause: the visitor keeps scrolling while nothing moves. */
  animations: Animation[];
  /** Stage background color over this keyframe. One value = from the previous background. */
  background?: Range<ColorToken>;
  /** "dark" turns the text and header to home-cream. Switches halfway through the keyframe. */
  tone?: "light" | "dark";
  /** Id for navigation (header links, #hash): jumps to the start of this keyframe. */
  anchor?: string;
};

export type Viewport = { width: number; height: number; isMobile: boolean };

export type BuildTimeline = (viewport: Viewport) => Keyframe[];

export const PROPS = ["x", "y", "scale", "rotate", "opacity"] as const;
export type Prop = (typeof PROPS)[number];

/** Where an element is at one scroll position. x and y in px. */
export type TargetState = Record<Prop, number>;

export const DEFAULT_STATE: TargetState = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
