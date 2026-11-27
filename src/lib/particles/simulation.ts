// Grain physics for the About playground (components/ui/StarPlayground.tsx), run on the CPU every frame.
//
// Each grain has a home on the sculpture (moving while two shapes morph) and its own position and velocity. A spring
// pulls it home, weaker the further away it is, so grains that were thrown off drift around like dust for a moment
// and then come back and rebuild the shape. The pointer throws grains along the way it moves, pushes them away and
// stirs them; a tap blows the whole sculpture apart. A few grains from the lower half keep dripping off as dust.

import type { ShapeCloud } from "@/lib/particles/shapes";

export type PointerState = {
  /** The line of sight through the pointer, in the sculpture's own space: a point on it and its direction (unit). */
  ox: number;
  oy: number;
  oz: number;
  dx: number;
  dy: number;
  dz: number;
  /** How fast the pointer moves across the sculpture, in units per second (same space). */
  vx: number;
  vy: number;
  vz: number;
  /** 0 = away, 1 = over the panel (eased). */
  amount: number;
};

const SPRING = 0.065; // pull home per frame (at 60 fps)
const DAMPING = 0.91; // velocity kept per frame
const RADIUS = 0.55; // pointer reach, around its line of sight
const THROW = 0.014; // share of the pointer's velocity given to grains it passes
const PUSH = 0.022; // push away from the pointer
const STIR = 0.011; // swirl around the pointer
const DRIFT = 0.0075; // turbulence of grains that are off their home

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export class GrainSimulation {
  /** Positions, used directly as the geometry's position attribute. */
  readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly scatter: Float32Array;
  private from: ShapeCloud;
  private to: ShapeCloud;

  constructor(
    private readonly count: number,
    /** Per grain: morph delay, size, dust pick, phase (same values the shader gets). */
    private readonly seeds: Float32Array,
    shape: ShapeCloud,
  ) {
    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.scatter = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const w = seeds[i * 4 + 3];
      this.scatter.set([Math.sin(w * 43.1), Math.cos(w * 71.7), Math.sin(w * 19.3 + 1)], i * 3);
    }
    this.from = shape;
    this.to = shape;
    this.step(0, 0, 1, null, true);
  }

  /** The morph goes from one shape to the other (both the same when resting). */
  setShapes(from: ShapeCloud, to: ShapeCloud) {
    this.from = from;
    this.to = to;
  }

  /** Blows every grain outward, like a tap on the sculpture. */
  burst() {
    const { count, seeds, vel, scatter, to } = this;
    for (let i = 0; i < count; i += 1) {
      const k = i * 3;
      const power = 0.5 + seeds[i * 4];
      vel[k] += (to.nrm[k] * 0.06 + scatter[k] * 0.05) * power;
      vel[k + 1] += (to.nrm[k + 1] * 0.06 + scatter[k + 1] * 0.05 + 0.01) * power;
      vel[k + 2] += (to.nrm[k + 2] * 0.06 + scatter[k + 2] * 0.05) * power;
    }
  }

  /**
   * Advances one frame. morph: 0 → 1 over a shape change (1 when resting). snap: put every grain at home (start,
   * reduced motion).
   */
  step(dt: number, time: number, morph: number, pointer: PointerState | null, snap = false) {
    const { count, seeds, pos, vel, scatter, from, to } = this;
    const s = Math.min(3, dt * 60);
    const damping = Math.pow(DAMPING, s);
    const touch = pointer && pointer.amount > 0.01 ? pointer : null;
    const reach2 = RADIUS * RADIUS;

    for (let i = 0; i < count; i += 1) {
      const k = i * 3;
      const q = i * 4;
      const phase = seeds[q + 3];

      // Home: between the two shapes, spun and puffed out mid-morph, breathing a little.
      const delay = seeds[q] * 0.4;
      const e = smoothstep(delay, delay + 0.6, morph);
      const swirl = Math.sin(e * Math.PI);
      let hx = from.pos[k] + (to.pos[k] - from.pos[k]) * e;
      let hy = from.pos[k + 1] + (to.pos[k + 1] - from.pos[k + 1]) * e;
      let hz = from.pos[k + 2] + (to.pos[k + 2] - from.pos[k + 2]) * e;
      if (swirl > 0.001) {
        const angle = swirl * (seeds[q] - 0.5) * 3.2;
        const c = Math.cos(angle);
        const sn = Math.sin(angle);
        const rx = c * hx - sn * hz;
        hz = sn * hx + c * hz;
        hx = rx + scatter[k] * 0.6 * swirl;
        hy += (scatter[k + 1] * 0.6 + 0.3) * swirl;
        hz += scatter[k + 2] * 0.6 * swirl;
      }
      const breathe = Math.sin(time * 1.3 + phase * 30) * 0.006;
      hx += to.nrm[k] * breathe;
      hy += to.nrm[k + 1] * breathe;
      hz += to.nrm[k + 2] * breathe;

      // Dripping dust follows its own path (no physics), so it never shoots back up when it starts over.
      const dust = (seeds[q + 2] < 0.05 ? 1 : 0) * smoothstep(0.1, -0.5, to.pos[k + 1]) * (1 - swirl);
      if (dust > 0.001 || snap) {
        const fall = (((time * 0.11 + phase * 7.31) % 1) + 1) % 1;
        pos[k] = hx + dust * Math.sin(fall * 6 + phase * 20) * 0.08 * fall;
        pos[k + 1] = hy - dust * fall * fall * 1.7;
        pos[k + 2] = hz;
        vel[k] = vel[k + 1] = vel[k + 2] = 0;
        continue;
      }

      let px = pos[k];
      let py = pos[k + 1];
      let pz = pos[k + 2];
      let vx = vel[k];
      let vy = vel[k + 1];
      let vz = vel[k + 2];

      // Spring home; weaker when far, so thrown grains float for a while before they gather again.
      const dx = hx - px;
      const dy = hy - py;
      const dz = hz - pz;
      const off = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const pull = SPRING * (0.25 + 0.75 * Math.exp(-off * 3)) * s;
      vx += dx * pull;
      vy += dy * pull;
      vz += dz * pull;

      // Pointer: every grain near its line of sight (front and back of the sculpture) is thrown along the movement,
      // pushed away from the line and stirred around it.
      if (touch) {
        const rx = px - touch.ox;
        const ry = py - touch.oy;
        const rz = pz - touch.oz;
        const along = rx * touch.dx + ry * touch.dy + rz * touch.dz;
        const ax = rx - touch.dx * along;
        const ay = ry - touch.dy * along;
        const az = rz - touch.dz * along;
        const d2 = ax * ax + ay * ay + az * az;
        if (d2 < reach2) {
          const d = Math.sqrt(d2) + 1e-4;
          const f = (1 - d / RADIUS) ** 2 * touch.amount * s;
          // Swirl direction: around the line of sight (its direction × the way out).
          const sx = touch.dy * az - touch.dz * ay;
          const sy = touch.dz * ax - touch.dx * az;
          const sz = touch.dx * ay - touch.dy * ax;
          vx += (touch.vx * THROW + (ax / d) * PUSH + (sx / d) * STIR) * f;
          vy += (touch.vy * THROW + (ay / d) * PUSH + (sy / d) * STIR) * f;
          vz += (touch.vz * THROW + (az / d) * PUSH + (sz / d) * STIR) * f;
        }
      }

      // Off its home, a grain drifts like dust.
      if (off > 0.04) {
        const amp = Math.min(off, 0.8) * DRIFT * s;
        vx += Math.sin(py * 3.1 + time * 1.7 + phase * 11) * amp;
        vy += Math.sin(pz * 2.7 + time * 1.3 + phase * 7) * amp + amp * 0.3;
        vz += Math.sin(px * 2.9 + time * 1.5 + phase * 5) * amp;
      }

      vx *= damping;
      vy *= damping;
      vz *= damping;
      px += vx * s;
      py += vy * s;
      pz += vz * s;
      pos[k] = px;
      pos[k + 1] = py;
      pos[k + 2] = pz;
      vel[k] = vx;
      vel[k + 1] = vy;
      vel[k + 2] = vz;
    }
  }
}
