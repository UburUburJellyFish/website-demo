// Small pure helpers for the parallax engine.

import type { Length, Viewport } from "@/lib/parallax/types";

/** Cosine ease in and out, the same curve as the reference: 0 → 0, 0.5 → 0.5, 1 → 1. */
export function ease(t: number): number {
  return (1 - Math.cos(Math.PI * clamp(t, 0, 1))) / 2;
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** px, "12vw" or "-40vh" → px for this viewport. */
export function toPx(length: Length, viewport: Viewport): number {
  if (typeof length === "number") return length;
  const amount = Number.parseFloat(length);
  return length.endsWith("vw") ? (amount / 100) * viewport.width : (amount / 100) * viewport.height;
}

export type Rgba = readonly [number, number, number, number];

export const TRANSPARENT: Rgba = [0, 0, 0, 0];

/** "#3f5996" or "#fff" → [r, g, b, 1]. Anything else → transparent. */
export function parseHex(hex: string): Rgba {
  const value = hex.trim().replace("#", "");
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) return TRANSPARENT;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
    1,
  ];
}

/** Mixes two colors. From or to transparent keeps the other color's RGB and only fades the alpha. */
export function lerpColor(from: Rgba, to: Rgba, t: number): Rgba {
  const a = from[3] === 0 ? ([to[0], to[1], to[2], 0] as const) : from;
  const b = to[3] === 0 ? ([from[0], from[1], from[2], 0] as const) : to;
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
}

export function rgbaToCss([r, g, b, a]: Rgba): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${Math.round(a * 1000) / 1000})`;
}
