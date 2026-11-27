// Point clouds for the About playground (components/ui/StarPlayground.tsx): Claire the star, a glucose drop, an
// insulin pen and a rice bowl, each sampled on its surface with a normal and a color per point. All shapes share the
// same number of points, so the shader can morph point i of one shape into point i of the next. Built once on the CPU
// with a seeded random, so the sculptures look the same on every visit. Colors are passed in from the AppColor tokens.

import { seeded } from "@/lib/seeded";

export type Rgb = [number, number, number];
type Vec3 = [number, number, number];

export type ShapeCloud = { pos: Float32Array; nrm: Float32Array; col: Float32Array };

/** AppColor tokens the shapes are painted with (read from CSS by the component). */
export type ShapePalette = {
  star: Rgb;
  blush: Rgb;
  ink: Rgb;
  cream: Rgb;
  glucose: Rgb;
  insulin: Rgb;
  meal: Rgb;
  homeInk: Rgb;
  navy: Rgb;
  accent: Rgb;
};

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Fills the three arrays point by point; extra pushes after the last point are ignored. */
class Cloud {
  readonly pos: Float32Array;
  readonly nrm: Float32Array;
  readonly col: Float32Array;
  private i = 0;

  constructor(readonly count: number) {
    this.pos = new Float32Array(count * 3);
    this.nrm = new Float32Array(count * 3);
    this.col = new Float32Array(count * 3);
  }

  get full() {
    return this.i >= this.count;
  }

  push(p: Vec3, n: Vec3, c: Rgb) {
    if (this.full) return;
    const k = this.i * 3;
    const len = Math.hypot(n[0], n[1], n[2]) || 1;
    this.pos.set(p, k);
    this.nrm.set([n[0] / len, n[1] / len, n[2] / len], k);
    this.col.set(c, k);
    this.i += 1;
  }

  /** Tilts (about x, then z), scales and lifts the finished shape; normals turn with it. */
  place({ tiltX = 0, tiltZ = 0, scale = 1, liftY = 0 }) {
    const [cx, sx, cz, sz] = [Math.cos(tiltX), Math.sin(tiltX), Math.cos(tiltZ), Math.sin(tiltZ)];
    const turn = (a: Float32Array, k: number) => {
      const x = a[k];
      const y = a[k + 1] * cx - a[k + 2] * sx;
      const z = a[k + 1] * sx + a[k + 2] * cx;
      a[k] = x * cz - y * sz;
      a[k + 1] = x * sz + y * cz;
      a[k + 2] = z;
    };
    for (let k = 0; k < this.count * 3; k += 3) {
      turn(this.pos, k);
      turn(this.nrm, k);
      this.pos[k] *= scale;
      this.pos[k + 1] = this.pos[k + 1] * scale + liftY;
      this.pos[k + 2] *= scale;
    }
    return { pos: this.pos, nrm: this.nrm, col: this.col };
  }
}

// ── Surface pieces shared by the pen and the bowl ───────────────────────────────────────────────────────────────────

type Part = { area: number; sample: (rand: () => number, cloud: Cloud) => void };

/** A tube along y from radius r0 (at y0) to r1 (at y1). ridges: grip lines around it. */
function tube(r0: number, r1: number, y0: number, y1: number, color: (phi: number, y: number) => Rgb, ridges = 0): Part {
  const slant = Math.hypot(r1 - r0, y1 - y0);
  return {
    area: Math.PI * (r0 + r1) * slant,
    sample: (rand, cloud) => {
      const u = rand();
      const y = y0 + (y1 - y0) * u;
      const phi = rand() * Math.PI * 2;
      const r = (r0 + (r1 - r0) * u) * (ridges ? 1 + 0.05 * Math.max(0, Math.cos(phi * ridges)) : 1);
      const slope = (r0 - r1) / (y1 - y0);
      cloud.push([r * Math.cos(phi), y, r * Math.sin(phi)], [Math.cos(phi), slope, Math.sin(phi)], color(phi, y));
    },
  };
}

/** A flat disc at height y facing up (+1) or down (−1). */
function disc(radius: number, y: number, up: 1 | -1, color: Rgb): Part {
  return {
    area: Math.PI * radius * radius,
    sample: (rand, cloud) => {
      const r = radius * Math.sqrt(rand());
      const phi = rand() * Math.PI * 2;
      cloud.push([r * Math.cos(phi), y, r * Math.sin(phi)], [0, up, 0], color);
    },
  };
}

