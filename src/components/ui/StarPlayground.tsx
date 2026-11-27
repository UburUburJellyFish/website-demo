"use client";

import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as T from "three";
import { brand } from "@/content/images";
import { DUST_FRAGMENT, DUST_VERTEX, SCULPTURE_FRAGMENT, SCULPTURE_VERTEX } from "@/lib/particles/shaders";
import { buildShapes, mixRgb, SHAPE_COUNT, type Rgb, type ShapeCloud } from "@/lib/particles/shapes";
import { GrainSimulation, type PointerState } from "@/lib/particles/simulation";
import { seeded } from "@/lib/seeded";

type StarPlaygroundProps = {
  /** Short, device-neutral hint (src/content/about.ts). Fades out after the first nudge. */
  hint: string;
  /** Names of the four sculptures, shown under them: Claire, glucose, insulin, meals. */
  shapes: readonly string[];
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

const MORPH_SECONDS = 1.9;
/** Without input, the next sculpture comes every few seconds, until the visitor taps or uses the arrows. */
const AUTO_SECONDS = 7;
const FOV = 30;
const FOG_NEAR = 5.6;
const FOG_FAR = 10.5;
const CAMERA_Z = 7;
/** The camera steps back until at least this much of the scene fits across (on its own / next to the text). */
const MIN_VISIBLE_WIDTH = 3.1;
const MIN_VISIBLE_WIDTH_WIDE = 5.8;
/** From this width (lg) the sculpture stands right of center, at this share of the width, so the About text fits left. */
const WIDE_FROM = 1024;
const FOCUS_WIDE = 0.68;

/** `#rrggbb` → [r, g, b] in 0…1. The colors are the AppColor tokens in globals.css, read at runtime. */
function token(name: string): Rgb {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  return [parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255];
}

/** A soft round glow (white center fading out), for the halo and the light on the pedestal. */
function glowTexture(THREE: typeof import("three"), color: Rgb) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const [r, g, b] = color.map((v) => Math.round(v * 255));
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gradient.addColorStop(0.35, `rgba(${r},${g},${b},0.45)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

// The About playground, after the particle statues of igloo.inc (their LinkedIn / X section), in Claire's colors:
// a large sculpture made of ~22,000 shaded grains floating over a round pedestal under a ring of light, on a floor of
// light rings in a pale blue fog. A full-width stage: from lg the scene stands right of center and the About text
// (AboutSection) sits on it to the left.
// The arrows (or every 7 s on its own) turn it into the next one: Claire, a glucose drop, an insulin pen, a rice bowl.
// Each grain is simulated (lib/particles/simulation.ts): a sweep of the pointer throws grains off like dust, they drift
// and come back to rebuild the shape; a tap blows it apart; dust keeps dripping from the bottom. Three.js loads lazily
// when the panel scrolls into view and the loop only runs while it is visible. Reduced motion: still sculptures, the
// arrows switch them instantly. No WebGL: Claire's picture instead. The canvas is decorative (aria-hidden).
export function StarPlayground({ hint, shapes, previousLabel, nextLabel, className = "" }: StarPlaygroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const goRef = useRef<(step: 1 | -1) => void>(() => undefined);
  const [current, setCurrent] = useState(0);
  const [nudged, setNudged] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const canvas: HTMLCanvasElement = el;

    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let started = false;
    let visible = false;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let lastChange = 0;
    let userPicked = false;

    // Which sculpture is shown, and the morph in progress.
    let shown = 0;
    let morph: { to: number; progress: number } | null = null;
    let queued: number | null = null;

    // Pointer, eased every frame so the grains flow instead of snapping.
    const pointer = { x: 0, y: 0, inside: false };
    const eased = { x: 0, y: 0, amount: 0 };
    // The pointer as the grains feel it: where it is on the sculpture and how fast it moves there.
    const touch: PointerState = { ox: 0, oy: 0, oz: 0, dx: 0, dy: 0, dz: -1, vx: 0, vy: 0, vz: 0, amount: 0 };
    const lastHit = { x: 0, y: 0, z: 0 };
    let tracking = false;
    let sim: GrainSimulation | null = null;

    let THREE: typeof import("three") | null = null;
    let renderer: T.WebGLRenderer | null = null;
    let scene: T.Scene | null = null;
    let camera: T.PerspectiveCamera | null = null;
    let group: T.Group | null = null;
    let root: T.Group | null = null;
    let sculpture: T.ShaderMaterial | null = null;
    let dust: T.ShaderMaterial | null = null;
    let geometry: T.BufferGeometry | null = null;
    let clouds: ShapeCloud[] = [];

    function uploadPositions() {
      const attribute = geometry?.getAttribute("position") as T.BufferAttribute | undefined;
      if (attribute) attribute.needsUpdate = true;
    }

    function setShape(from: number, to: number) {
      if (!geometry) return;
      const write = (name: string, data: Float32Array) => {
        const attribute = geometry!.getAttribute(name) as T.BufferAttribute;
        (attribute.array as Float32Array).set(data);
        attribute.needsUpdate = true;
      };
      write("aFromNormal", clouds[from].nrm);
      write("aFromColor", clouds[from].col);
      write("aToPos", clouds[to].pos);
      write("aToNormal", clouds[to].nrm);
      write("aToColor", clouds[to].col);
      sim?.setShapes(clouds[from], clouds[to]);
    }

    function go(step: 1 | -1) {
      userPicked = true;
      const base = morph ? (queued ?? morph.to) : shown;
      const target = (base + step + SHAPE_COUNT) % SHAPE_COUNT;
      if (!geometry || reduced()) {
        // Not loaded yet, or reduced motion: switch at once.
        shown = target;
        setCurrent(target);
        if (geometry && sculpture) {
          setShape(target, target);
          sculpture.uniforms.uMorph.value = 1;
          sim?.step(0, clock, 1, null, true);
          uploadPositions();
          renderOnce();
        }
        return;
      }
      if (morph) queued = target;
      else beginMorph(target);
    }
    goRef.current = go;

    function beginMorph(to: number) {
      if (!sculpture) return;
      setShape(shown, to);
      morph = { to, progress: 0 };
      sculpture.uniforms.uMorph.value = 0;
      lastChange = clock;
      setCurrent(to);
    }

    function updatePointer(dt: number) {
      if (!THREE || !camera || !group) return;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(pointer.x, pointer.y), camera);
      const hit = new THREE.Vector3();
      if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit)) return;
      group.updateMatrixWorld();
      group.worldToLocal(hit);
      // The line of sight in the sculpture's space.
      const origin = group.worldToLocal(ray.ray.origin.clone());
      const direction = ray.ray.direction.clone().transformDirection(group.matrixWorld.clone().invert());
      touch.ox = origin.x;
      touch.oy = origin.y;
      touch.oz = origin.z;
      touch.dx = direction.x;
      touch.dy = direction.y;
      touch.dz = direction.z;
      // Velocity from the last frame (eased, capped), so a quick sweep throws grains and a still pointer only parts them.
      if (tracking && dt > 0) {
        const cap = (v: number) => Math.max(-14, Math.min(14, v));
        touch.vx += (cap((hit.x - lastHit.x) / dt) - touch.vx) * 0.5;
        touch.vy += (cap((hit.y - lastHit.y) / dt) - touch.vy) * 0.5;
        touch.vz += (cap((hit.z - lastHit.z) / dt) - touch.vz) * 0.5;
      } else {
        touch.vx = touch.vy = touch.vz = 0;
      }
      lastHit.x = hit.x;
      lastHit.y = hit.y;
      lastHit.z = hit.z;
      tracking = true;
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      clock += dt;
      if (!renderer || !scene || !camera || !group || !sculpture || !dust || !sim) return;

      if (morph) {
        morph.progress = Math.min(1, morph.progress + dt / MORPH_SECONDS);
        sculpture.uniforms.uMorph.value = morph.progress;
        if (morph.progress >= 1) {
          shown = morph.to;
          setShape(shown, shown);
          morph = null;
          if (queued !== null && queued !== shown) beginMorph(queued);
          queued = null;
        }
      } else if (pointer.inside) {
        lastChange = clock; // No new sculpture while the visitor is playing with this one.
      } else if (!userPicked && clock - lastChange > AUTO_SECONDS) {
        beginMorph((shown + 1) % SHAPE_COUNT);
      }

      // Ease the pointer and the push strength.
      const k = 1 - Math.exp(-dt * 6);
      eased.x += (pointer.x - eased.x) * k;
      eased.y += (pointer.y - eased.y) * k;
      eased.amount += ((pointer.inside ? 1 : 0) - eased.amount) * (1 - Math.exp(-dt * 4));

      // Slow sway, leaning a little towards the pointer, and a gentle float.
      group.rotation.y = Math.sin(clock * 0.45) * 0.5 + eased.x * eased.amount * 0.35;
      group.rotation.x = 0.04 - eased.y * eased.amount * 0.12;
      group.position.y = Math.sin(clock * 0.8) * 0.035;
      if (pointer.inside) updatePointer(dt);
      else tracking = false;
      touch.amount = eased.amount;

      sim.step(dt, clock, sculpture.uniforms.uMorph.value, touch);
      uploadPositions();
      sculpture.uniforms.uTime.value = clock;
      dust.uniforms.uTime.value = clock;

      renderer.render(scene, camera);
      if (visible && !disposed) raf = requestAnimationFrame(frame);
    }

    function renderOnce() {
      if (renderer && scene && camera) renderer.render(scene, camera);
    }

    function run() {
      if (!renderer || reduced()) {
        renderOnce();
        return;
      }
      cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function resize() {
      if (!renderer || !camera || !sculpture || !dust) return;
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Step back on narrow screens; on wide ones move the whole scene right, under the label and the arrows.
      const halfFov = (FOV * Math.PI) / 360;
      const wide = width >= WIDE_FROM;
      const minWidth = wide ? MIN_VISIBLE_WIDTH_WIDE : MIN_VISIBLE_WIDTH;
      const distance = Math.max(CAMERA_Z, minWidth / (2 * Math.tan(halfFov) * camera.aspect));
      camera.position.z = distance;
      camera.lookAt(0, 0.1, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      if (root) root.position.x = wide ? (FOCUS_WIDE - 0.5) * 2 * distance * Math.tan(halfFov) * camera.aspect : 0;
      if (THREE) {
        sculpture.uniforms.uLight.value = new THREE.Vector3(-0.65, 0.7, 0.45).normalize().transformDirection(camera.matrixWorldInverse);
      }
      const projScale = (height * ratio) / (2 * Math.tan((FOV * Math.PI) / 360));
      sculpture.uniforms.uProjScale.value = projScale;
      dust.uniforms.uProjScale.value = projScale;
      if (reduced()) renderOnce();
    }

    async function init() {
      if (started) return;
      started = true;
      try {
        THREE = await import("three");
        if (disposed) return;
        // The colors are sRGB hex values from AppColor: pass them through unchanged.
        THREE.ColorManagement.enabled = false;

        const palette = {
          star: token("--home-star"),
          blush: token("--range-low"),
          ink: token("--voice-bottom"),
          cream: token("--home-cream"),
          glucose: token("--card-glucose"),
          insulin: token("--card-insulin"),
          meal: token("--card-meal"),
          homeInk: token("--home-ink"),
          navy: token("--navy"),
          accent: token("--home-accent"),
        };
        const fog = mixRgb(palette.accent, palette.navy, 0.22);
        const color = (rgb: Rgb) => new THREE!.Color(rgb[0], rgb[1], rgb[2]);

        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(color(fog), FOG_NEAR, FOG_FAR + 2);
        camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 40);
        camera.position.set(0, 0.35, CAMERA_Z);
        camera.lookAt(0, 0.1, 0);
        camera.updateMatrixWorld();
        // Everything but the lights, so the whole stage can stand right of center on wide screens.
        root = new THREE.Group();
        scene.add(root);

        // Light for the pedestal and the halo.
        scene.add(new THREE.HemisphereLight(color(palette.cream), color(palette.navy), 1.3));
        const sun = new THREE.DirectionalLight(color(palette.cream), 1.6);
        sun.position.set(-2, 4, 3);
        scene.add(sun);

        // Pedestal: three stacked rounds with glowing edges, and a pool of light where the sculpture floats.
        const stone = mixRgb(palette.accent, palette.navy, 0.2);
        const tiers: [number, number, number][] = [
          [1.75, 0.12, -1.42],
          [1.3, 0.1, -1.31],
          [0.9, 0.08, -1.22],
        ];
        tiers.forEach(([radius, height, y], i) => {
          const tier = new THREE!.Mesh(
            new THREE!.CylinderGeometry(radius, radius * 1.02, height, 96),
            new THREE!.MeshLambertMaterial({ color: color(mixRgb(stone, palette.cream, i * 0.05)) }),
          );
          tier.position.y = y;
          root!.add(tier);
          const edge = new THREE!.Mesh(
            new THREE!.TorusGeometry(radius * 0.985, 0.012, 8, 128),
            new THREE!.MeshBasicMaterial({ color: color(palette.cream) }),
          );
          edge.rotation.x = Math.PI / 2;
          edge.position.y = y + height / 2;
          root!.add(edge);
        });
        // The floor, with wide rings of light around the pedestal that fade into the fog.
        const floor = new THREE.Mesh(new THREE.CircleGeometry(24, 128), new THREE.MeshLambertMaterial({ color: color(stone) }));
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1.485;
        root.add(floor);
        for (const radius of [2.3, 3.0, 3.9, 5.0, 6.3]) {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(radius, radius + 0.014, 192),
            new THREE.MeshBasicMaterial({ color: color(palette.cream), transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
          );
          ring.rotation.x = -Math.PI / 2;
          ring.position.y = -1.478;
          root.add(ring);
        }
        const glow = glowTexture(THREE, palette.cream);
        const pool = new THREE.Mesh(
          new THREE.CircleGeometry(1.1, 64),
          new THREE.MeshBasicMaterial({ map: glow, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending }),
        );
        pool.rotation.x = -Math.PI / 2;
        pool.position.y = -1.175;
        root.add(pool);

        // Halo: a ring of light above, with a soft glow, and a faint column of light down to the pedestal.
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(0.95, 0.03, 12, 128),
          new THREE.MeshBasicMaterial({ color: color(palette.cream) }),
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 1.84;
        root.add(halo);
        const haloGlow = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: glow, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }),
        );
        haloGlow.scale.set(3.4, 1.1, 1);
        haloGlow.position.y = 1.84;
        root.add(haloGlow);
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 1.25, 2.95, 64, 1, true),
          new THREE.MeshBasicMaterial({
            color: color(palette.cream),
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        );
        beam.position.y = 0.37;
        root.add(beam);

        // The sculpture.
        const count = window.innerWidth < 640 ? 14000 : 22000;
        clouds = buildShapes(count, palette);
        geometry = new THREE.BufferGeometry();
        const seeds = new Float32Array(count * 4);
        const random = seeded(7);
        for (let i = 0; i < seeds.length; i += 1) seeds[i] = random();
        sim = new GrainSimulation(count, seeds, clouds[shown]);
        geometry.setAttribute("position", new THREE.BufferAttribute(sim.pos, 3).setUsage(THREE.DynamicDrawUsage));
        for (const name of ["aToPos", "aFromNormal", "aToNormal", "aFromColor", "aToColor"]) {
          geometry.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        }
        geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
        const light = new THREE.Vector3(-0.65, 0.7, 0.45).normalize().transformDirection(camera.matrixWorldInverse);
        sculpture = new THREE.ShaderMaterial({
          vertexShader: SCULPTURE_VERTEX,
          fragmentShader: SCULPTURE_FRAGMENT,
          uniforms: {
            uTime: { value: 0 },
            uMorph: { value: 1 },
            uSize: { value: 0.04 },
            uProjScale: { value: 500 },
            uFogNear: { value: FOG_NEAR },
            uFogFar: { value: FOG_FAR },
            uLight: { value: light },
            uShadow: { value: color(palette.ink) },
            uHighlight: { value: color(palette.cream) },
            uFog: { value: color(fog) },
          },
        });
        const points = new THREE.Points(geometry, sculpture);
        points.frustumCulled = false;
        group = new THREE.Group();
        group.add(points);
        root.add(group);
        setShape(shown, shown);

        // Dust floating in the chamber.
        const dustCount = 260;
        const dustPositions = new Float32Array(dustCount * 3);
        const dustSeeds = new Float32Array(dustCount * 4);
        for (let i = 0; i < dustCount; i += 1) {
          dustPositions.set([(random() * 2 - 1) * 2.4, (random() * 2 - 1) * 2.4, (random() * 2 - 1) * 1.8], i * 3);
          dustSeeds.set([random(), random(), random(), random()], i * 4);
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
        dustGeometry.setAttribute("aSeed", new THREE.BufferAttribute(dustSeeds, 4));
        dust = new THREE.ShaderMaterial({
          vertexShader: DUST_VERTEX,
          fragmentShader: DUST_FRAGMENT,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uTime: { value: 0 },
            uSize: { value: 0.03 },
            uProjScale: { value: 500 },
            uColor: { value: color(palette.cream) },
          },
        });
        const dustPoints = new THREE.Points(dustGeometry, dust);
        dustPoints.frustumCulled = false;
        root.add(dustPoints);

        resize();
        if (visible) run();
      } catch {
        dispose();
        if (!disposed) setFailed(true);
      }
    }

    function dispose() {
      cancelAnimationFrame(raf);
      scene?.traverse((object) => {
        const mesh = object as T.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as T.Material | T.Material[] | undefined;
        for (const m of Array.isArray(material) ? material : material ? [material] : []) {
          (m as T.MeshBasicMaterial).map?.dispose();
          m.dispose();
        }
      });
      renderer?.dispose();
      renderer = null;
      scene = null;
      geometry = null;
      sculpture = null;
      dust = null;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          void init();
          run();
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    const toPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onMove = (event: PointerEvent) => {
      if (reduced()) return;
      toPointer(event);
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
      tracking = false;
    };
    // A finger lifted: stop pushing (a mouse stays over the panel, so it keeps playing).
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onLeave();
    };
    const onDown = (event: PointerEvent) => {
      setNudged(true);
      if (reduced()) return;
      toPointer(event);
      pointer.inside = event.pointerType === "mouse";
      sim?.burst();
      userPicked = true; // After the first tap the visitor decides: no more automatic changes.
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      dispose();
    };
  }, []);

  const step = (direction: 1 | -1) => {
    setNudged(true);
    goRef.current(direction);
  };
  const arrow =
    "flex size-11 items-center justify-center rounded-full text-voice-bottom transition-colors duration-150 hover:bg-home-cream/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voice-bottom";

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-b from-home-background via-home-accent to-[color-mix(in_srgb,var(--home-accent)_78%,var(--navy))] select-none ${className}`}
    >
      {failed ? (
        <Image
          src={brand.starMain.src}
          alt=""
          width={brand.starMain.width}
          height={brand.starMain.height}
          className="absolute top-1/2 left-1/2 size-40 -translate-1/2"
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full touch-pan-y" />
      )}
      {/* The floor fades into the page below the stage. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-home-background" />
      <p
        aria-hidden
        className={`type-small pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 text-center whitespace-nowrap text-voice-bottom transition-opacity duration-500 lg:left-[68%] ${
          nudged ? "opacity-0" : "opacity-80"
        }`}
      >
        {hint}
      </p>
      {/* Under the sculpture: centered on phones and tablets, at FOCUS_WIDE (68%) from lg, where the scene stands. */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 lg:left-[68%]">
        <button type="button" aria-label={previousLabel} onClick={() => step(-1)} className={arrow}>
          <MoveLeft aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
        {/* The name in corner brackets, like a label under a museum piece. */}
        <p aria-live="polite" className="relative min-w-28 px-4 py-2 text-center">
          <span aria-hidden className="absolute top-0 left-0 size-2.5 border-t-2 border-l-2 border-voice-bottom" />
          <span aria-hidden className="absolute top-0 right-0 size-2.5 border-t-2 border-r-2 border-voice-bottom" />
          <span aria-hidden className="absolute bottom-0 left-0 size-2.5 border-b-2 border-l-2 border-voice-bottom" />
          <span aria-hidden className="absolute right-0 bottom-0 size-2.5 border-r-2 border-b-2 border-voice-bottom" />
          <span className="text-xs font-semibold tracking-[0.2em] text-voice-bottom uppercase">{shapes[current]}</span>
        </p>
        <button type="button" aria-label={nextLabel} onClick={() => step(1)} className={arrow}>
          <MoveRight aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
