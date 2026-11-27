// GLSL for the About playground (components/ui/StarPlayground.tsx).
//
// Sculpture: every point is drawn as a tiny shaded ball (a sphere impostor), lit together with the surface normal of
// the shape, so thousands of grains read as one solid, softly lit sculpture, like igloo.inc's particle statues.
// Where each grain is comes from the physics in lib/particles/simulation.ts (position attribute, updated every
// frame); this shader only blends its normal and color between the two shapes of a morph and shrinks dripping dust.

export const SCULPTURE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uProjScale;
uniform float uFogNear;
uniform float uFogFar;
attribute vec3 aToPos;
attribute vec3 aFromNormal;
attribute vec3 aToNormal;
attribute vec3 aFromColor;
attribute vec3 aToColor;
attribute vec4 aSeed; // x: morph delay, y: size, z: dust pick, w: phase
varying vec3 vColor;
varying vec3 vNormal;
varying float vShade;
varying float vFog;

void main() {
  // Same timing as the simulation, so color and shape change together.
  float delay = aSeed.x * 0.4;
  float e = smoothstep(delay, delay + 0.6, uMorph);
  float swirl = sin(e * 3.14159265);
  vec3 nrm = normalize(mix(aFromNormal, aToNormal, e) + vec3(1e-5));
  vColor = mix(aFromColor, aToColor, e);

  // Dripping dust shrinks as it falls.
  float dust = step(aSeed.z, 0.05) * smoothstep(0.1, -0.5, aToPos.y) * (1.0 - swirl);
  float fall = fract(uTime * 0.11 + aSeed.w * 7.31);

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = uSize * (0.55 + aSeed.y * 0.7) * (1.0 - dust * fall * 0.85);
  gl_PointSize = size * uProjScale / -mv.z;

  vNormal = normalize(normalMatrix * nrm);
  // Darker underneath (bounce light from the pedestal) and a little random per grain, for a sculpted, grainy feel.
  vShade = (0.8 + 0.2 * (nrm.y * 0.5 + 0.5)) * (0.86 + 0.14 * fract(aSeed.w * 13.7));
  // Lit from the ring of light above: brighter at the top, a little darker towards the pedestal.
  vShade *= mix(0.8, 1.04, smoothstep(-1.0, 1.3, position.y));
  vFog = smoothstep(uFogNear, uFogFar, -mv.z);
}
`;

export const SCULPTURE_FRAGMENT = /* glsl */ `
uniform vec3 uLight;     // view space
uniform vec3 uShadow;    // voice-bottom
uniform vec3 uHighlight; // home-cream
uniform vec3 uFog;
varying vec3 vColor;
varying vec3 vNormal;
varying float vShade;
varying float vFog;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  c.y = -c.y;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  vec3 ball = vec3(c, sqrt(1.0 - r2));
  vec3 n = normalize(ball * 0.55 + vNormal * 1.0);

  float lambert = dot(n, uLight);
  float spec = pow(clamp(lambert, 0.0, 1.0), 8.0);
  vec3 shadow = mix(vColor * vColor, uShadow, 0.35);
  vec3 highlight = mix(vColor, uHighlight, 0.6);
  vec3 color = mix(shadow, vColor, smoothstep(-0.25, 0.8, lambert));
  color = mix(color, highlight, spec * 0.55);
  // Sides turning away from the camera get darker (soft occlusion), so the outline reads as a rounded sculpture.
  color *= mix(0.62, 1.0, smoothstep(-0.1, 0.75, vNormal.z));
  color *= vShade * (0.8 + 0.2 * ball.z); // grains shade each other where they touch
  gl_FragColor = vec4(mix(color, uFog, vFog), 1.0);
}
`;

// Floating dust in the chamber: soft, faint dots drifting up.
export const DUST_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uProjScale;
attribute vec4 aSeed;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y = mod(p.y + uTime * 0.05 * (0.5 + aSeed.x) + 2.4, 4.8) - 2.4;
  p.x += sin(uTime * 0.3 + aSeed.y * 6.2832) * 0.08;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aSeed.z) * uProjScale / -mv.z;
  vAlpha = 0.3 + 0.45 * aSeed.w;
}
`;

export const DUST_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, vAlpha * (1.0 - smoothstep(0.15, 0.5, d)));
}
`;