/** A thin rod from a to b (chopsticks). */
function rod(a: Vec3, b: Vec3, radius: number, color: Rgb): Part {
  const axis: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const length = Math.hypot(...axis);
  const w: Vec3 = [axis[0] / length, axis[1] / length, axis[2] / length];
  // Two directions at right angles to the rod.
  const helper: Vec3 = Math.abs(w[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u: Vec3 = [helper[1] * w[2] - helper[2] * w[1], helper[2] * w[0] - helper[0] * w[2], helper[0] * w[1] - helper[1] * w[0]];
  const ul = Math.hypot(...u);
  u[0] /= ul;
  u[1] /= ul;
  u[2] /= ul;
  const v: Vec3 = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]];
  return {
    area: Math.PI * 2 * radius * length,
    sample: (rand, cloud) => {
      const t = rand();
      const phi = rand() * Math.PI * 2;
      const n: Vec3 = [
        u[0] * Math.cos(phi) + v[0] * Math.sin(phi),
        u[1] * Math.cos(phi) + v[1] * Math.sin(phi),
        u[2] * Math.cos(phi) + v[2] * Math.sin(phi),
      ];
      cloud.push(
        [a[0] + axis[0] * t + n[0] * radius, a[1] + axis[1] * t + n[1] * radius, a[2] + axis[2] * t + n[2] * radius],
        n,
        color,
      );
    },
  };
}

/** Samples the parts in proportion to their area until the cloud is full. */
function fillParts(cloud: Cloud, parts: Part[], rand: () => number) {
  const total = parts.reduce((sum, part) => sum + part.area, 0);
  while (!cloud.full) {
    let pick = rand() * total;
    const part = parts.find((p) => (pick -= p.area) <= 0) ?? parts[parts.length - 1];
    part.sample(rand, cloud);
  }
}

// ── Claire, the star ────────────────────────────────────────────────────────────────────────────────────────────────

const STAR_VALLEY = 0.56; // inner radius between two arms (outer = 1)
const STAR_POWER = 0.8; // < 1 makes the arms chubbier, like the mascot
const STAR_DEPTH = 0.4; // half thickness at the middle; it rounds off to 0 at the edge (a puffy pillow)

function starEdge(theta: number) {
  return STAR_VALLEY + (1 - STAR_VALLEY) * Math.pow(0.5 + 0.5 * Math.sin(5 * theta), STAR_POWER);
}

function starHeight(x: number, y: number) {
  const s = Math.min(1, Math.max(0, 1 - Math.hypot(x, y) / starEdge(Math.atan2(y, x))));
  return STAR_DEPTH * Math.sqrt(s * (2 - s));
}

/** Claire's face on the front: eyes with a highlight, rosy cheeks and a small smile. null = plain star. */
function starFace(x: number, y: number, p: ShapePalette): Rgb | null {
  for (const side of [-1, 1]) {
    const ex = (x - side * 0.13) / 0.058;
    const ey = (y - 0.06) / 0.078;
    if (ex * ex + ey * ey <= 1) {
      return Math.hypot(x - (side * 0.13 - 0.018), y - 0.088) < 0.022 ? p.cream : p.ink;
    }
    const bx = (x - side * 0.29) / 0.09;
    const by = (y + 0.06) / 0.05;
    if (bx * bx + by * by <= 1) return mixRgb(p.star, p.blush, 0.7);
  }
  const d = Math.hypot(x, y + 0.005);
  if (y < -0.02 && Math.abs(d - 0.05) < 0.016) return p.ink;
  return null;
}

