"use client";

import { useEffect, useRef, useState } from "react";
import type * as T from "three";
import type { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer.js";

type StarPlaygroundProps = {
  /** Short, device-neutral hint (from src/content/about.ts). Fades out after the first nudge. */
  hint: string;
  className?: string;
};

type Rgb = [number, number, number];

/** `#rrggbb` → `[r, g, b]` in 0…1. Colours come from the AppColor tokens in globals.css, never hard-coded here. */
function toRgb01(hex: string): Rgb {
  const v = hex.trim().replace("#", "");
  return [
    (parseInt(v.slice(0, 2), 16) || 0) / 255,
    (parseInt(v.slice(2, 4), 16) || 0) / 255,
    (parseInt(v.slice(4, 6), 16) || 0) / 255,
  ];
}
function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

// Rounded five-pointed star outline (like Claire's logo star), used to bake the particle targets.
const STAR_VALLEY = 0.52;
const STAR_POWER = 0.92;
function starRadius(theta: number) {
  const lobe = Math.pow(0.5 + 0.5 * Math.cos(5 * (theta + Math.PI / 2)), STAR_POWER);
  return STAR_VALLEY + (1 - STAR_VALLEY) * lobe;
}
function insideStar(px: number, py: number) {
  const r = Math.hypot(px, py);
  return r === 0 || r <= starRadius(Math.atan2(py, px));
}

const TEX = 300; // 300 × 300 = 90,000 particles
const SHAPE_Y = 0.35; // star centre height above the pedestal
const STAR_R = 1.05; // star radius in world units

// 3-D simplex noise + curl noise, for organic turbulence in the GPU sim.
const NOISE_GLSL = `
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0*C.xxx;
  vec3 x2 = x0 - i2 + 2.0*C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0*C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
         + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
vec3 snoiseVec3(vec3 x){
  return vec3(snoise(x),
              snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
              snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4)));
}
vec3 curlNoise(vec3 p){
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0), dy = vec3(0.0, e, 0.0), dz = vec3(0.0, 0.0, e);
  vec3 p_x0 = snoiseVec3(p - dx), p_x1 = snoiseVec3(p + dx);
  vec3 p_y0 = snoiseVec3(p - dy), p_y1 = snoiseVec3(p + dy);
  vec3 p_z0 = snoiseVec3(p - dz), p_z1 = snoiseVec3(p + dz);
  float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
  float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
  float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);
  vec3 c = vec3(x, y, z) / (2.0 * e);
  float l = length(c);
  return l > 1e-4 ? c / l : vec3(0.0); // NaN-safe normalize
}
`;

const POSITION_SHADER = `
void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  pos += vel;
  gl_FragColor = vec4(pos, 1.0);
}
`;

const VELOCITY_SHADER = `
uniform float uTime;
uniform float uForm;
uniform vec3 uCursor;
uniform float uCursorActive;
uniform sampler2D uTarget;
${NOISE_GLSL}
void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  vec3 target = texture2D(uTarget, uv).xyz;
  float formInv = 1.0 - uForm;

  // Spring toward the star — gentle at first (so the swarm rises and swirls) then firm (crisp, holds the shape).
  vel += (target - pos) * (0.08 + 0.11 * uForm);

  // Rising vortex while forming: a soft swirl around Y plus a little lift, fading out as it settles.
  vec2 rad = pos.xz;
  float rr = length(rad) + 0.001;
  vel.xz += vec2(-rad.y, rad.x) / rr * formInv * 0.01;
  vel.y += formInv * 0.006;

  // Cursor stir: push away + swirl around the pointer.
  if (uCursorActive > 0.5) {
    vec3 d = pos - uCursor;
    float dist = length(d);
    if (dist < 1.05) {
      float f = 1.0 - dist / 1.05;
      vec3 dir = d / (dist + 0.001);
      vel += dir * f * 0.12;
      vel.xz += vec2(-d.z, d.x) / (dist + 0.001) * f * 0.18;
    }
  }

  // Organic turbulence — very light once formed so the star edges stay crisp; stronger while swirling up.
  vel += curlNoise(pos * 0.7 + uTime * 0.12) * (0.001 + formInv * 0.008);

  vel *= 0.85; // drag / momentum
  gl_FragColor = vec4(vel, 1.0);
}
`;

const RENDER_VERTEX = `
uniform sampler2D uPosTex;
uniform float uSize;
uniform float uPixelRatio;
uniform float uFogStart;
uniform float uFogRange;
uniform vec3 uLightDir;
uniform vec3 uShapeCenter;
attribute vec2 reference;
attribute float aScale;
varying float vLight;
varying float vFog;
varying float vAlpha;
void main(){
  vec3 pos = texture2D(uPosTex, reference).xyz;
  vec3 n = normalize(pos - uShapeCenter + vec3(0.0001));
  vLight = clamp(0.3 + 0.7 * dot(n, normalize(uLightDir)), 0.0, 1.0);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  gl_PointSize = uSize * (0.5 + aScale * 0.6) * uPixelRatio / dist;
  vFog = clamp((dist - uFogStart) / uFogRange, 0.0, 1.0);
  vAlpha = 0.6 + aScale * 0.4;
}
`;

const RENDER_FRAGMENT = `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uFogColor;
varying float vLight;
varying float vFog;
varying float vAlpha;
void main(){
  float d = distance(gl_PointCoord, vec2(0.5));
  float strength = 1.0 - smoothstep(0.1, 0.5, d);
  if (strength < 0.02) discard;
  vec3 color = mix(uColorA, uColorB, vLight);
  color = mix(color, uFogColor, vFog * 0.85);
  gl_FragColor = vec4(color, strength * vAlpha * (1.0 - vFog * 0.5));
}
`;

// A playable cloud of star-dust in the spirit of igloo.inc: 90,000 GPU-simulated particles that swirl up from a
// pedestal and assemble into a shaded star inside a cool fog chamber, then scatter from the cursor and re-form. The
// simulation runs entirely on the GPU (Three.js GPUComputationRenderer: position + velocity textures updated by compute
// shaders with curl-noise turbulence); the cursor stirs it, a tap bursts it. Three.js is loaded lazily, only once the
// panel scrolls into view, so it never touches the initial bundle. Reduced motion → the star sits assembled, no loop,
// no input. No WebGL / float textures → the panel stays its chamber colour. The canvas is decorative (aria-hidden).
export function StarPlayground({ hint, className }: StarPlaygroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const el: HTMLCanvasElement = canvas;

    const root = document.documentElement;
    const readColor = (token: string, fallback: string) =>
      toRgb01(getComputedStyle(root).getPropertyValue(token).trim() || fallback);
    const colorA = readColor("--home-star", "#ffd658");
    const colorB = mixRgb(readColor("--highlight-chart", "#fee08e"), readColor("--home-cream", "#fffdf6"), 0.2);
    const chamber = mixRgb(readColor("--home-cream", "#fffdf6"), readColor("--navy", "#3f5996"), 0.42);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = () => reducedMotion.matches;

    let disposed = false;
    let inited = false;
    let running = false;
    let raf = 0;
    let formStart = 0;
    let debugLogged = false;

    let THREE: typeof import("three") | null = null;
    let renderer: T.WebGLRenderer | null = null;
    let scene: T.Scene | null = null;
    let camera: T.PerspectiveCamera | null = null;
    let gpu: GPUComputationRenderer | null = null;
    let posVar: Variable | null = null;
    let velVar: Variable | null = null;
    let points: T.Points | null = null;
    let targetTex: T.DataTexture | null = null;
    let raycaster: T.Raycaster | null = null;
    let plane: T.Plane | null = null;
    const cursor = { nx: 0, ny: 0, active: 0 };

    function render(now: number) {
      if (!gpu || !renderer || !scene || !camera || !posVar || !velVar || !points) return;
      const motion = isReduced() ? 0 : 1;
      const t = now / 1000;
      const form = motion ? Math.min(1, (now - formStart) / 2600) : 1;
      const vu = velVar.material.uniforms;
      vu.uTime.value = t;
      vu.uForm.value = form * form * (3 - 2 * form); // smoothstep ease
      vu.uCursorActive.value = motion ? cursor.active : 0;

      if (motion && cursor.active && raycaster && plane && THREE) {
        raycaster.setFromCamera(new THREE.Vector2(cursor.nx, cursor.ny), camera);
        const hit = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, hit)) {
          vu.uCursor.value.set(hit.x, hit.y, hit.z);
        }
      }

      gpu.compute();
      const mat = points.material as T.ShaderMaterial;
      mat.uniforms.uPosTex.value = gpu.getCurrentRenderTarget(posVar).texture;
      if (!debugLogged) {
        debugLogged = true;
        try {
          const buf = new Float32Array(32);
          renderer.readRenderTargetPixels(gpu.getCurrentRenderTarget(posVar), 0, 0, 4, 2, buf);
          const tgt = targetTex ? (targetTex.image.data as Float32Array) : new Float32Array(8);
          // eslint-disable-next-line no-console
          console.log("[SP] webgl2", renderer.capabilities.isWebGL2, "gpuPos", Array.from(buf.slice(0, 8)), "target", Array.from(tgt.slice(0, 8)));
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("[SP] readback failed", e);
        }
      }
      renderer.render(scene, camera);
    }

    function loop(now: number) {
      render(now);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || !inited || !renderer) return;
      if (isReduced()) {
        render(0);
        return;
      }
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function resize() {
      if (!renderer || !camera) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      if (points) {
        (points.material as T.ShaderMaterial).uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
      }
      if (isReduced()) render(0);
    }

    async function initGL() {
      if (inited) return;
      inited = true;
      try {
        THREE = await import("three");
        const mod = await import("three/examples/jsm/misc/GPUComputationRenderer.js");
        if (disposed || !THREE) return;
        const GPUCompute = mod.GPUComputationRenderer;
        // Colours here are already sRGB (from AppColor hex); pass them straight through, no management.
        THREE.ColorManagement.enabled = false;

        renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: false });
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.setClearColor(new THREE.Color(chamber[0], chamber[1], chamber[2]), 1);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(new THREE.Color(chamber[0], chamber[1], chamber[2]), 3.2, 8.5);
        camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
        camera.position.set(0, 0.5, 4.3);
        camera.lookAt(0, 0.15, 0);

        raycaster = new THREE.Raycaster();
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        gpu = new GPUCompute(TEX, TEX, renderer);
        const pos0 = gpu.createTexture();
        const vel0 = gpu.createTexture();
        const target = new THREE.DataTexture(
          new Float32Array(TEX * TEX * 4),
          TEX,
          TEX,
          THREE.RGBAFormat,
          THREE.FloatType,
        );
        // Float textures must use nearest filtering (linear needs an extension and otherwise reads as 0).
        target.minFilter = THREE.NearestFilter;
        target.magFilter = THREE.NearestFilter;
        targetTex = target;
        const aScale = new Float32Array(TEX * TEX);
        const reference = new Float32Array(TEX * TEX * 2);

        const pd = pos0.image.data as Float32Array;
        const vd = vel0.image.data as Float32Array;
        const td = target.image.data as Float32Array;
        const reduced = isReduced();
        for (let i = 0; i < TEX * TEX; i += 1) {
          // Bake the star target (points inside the rounded star, with 3-D thickness).
          let sx = 0;
          let sy = 0;
          for (let tries = 0; tries < 40; tries += 1) {
            sx = Math.random() * 2 - 1;
            sy = Math.random() * 2 - 1;
            if (insideStar(sx, sy)) break;
          }
          const rNorm = Math.min(1, Math.hypot(sx, sy));
          const sz = (Math.random() * 2 - 1) * (0.22 + 0.4 * (1 - rNorm));
          td[i * 4] = sx * STAR_R;
          td[i * 4 + 1] = SHAPE_Y + sy * STAR_R;
          td[i * 4 + 2] = sz * STAR_R;
          td[i * 4 + 3] = Math.random();

          // DEBUG: start already assembled on the star target.
          void reduced;
          pd[i * 4] = td[i * 4];
          pd[i * 4 + 1] = td[i * 4 + 1];
          pd[i * 4 + 2] = td[i * 4 + 2];
          pd[i * 4 + 3] = 1;
          vd[i * 4] = vd[i * 4 + 1] = vd[i * 4 + 2] = 0;
          vd[i * 4 + 3] = 1;

          aScale[i] = Math.pow(Math.random(), 1.6);
          const x = i % TEX;
          const y = Math.floor(i / TEX);
          reference[i * 2] = (x + 0.5) / TEX;
          reference[i * 2 + 1] = (y + 0.5) / TEX;
        }
        target.needsUpdate = true;

        posVar = gpu.addVariable("texturePosition", POSITION_SHADER, pos0);
        velVar = gpu.addVariable("textureVelocity", VELOCITY_SHADER, vel0);
        gpu.setVariableDependencies(posVar, [posVar, velVar]);
        gpu.setVariableDependencies(velVar, [posVar, velVar]);
        velVar.material.uniforms.uTime = { value: 0 };
        velVar.material.uniforms.uForm = { value: 0 };
        velVar.material.uniforms.uCursor = { value: new THREE.Vector3(999, 999, 999) };
        velVar.material.uniforms.uCursorActive = { value: 0 };
        velVar.material.uniforms.uTarget = { value: target };
        const err = gpu.init();
        if (err) {
          disposeAll();
          return;
        }

        // Pedestal: a short cylinder podium with a brighter rim, fading into the fog.
        const pedMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setRGB(...(mixRgb(chamber, [1, 1, 1] as Rgb, 0.15) as Rgb)),
          fog: true,
        });
        const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.45, 72), pedMat);
        pedestal.position.y = -1.32;
        scene.add(pedestal);
        const rim = new THREE.Mesh(
          new THREE.CylinderGeometry(1.12, 1.12, 0.05, 72),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setRGB(...(mixRgb(chamber, [1, 1, 1] as Rgb, 0.32) as Rgb)),
            fog: true,
          }),
        );
        rim.position.y = -1.08;
        scene.add(rim);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TEX * TEX * 3), 3));
        geometry.setAttribute("reference", new THREE.BufferAttribute(reference, 2));
        geometry.setAttribute("aScale", new THREE.BufferAttribute(aScale, 1));
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uPosTex: { value: null },
            uSize: { value: 7 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
            uFogStart: { value: 3.2 },
            uFogRange: { value: 5.0 },
            uLightDir: { value: new THREE.Vector3(-0.3, 0.9, 0.5) },
            uShapeCenter: { value: new THREE.Vector3(0, SHAPE_Y, 0) },
            uColorA: { value: new THREE.Vector3(colorA[0], colorA[1], colorA[2]) },
            uColorB: { value: new THREE.Vector3(colorB[0], colorB[1], colorB[2]) },
            uFogColor: { value: new THREE.Vector3(chamber[0], chamber[1], chamber[2]) },
          },
          vertexShader: RENDER_VERTEX,
          fragmentShader: RENDER_FRAGMENT,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          blending: THREE.NormalBlending,
        });
        points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        scene.add(points);

        formStart = performance.now();
        resize();
        start();
      } catch {
        disposeAll();
      }
    }

    function disposeAll() {
      stop();
      scene?.traverse((obj) => {
        const mesh = obj as T.Mesh;
        mesh.geometry?.dispose?.();
        const m = mesh.material as T.Material | T.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose?.();
      });
      gpu?.dispose?.();
      renderer?.dispose();
      scene = null;
      camera = null;
      gpu = null;
      posVar = null;
      velVar = null;
      points = null;
    }

    const visible = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void initGL();
            start();
          } else {
            stop();
          }
        }
      },
      { threshold: 0.05 },
    );
    visible.observe(el);

    const resizeObserver = new ResizeObserver(() => {
      if (inited) resize();
    });
    resizeObserver.observe(el);

    function setCursor(event: PointerEvent) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      cursor.nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      cursor.ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    }
    const onMove = (event: PointerEvent) => {
      if (isReduced()) return;
      setCursor(event);
      cursor.active = 1;
      start();
    };
    const onLeave = () => {
      cursor.active = 0;
    };
    const onDown = (event: PointerEvent) => {
      setNudged(true);
      if (isReduced()) return;
      setCursor(event);
      cursor.active = 1;
      // A tap re-seeds the formation clock partway, giving an extra swirl surge.
      formStart = Math.min(formStart, performance.now() - 1600);
      start();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    el.addEventListener("pointerdown", onDown);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
    };
    el.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      visible.disconnect();
      resizeObserver.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
      el.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("webglcontextlost", onContextLost);
      disposeAll();
    };
  }, []);

  return (
    <div
      className={`relative select-none overflow-hidden rounded-[2rem] shadow-clay ${className ?? ""}`}
      style={{ background: "color-mix(in srgb, var(--navy) 42%, var(--home-cream))" }}
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
