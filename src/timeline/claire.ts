// Timeline of the Claire parallax story (docs/02-parallax.md, sections 5 and 6).
// Phase 3 covers keyframes 1–7 (intro, burden, meet). Phase 4 and 5 append the remaining scenes.

import type { Animation, BuildTimeline, Length } from "@/lib/parallax/types";

/** Explosion of the 16 tiles (docs/02-parallax.md, "Nilai ledakan 16 tile"): [x, y, scale]. */
const EXPLOSION: [Length, Length, number][] = [
  ["-10vw", "-15vh", 2],
  ["-4vw", "-5vh", 1],
  ["2vw", "-9vh", 1.2],
  ["8vw", "-17vh", 1.5],
  ["-15vw", "-2vh", 2],
  ["-7vw", "-1vh", 1.2],
  ["2vw", "-4vh", 1.1],
  ["12vw", "-3vh", 1.8],
  ["-12vw", "3vh", 1.5],
  ["-4vw", "5vh", 1],
  ["6vw", "8vh", 1.4],
  ["20vw", "1vh", 1.9],
  ["-12vw", "8vh", 1.8],
  ["-3vw", "4vh", 1.3],
  ["5vw", "14vh", 1.7],
  ["9vw", "6vh", 2],
];

const explodeTiles: Animation[] = EXPLOSION.map(([x, y, scale], i) => ({
  target: `tile-${i + 1}`,
  x,
  y,
  scale,
  opacity: [1, 0],
}));

