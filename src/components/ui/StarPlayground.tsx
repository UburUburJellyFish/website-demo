"use client";

import { useEffect, useRef, useState } from "react";

type StarPlaygroundProps = {
  /** Short, device-neutral hint (from src/content/about.ts). Fades out after the first nudge. */
  hint: string;
  className?: string;
};

/** `#rrggbb` → `[r, g, b]`. Colours come from the AppColor tokens in globals.css, never hard-coded here. */
function toRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) || 0,
    parseInt(value.slice(2, 4), 16) || 0,
    parseInt(value.slice(4, 6), 16) || 0,
  ];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// A clean five-pointed star outline in unit space (outer radius 1), pointing up. Not Claire's mascot star — a plain
// star the particles are packed into.
const STAR_INNER = 0.44;
const STAR_VERTS: [number, number][] = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 === 0 ? 1 : STAR_INNER;
  return [Math.cos(a) * r, Math.sin(a) * r];
});

function insideStar(px: number, py: number) {
  let hit = false;
  for (let i = 0, j = 9; i < 10; j = i, i += 1) {
    const [xi, yi] = STAR_VERTS[i];
    const [xj, yj] = STAR_VERTS[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

// A playable cloud of yellow star-dust, in the spirit of the floating particle sculptures on igloo.inc. Hundreds of
// particles are packed into a five-pointed star that drifts and turns gently in 3-D; a faint mesh links neighbours.
// One <canvas> and one requestAnimationFrame loop (no animation library, like the rest of the site). The particles
// scatter away from the cursor and burst on a tap, then ease back home. The loop only runs while the panel is on
// screen and the tab is visible. With reduced motion it draws one still frame and takes no input. The canvas is
// decorative (aria-hidden); the heading carries the meaning.
export function StarPlayground({ hint, className }: StarPlaygroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Non-null aliases so the closures below keep the narrowed type.
    const el: HTMLCanvasElement = canvas;
    const context: CanvasRenderingContext2D = ctx;

    const root = document.documentElement;
    const read = (token: string, fallback: string) =>
      getComputedStyle(root).getPropertyValue(token).trim() || fallback;
    const starRgb = toRgb(read("--home-star", "#ffd658")); // base yellow, deeper
    const glowRgb = toRgb(read("--highlight-chart", "#fee08e")); // lighter yellow, front

    const FOCAL = 2.8; // perspective strength in unit space

    let width = 0;
    let height = 0;
    let radius = 0;
    let count = 0;

    // Per-particle state. ux/uy/uz = home point inside the star slab; o* = screen-space offset (and its velocity) used
    // for the cursor scatter and tap burst; sx/sy/sz = this frame's projected position.
    let ux = new Float32Array(0);
    let uy = new Float32Array(0);
    let uz = new Float32Array(0);
    let seed = new Float32Array(0);
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let ovx = new Float32Array(0);
    let ovy = new Float32Array(0);
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let sz = new Float32Array(0);
    let edgeA = new Int32Array(0);
    let edgeB = new Int32Array(0);

    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let running = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = () => reducedMotion.matches;

    function build() {
      const want = Math.min(1150, Math.max(560, Math.round(Math.min(width, height) * 3.6)));
      radius = Math.min(width, height) * 0.48;
      ux = new Float32Array(want);
      uy = new Float32Array(want);
      uz = new Float32Array(want);
      seed = new Float32Array(want);
      ox = new Float32Array(want);
      oy = new Float32Array(want);
      ovx = new Float32Array(want);
      ovy = new Float32Array(want);
      sx = new Float32Array(want);
      sy = new Float32Array(want);
      sz = new Float32Array(want);

      // Pack points into the star by rejection sampling. A touch of z-thickness, thicker in the middle than at the
      // tips, so the star looks like a softly inflated 3-D slab rather than a flat cut-out.
      let i = 0;
      let guard = 0;
      while (i < want && guard < want * 60) {
        guard += 1;
        const px = Math.random() * 2 - 1;
        const py = Math.random() * 2 - 1;
        if (!insideStar(px, py)) continue;
        const rNorm = Math.min(1, Math.hypot(px, py));
        const thick = 0.08 + 0.2 * (1 - rNorm);
        ux[i] = px;
        uy[i] = py;
        uz[i] = (Math.random() * 2 - 1) * thick;
        seed[i] = Math.random() * Math.PI * 2;
        i += 1;
      }
      count = i;

      // Faint mesh: link each particle to its two nearest neighbours (built once, deduplicated).
      const pairs = new Set<number>();
      for (let a = 0; a < count; a += 1) {
        let n1 = -1;
        let n2 = -1;
        let d1 = Infinity;
        let d2 = Infinity;
        for (let b = 0; b < count; b += 1) {
          if (b === a) continue;
          const dx = ux[a] - ux[b];
          const dy = uy[a] - uy[b];
          const dz = uz[a] - uz[b];
          const d = dx * dx + dy * dy + dz * dz;
          if (d < d1) {
            d2 = d1; n2 = n1; d1 = d; n1 = b;
          } else if (d < d2) {
            d2 = d; n2 = b;
          }
        }
        for (const b of [n1, n2]) {
          if (b < 0) continue;
          pairs.add(Math.min(a, b) * 100000 + Math.max(a, b));
        }
      }
      edgeA = new Int32Array(pairs.size);
      edgeB = new Int32Array(pairs.size);
      let k = 0;
      for (const key of pairs) {
        edgeA[k] = Math.floor(key / 100000);
        edgeB[k] = key % 100000;
        k += 1;
      }
    }

    function project(time: number) {
      const cx = width / 2;
      const cy = height / 2;
      const reduced = isReduced();
      // Gentle wobble instead of a full spin, so the star always faces the viewer and stays readable.
      const angleY = reduced ? -0.2 : Math.sin(time * 0.5) * 0.4;
      const angleX = reduced ? 0.1 : Math.sin(time * 0.37 + 1) * 0.2;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const pushRadius = Math.min(width, height) * 0.3;

      for (let i = 0; i < count; i += 1) {
        const breathe = reduced ? 1 : 1 + Math.sin(time * 0.9 + seed[i]) * 0.015;
        const x0 = ux[i] * breathe;
        const y0 = uy[i] * breathe;
        const z0 = uz[i];

        const x1 = x0 * cosY + z0 * sinY;
        const z1 = -x0 * sinY + z0 * cosY;
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        const persp = FOCAL / (FOCAL - z2);
        const baseX = cx + x1 * radius * persp;
        const baseY = cy + y2 * radius * persp;

        let ax = -ox[i] * 0.02;
        let ay = -oy[i] * 0.02;
        if (!reduced && pointer.active) {
          const dx = baseX + ox[i] - pointer.x;
          const dy = baseY + oy[i] - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < pushRadius) {
            const force = (1 - dist / pushRadius) * 2.4;
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
          }
        }
        ovx[i] = (ovx[i] + ax) * 0.86;
        ovy[i] = (ovy[i] + ay) * 0.86;
        ox[i] += ovx[i];
        oy[i] += ovy[i];

        sx[i] = baseX + ox[i];
        sy[i] = baseY + oy[i];
        sz[i] = z2;
      }
    }

    function render(time: number) {
      project(time);
      context.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Soft central glow.
      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.3);
      glow.addColorStop(0, `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, 0.2)`);
      glow.addColorStop(1, `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, 0)`);
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      // Faint yellow mesh between neighbours.
      context.lineWidth = 1;
      for (let e = 0; e < edgeA.length; e += 1) {
        const a = edgeA[e];
        const b = edgeB[e];
        const depth = (sz[a] + sz[b]) / 2;
        const alpha = 0.1 + Math.max(0, (depth + 0.4) / 0.8) * 0.12;
        context.strokeStyle = `rgba(${starRgb[0]}, ${starRgb[1]}, ${starRgb[2]}, ${alpha})`;
        context.beginPath();
        context.moveTo(sx[a], sy[a]);
        context.lineTo(sx[b], sy[b]);
        context.stroke();
      }

      // Particles: lighter and larger at the front, deeper and smaller at the back.
      const unit = Math.min(width, height) / 205;
      for (let i = 0; i < count; i += 1) {
        const depth = Math.min(1, Math.max(0, (sz[i] + 0.4) / 0.8)); // 0 back … 1 front
        const persp = FOCAL / (FOCAL - sz[i]);
        const size = (1.25 + depth * 1.2) * unit * persp;
        const r = Math.round(lerp(starRgb[0], glowRgb[0], depth));
        const g = Math.round(lerp(starRgb[1], glowRgb[1], depth));
        const b = Math.round(lerp(starRgb[2], glowRgb[2], depth));
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.62 + depth * 0.38})`;
        context.beginPath();
        context.arc(sx[i], sy[i], size, 0, Math.PI * 2);
        context.fill();
      }
    }

    function loop(now: number) {
      render(now / 1000);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      if (isReduced()) {
        render(0); // one still frame, no loop
        return;
      }
      running = true;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function resize() {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (isReduced()) render(0);
    }

    function pointFromEvent(event: PointerEvent) {
      const rect = el.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    const onMove = (event: PointerEvent) => {
      if (isReduced()) return;
      pointFromEvent(event);
      pointer.active = true;
      start();
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (event: PointerEvent) => {
      setNudged(true);
      if (isReduced()) return;
      pointFromEvent(event);
      pointer.active = true;
      const reach = Math.min(width, height) * 0.5;
      for (let i = 0; i < count; i += 1) {
        const dx = sx[i] - pointer.x;
        const dy = sy[i] - pointer.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const kick = Math.max(0, 1 - dist / reach) * 9;
        ovx[i] += (dx / dist) * kick;
        ovy[i] += (dy / dist) * kick;
      }
      start();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    el.addEventListener("pointerdown", onDown);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(el);

    const visible = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0.05 },
    );
    visible.observe(el);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onReducedChange = () => {
      stop();
      resize();
      if (!isReduced()) start();
    };
    reducedMotion.addEventListener("change", onReducedChange);

    resize();

    return () => {
      stop();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
      el.removeEventListener("pointerdown", onDown);
      resizeObserver.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onReducedChange);
    };
  }, []);

  return (
    <div
      className={`relative select-none overflow-hidden rounded-[2rem] bg-home-daily-log-card shadow-clay ${className ?? ""}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full touch-manipulation" />
      <p
        aria-hidden="true"
        className={`type-small pointer-events-none absolute inset-x-0 bottom-4 text-center text-navy transition-opacity duration-500 ${
          nudged ? "opacity-0" : "opacity-70"
        }`}
      >
        {hint}
      </p>
    </div>
  );
}