function buildStar(count: number, p: ShapePalette, rand: () => number): ShapeCloud {
  const cloud = new Cloud(count);
  const e = 0.004;
  const add = (x: number, y: number, front: boolean) => {
    const h = starHeight(x, y);
    let hx = (starHeight(x + e, y) - starHeight(x - e, y)) / (2 * e);
    let hy = (starHeight(x, y + e) - starHeight(x, y - e)) / (2 * e);
    const g = Math.hypot(hx, hy);
    if (g > 6) {
      hx *= 6 / g;
      hy *= 6 / g;
    }
    const face = front ? starFace(x, y, p) : null;
    cloud.push([x, y, front ? h : -h], [-hx, -hy, front ? 1 : -1], face ?? p.star);
    return g;
  };
  const inside = (x: number, y: number) => Math.hypot(x, y) < starEdge(Math.atan2(y, x));

  // 8% extra points on the face, so the eyes and cheeks read clearly.
  const facePoints = Math.floor(count * 0.08);
  for (let i = 0; i < facePoints; i += 1) {
    const x = (rand() * 2 - 1) * 0.42;
    const y = -0.16 + rand() * 0.34;
    if (inside(x, y)) add(x, y, true);
  }
  // The rest over the whole pillow. Steep edges get more points (their surface is larger than it looks from above).
  while (!cloud.full) {
    const x = rand() * 2 - 1;
    const y = rand() * 2 - 1;
    if (!inside(x, y)) continue;
    const h = starHeight(x, y);
    const g = (starHeight(x + e, y) - starHeight(x - e, y)) ** 2 + (starHeight(x, y + e) - starHeight(x, y - e)) ** 2;
    const weight = Math.sqrt(1 + Math.min(36, g / (4 * e * e))) / 6.1;
    if (rand() > weight || (h < 0.002 && rand() < 0.5)) continue;
    add(x, y, rand() < 0.62);
  }
  return cloud.place({ scale: 1.12, liftY: 0.16 });
}

// ── Glucose drop ────────────────────────────────────────────────────────────────────────────────────────────────────

function buildDrop(count: number, p: ShapePalette, rand: () => number): ShapeCloud {
  const cloud = new Cloud(count);
  const H = 1.18;
  const W = 1.05;
  const r = (t: number) => W * Math.sin(t) * Math.pow(Math.sin(t / 2), 1.3);
  const y = (t: number) => H * Math.cos(t);
  const d = 0.0005;
  const dr = (t: number) => (r(t + d) - r(t - d)) / (2 * d);
  const dy = (t: number) => (y(t + d) - y(t - d)) / (2 * d);
  let maxWeight = 0;
  for (let i = 1; i < 400; i += 1) {
    const t = (i / 400) * Math.PI;
    maxWeight = Math.max(maxWeight, r(t) * Math.hypot(dr(t), dy(t)));
  }
  // A shine on the upper left, like a cartoon drop.
  const shine: Vec3 = [-0.55, 0.5, 0.67];
  while (!cloud.full) {
    const t = 0.002 + rand() * (Math.PI - 0.004);
    if (rand() * maxWeight > r(t) * Math.hypot(dr(t), dy(t))) continue;
    const phi = rand() * Math.PI * 2;
    const nr = -dy(t);
    const ny = dr(t);
    const n: Vec3 = [nr * Math.cos(phi), ny, nr * Math.sin(phi)];
    const nl = Math.hypot(...n) || 1;
    const lit = (n[0] * shine[0] + n[1] * shine[1] + n[2] * shine[2]) / nl / Math.hypot(...shine);
    const color = lit > 0.965 ? mixRgb(p.glucose, p.cream, 0.5) : p.glucose;
    cloud.push([r(t) * Math.cos(phi), y(t), r(t) * Math.sin(phi)], n, color);
  }
  return cloud.place({ scale: 0.98, liftY: 0.1 });
}

// ── Insulin pen ─────────────────────────────────────────────────────────────────────────────────────────────────────