export const buildTimeline: BuildTimeline = ({ isMobile }) => [
  // Keyframe 1: intro — wordmark & tagline rise and fade; 3 star depths drift upward.
  {
    scene: "intro",
    duration: "100vh",
    animations: [
      { target: "wordmark", y: -140, opacity: 0 },
      { target: "tagline", y: -110, opacity: 0 },
      { target: "scroll-hint", opacity: [1, 0] },
      { target: "stars-far", y: "-10vh" },
      { target: "stars-mid", y: "-25vh" },
      { target: "stars-near", y: "-45vh" },
    ],
  },

  // Keyframe 2: burden — everyday logging text and 4×4 tile grid rise into view.
  {
    scene: "burden",
    duration: "150vh",
    animations: [
      { target: "burden-text", y: isMobile ? "-16vh" : "-25vh", opacity: [0, 1.75] },
      { target: "tile-grid", y: isMobile ? "-58vh" : "-70vh", opacity: [0, 1] },
    ],
  },

  // Keyframe 3: burden — 16 tiles explode outward in different directions.
  {
    scene: "burden",
    duration: "150vh",
    animations: explodeTiles,
  },

  // Keyframe 4: burden — burden text exits upward while "Claire takes it from here." appears.
  {
    scene: "burden",
    duration: "100vh",
    animations: [
      { target: "burden-text", y: isMobile ? ["-16vh", "-30vh"] : ["-25vh", "-40vh"], opacity: [1, 0] },
      { target: "relief-text", y: ["4vh", 0], opacity: [0, 1.5] },
    ],
  },
  // Pause so "Claire takes it from here." can be read, then fade it out before switching to `meet`.
  { scene: "burden", duration: "55vh", animations: [] },
  {
    scene: "burden",
    duration: "45vh",
    animations: [{ target: "relief-text", y: "-4vh", opacity: 0 }],
  },

  // Keyframe 5: meet — backdrop shifts from cream to sky blue as Claire spins in and greets the visitor.
  {
    scene: "meet",
    duration: "100vh",
    background: ["home-cream", "home-background"],
    animations: [
      { target: "star", scale: [0.4, 1], rotate: [-30, 0], opacity: [0, 1] },
      { target: "hello", y: ["10vh", 0], opacity: [0, 1.5] },
    ],
  },

  // Keyframe 6: meet — Claire settles into the top-left, Home screen phone rises, meet text arrives.
  {
    scene: "meet",
    duration: "150vh",
    animations: [
      { target: "phone", x: isMobile ? [0, 0] : ["20vw", "20vw"], y: ["100vh", 0], opacity: [0, 1.5] },
      { target: "meet-text", y: isMobile ? "-15vh" : "-25vh", opacity: [0, 1.75] },
      { target: "star", x: isMobile ? "-35vw" : "-32vw", y: "-30vh", scale: isMobile ? 0.35 : 0.45 },
      // Gone by halfway, before the rising phone reaches the line (nothing may cover the Apple bezel).
      { target: "hello", opacity: [1, -1] },
    ],
  },

  // Keyframe 7: meet — pause for reading; `#story` nav link lands here.
  {
    scene: "meet",
    duration: "65vh",
    anchor: "story",
    animations: [],
  },

  // ── Phase 4: scene `log` (docs keyframes 8–14). The phone stays where `meet` left it. ──

  // Meet leaves: its text and Claire fade out while the scene is still `meet` (a scene switch hides it at once).
  {
    scene: "meet",
    duration: "60vh",
    animations: [
      { target: "meet-text", y: isMobile ? "-19vh" : "-29vh", opacity: 0 },
      { target: "star", opacity: 0 },
    ],
  },

  // Keyframe 8: voice log. The stage turns voice-top with a light text tone; the voice screen and its glow come in.
  {
    scene: "log",
    duration: "100vh",
    background: "voice-top",
    tone: "dark",
    animations: [
      { target: "voice-text", y: ["3vh", 0], opacity: [0, 1.5] },
      { target: "screen-voice", opacity: [0, 1] },
      { target: "voice-glow", scale: [0.6, 1.2], opacity: [0, 0.6] },
      { target: "bubble-voice", y: ["3vh", 0], opacity: [-0.5, 1] },
    ],
  },
  // Keyframe 9: pause to read.
  { scene: "log", duration: "60vh", animations: [] },

  // Keyframe 10: meal photo. Back to cream; three ingredient chips fly in one after another.
  {
    scene: "log",
    duration: "100vh",
    background: "home-cream",
    tone: "light",
    animations: [
      { target: "voice-text", y: "-3vh", opacity: 0 },
      { target: "bubble-voice", opacity: 0 },
      { target: "voice-glow", scale: 1.4, opacity: 0 },
      { target: "meal-text", y: ["3vh", 0], opacity: [-0.5, 1.5] },
      { target: "screen-meal", opacity: [0, 1] },
      { target: "ingredient-1", x: [isMobile ? "15vw" : "12vw", 0], opacity: [0, 1] },
      { target: "ingredient-2", x: [isMobile ? "22vw" : "18vw", 0], opacity: [-0.35, 1] },
      { target: "ingredient-3", x: [isMobile ? "29vw" : "24vw", 0], opacity: [-0.7, 1] },
      { target: "bubble-meal", y: ["3vh", 0], opacity: [-0.6, 1] },
    ],
  },
  // Keyframe 11: pause to read.
  { scene: "log", duration: "60vh", animations: [] },

  // Keyframe 12: glucose. The three Daily log buttons pop in; glucose is the one being shown.
  {
    scene: "log",
    duration: "100vh",
    animations: [
      { target: "meal-text", y: "-3vh", opacity: 0 },
      { target: "bubble-meal", opacity: 0 },
      { target: "ingredient-1", opacity: 0 },
      { target: "ingredient-2", opacity: 0 },
      { target: "ingredient-3", opacity: 0 },
      { target: "quick-text", y: ["3vh", 0], opacity: [-0.4, 1.5] },
      { target: "screen-glucose", opacity: [0, 1] },
      { target: "deck-glucose", scale: [0.5, 1.15], opacity: [0, 1] },
      { target: "deck-insulin", scale: [0.5, 1], opacity: [-0.4, 1] },
      { target: "deck-activity", scale: [0.5, 1], opacity: [-0.8, 1] },
    ],
  },
  // Keyframe 13: insulin.
  {
    scene: "log",
    duration: "100vh",
    animations: [
      { target: "screen-insulin", opacity: [0, 1] },
      { target: "deck-glucose", scale: 1 },
      { target: "deck-insulin", scale: 1.15 },
    ],
  },
  // Keyframe 14: activity.
  {
    scene: "log",
    duration: "100vh",
    animations: [
      { target: "screen-activity", opacity: [0, 1] },
      { target: "deck-insulin", scale: 1 },
      { target: "deck-activity", scale: 1.15 },
    ],
  },
  // Pause on the last screen.
  { scene: "log", duration: "60vh", animations: [] },

  // ── Phase 5: tips, dose, history, connect, cta (docs keyframes 15–24). ──
  // Every scene ends with a short "leave" keyframe in its own scene: a scene switch hides the old scene at once.

  // Log leaves.
  { scene: "log", duration: "50vh", animations: [{ target: "quick-text", y: "-3vh", opacity: 0 }] },

  // Keyframe 15: little tips. The phone shows the low-glucose tip; both cards slide in from the left, one after the
  // other (from the right or from below they would cross the phone).
  {
    scene: "tips",
    duration: "120vh",
    animations: [
      // Mobile: no room beside the cards, so the phone fades out (it comes back in `connect`).
      { target: "phone", x: isMobile ? 0 : "24vw", opacity: isMobile ? [1, -2] : 1 },
      { target: "screen-tips", opacity: [0, 1] },
      { target: "tips-text", y: ["3vh", 0], opacity: [0, 1.5] },
      { target: "card-low", x: ["-40vw", 0], opacity: [0, 1] },
      { target: "card-high", x: ["-40vw", 0], opacity: [-0.5, 1] },
    ],
  },
  // Keyframe 16: pause to read.
  { scene: "tips", duration: "50vh", animations: [] },
  // Tips leave; the phone drops out of view.
  {
    scene: "tips",
    duration: "50vh",
    animations: [
      { target: "tips-text", y: "-20vh", opacity: 0 },
      { target: "card-low", y: "-20vh", opacity: 0 },
      { target: "card-high", y: "-20vh", opacity: 0 },
      { target: "phone", y: "100vh" },
    ],
  },

  // Keyframe 17: "Your dose, your call." on deep navy.
  {
    scene: "dose",
    duration: "100vh",
    background: "voice-bottom",
    tone: "dark",
    animations: [
      { target: "dose-statement", scale: [0.8, 1], opacity: [0, 2] },
      { target: "dose-sub", y: ["2vh", 0], opacity: [-0.5, 1] },
    ],
  },
  // Keyframe 18: pause to read.
  { scene: "dose", duration: "50vh", animations: [] },
  // Dose leaves.
  {
    scene: "dose",
    duration: "50vh",
    animations: [
      { target: "dose-statement", scale: 1.05, opacity: 0 },
      { target: "dose-sub", opacity: 0 },
    ],
  },

  // Keyframe 19: history. Upright phones fade in and drift up at three speeds (depth). They stay fully on screen and
  // upright: Apple's bezel rules forbid tilting and cropping.
  {
    scene: "history",
    duration: "120vh",
    background: "home-background",
    tone: "light",
    animations: [
      { target: "wall", opacity: [0, 1] },
      { target: "wall-col-1", y: ["14vh", "-2vh"] },
      { target: "wall-col-2", y: ["24vh", "6vh"] },
      { target: "wall-col-3", y: ["10vh", "-4vh"] },
      { target: "history-text", y: ["3vh", 0], opacity: [-0.3, 1.5] },
    ],
  },
  // Keyframe 20: weekly insights. The wall is gone by halfway; then the Summary phone rises (no spin, no scaling).
  {
    scene: "history",
    duration: "120vh",
    animations: [
      { target: "wall", opacity: [1, -1] },
      { target: "wall-col-1", y: "-10vh" },
      { target: "wall-col-2", y: "-2vh" },
      { target: "wall-col-3", y: "-12vh" },
      { target: "history-text", y: "-3vh", opacity: [1, -1] },
      { target: "insight-text", y: ["3vh", 0], opacity: [-1, 1] },
      { target: "wall-hero", y: ["30vh", 0], opacity: [-1, 1] },
      { target: "bubble-insight", y: ["3vh", 0], opacity: [-1, 1] },
    ],
  },
  // Pause to read.
  { scene: "history", duration: "50vh", animations: [] },
  // History leaves. Out of sight, the shared phone moves to the center and switches to the widget screen.
  {
    scene: "history",
    duration: "50vh",
    animations: [
      { target: "wall", opacity: 0 },
      { target: "insight-text", opacity: 0 },
      { target: "bubble-insight", opacity: 0 },
      { target: "wall-hero", opacity: 0 },
      { target: "phone", x: 0 },
      { target: "screen-widget", opacity: [0, 1] },
    ],
  },

  // Keyframe 21: connect. The phone comes back up; four chips fly in from the corners (the reverse of the explosion).
  {
    scene: "connect",
    duration: "120vh",
    animations: [
      { target: "phone", y: 0, opacity: 1 },
      { target: "connect-label", opacity: [0, 1.5] },
      { target: "chip-glucometer", x: ["-40vw", 0], y: ["-40vh", 0], scale: [1.5, 1], opacity: [0, 1] },
      { target: "chip-health", x: ["40vw", 0], y: ["-40vh", 0], scale: [1.5, 1], opacity: [0, 1] },
      { target: "chip-reminders", x: ["-40vw", 0], y: ["40vh", 0], scale: [1.5, 1], opacity: [0, 1] },
      { target: "chip-widgets", x: ["40vw", 0], y: ["40vh", 0], scale: [1.5, 1], opacity: [0, 1] },
    ],
  },
  // Keyframe 22: pause to read.
  { scene: "connect", duration: "50vh", animations: [] },
  // Connect leaves; the phone fades away for good.
  {
    scene: "connect",
    duration: "50vh",
    animations: [
      { target: "connect-label", opacity: 0 },
      { target: "chip-glucometer", scale: 0.9, opacity: 0 },
      { target: "chip-health", scale: 0.9, opacity: 0 },
      { target: "chip-reminders", scale: 0.9, opacity: 0 },
      { target: "chip-widgets", scale: 0.9, opacity: 0 },
      // Fades where it is: moving up would slide the bezel under the label.
      { target: "phone", opacity: 0 },
    ],
  },

  // Keyframe 23: join the beta on home-star yellow.
  {
    scene: "cta",
    duration: "80vh",
    background: "home-star",
    animations: [
      { target: "cta-block", scale: [0.8, 1], opacity: [0, 2] },
      { target: "qr-card", y: ["20vh", 0], opacity: [0, 1] },
      { target: "bubble-cta", y: ["3vh", 0], opacity: [-0.6, 1] },
    ],
  },
  // Keyframe 24: final pause, then the page scrolls on normally. "#beta" lands here, with everything in place.
  { scene: "cta", duration: "80vh", anchor: "beta", animations: [] },
];