function buildPen(count: number, p: ShapePalette, rand: () => number): ShapeCloud {
  const cloud = new Cloud(count);
  const holder = mixRgb(p.insulin, p.cream, 0.5);
  const dial = mixRgb(p.insulin, p.navy, 0.35);
  const front = Math.PI / 2; // +z, towards the camera
  const body = (phi: number, y: number): Rgb => {
    const facing = Math.abs(Math.atan2(Math.sin(phi - front), Math.cos(phi - front))) < 0.75;
    if (facing && y > 0.02 && y < 0.3) return mixRgb(p.insulin, p.ink, 0.6); // dose window
    if (y > -0.62 && y < -0.55) return p.cream; // label ring
    return p.insulin;
  };
  fillParts(
    cloud,
    [
      tube(0.016, 0.016, -1.42, -1.17, () => p.cream), // needle
      tube(0.07, 0.19, -1.17, -1.05, () => holder), // tip
      tube(0.19, 0.19, -1.05, -0.72, () => holder), // cartridge holder
      tube(0.205, 0.205, -0.72, 0.55, body),
      tube(0.19, 0.19, 0.55, 0.58, () => p.ink),
      tube(0.215, 0.215, 0.58, 0.86, () => dial, 18), // dose dial with grip
      disc(0.215, 0.86, 1, mixRgb(p.insulin, p.navy, 0.25)),
    ],
    rand,
  );
  // Centered on its length, laid diagonally (needle bottom left) and leaning back a little.
  for (let k = 1; k < count * 3; k += 3) cloud.pos[k] += 0.28;
  return cloud.place({ tiltX: 0.22, tiltZ: -0.78, scale: 1.02, liftY: 0.14 });
}

// ── Rice bowl ───────────────────────────────────────────────────────────────────────────────────────────────────────

function buildBowl(count: number, p: ShapePalette, rand: () => number): ShapeCloud {
  const cloud = new Cloud(count);
  const a = 1;
  const b = 0.72;
  const shell: Part = {
    area: 4.4,
    sample: (r, c) => {
      let t = 0;
      do t = r() * (Math.PI / 2);
      while (r() > Math.sin(t));
      const phi = r() * Math.PI * 2;
      const stripe = t > 1.17 && t < 1.29;
      c.push(
        [a * Math.sin(t) * Math.cos(phi), -b * Math.cos(t), a * Math.sin(t) * Math.sin(phi)],
        [(Math.sin(t) * Math.cos(phi)) / a, -Math.cos(t) / b, (Math.sin(t) * Math.sin(phi)) / a],
        stripe ? p.star : p.meal,
      );
    },
  };
  const rim: Part = {
    area: 1.8,
    sample: (r, c) => {
      const u = r() * Math.PI * 2;
      const v = r() * Math.PI * 2;
      const R = 1 + 0.045 * Math.cos(v);
      c.push(
        [R * Math.cos(u), 0.045 * Math.sin(v), R * Math.sin(u)],
        [Math.cos(v) * Math.cos(u), Math.sin(v), Math.cos(v) * Math.sin(u)],
        mixRgb(p.meal, p.cream, 0.35),
      );
    },
  };
  const rice: Part = {
    area: 3.6,
    sample: (r, c) => {
      let t = 0;
      do t = r() * (Math.PI / 2);
      while (r() > Math.sin(t) + 0.08);
      const phi = r() * Math.PI * 2;
      const n: Vec3 = [(Math.sin(t) * Math.cos(phi)) / 0.96, Math.cos(t) / 0.34, (Math.sin(t) * Math.sin(phi)) / 0.96];
      const nl = Math.hypot(...n);
      const grain = 0.035 * r(); // a bumpy, grainy top
      c.push(
        [
          0.96 * Math.sin(t) * Math.cos(phi) + (n[0] / nl) * grain,
          0.02 + 0.34 * Math.cos(t) + (n[1] / nl) * grain,
          0.96 * Math.sin(t) * Math.sin(phi) + (n[2] / nl) * grain,
        ],
        n,
        mixRgb(p.cream, p.accent, r() * 0.3),
      );
    },
  };
  fillParts(
    cloud,
    [
      shell,
      rim,
      rice,
      tube(0.38, 0.38, -0.84, -0.7, () => mixRgb(p.meal, p.navy, 0.3)), // foot
      // Chopsticks lying on top of the rice, handles over the rim.
      rod([-0.95, 0.42, 0.32], [1.15, 0.46, -0.12], 0.032, p.homeInk),
      rod([-0.9, 0.42, 0.44], [1.18, 0.47, 0.1], 0.032, p.homeInk),
    ],
    rand,
  );
  return cloud.place({ tiltX: 0.3, scale: 1.08, liftY: 0.16 });
}

/** The four sculptures, in the order of the labels in src/content/about.ts. */
export function buildShapes(count: number, palette: ShapePalette): ShapeCloud[] {
  return [buildStar, buildDrop, buildPen, buildBowl].map((build, i) => build(count, palette, seeded(101 + i * 17)));
}

export const SHAPE_COUNT = 4;
