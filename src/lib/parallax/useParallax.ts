"use client";

// Connects the pure engine (compile.ts, state.ts) to the page: scroll, resize, keyboard focus, #hash links and
// reduced motion. Styles are written straight to the DOM (no React state per frame). Spec: docs/02-parallax.md.

import { useEffect, type RefObject } from "react";
import { compileTimeline, findAnchor, findScene, type CompiledTimeline } from "@/lib/parallax/compile";
import { lerpColor, parseHex, rgbaToCss, TRANSPARENT, type Rgba } from "@/lib/parallax/math";
import { locate, stateAt, toTransform, type FrameState } from "@/lib/parallax/state";
import type { BuildTimeline, ColorToken, Viewport } from "@/lib/parallax/types";

/** Class on <html> while the engine may run. Set before paint by the script in layout.tsx. */
export const PX_ON_CLASS = "px-on";
/** Class on <html> once the page has loaded: lets the stage images that are not on screen yet load (globals.css). */
export const PX_READY_CLASS = "px-ready";
/** Event the header (or anything) sends to jump to a timeline anchor: detail = anchor id. */
export const PX_GOTO_EVENT = "px:goto";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const RESIZE_DEBOUNCE_MS = 150;
/** Touch devices: height-only changes smaller than this (address bar showing/hiding) are ignored. */
const IGNORE_HEIGHT_CHANGE = 0.15;
/**
 * Below this viewport height (phones in landscape, small phones like the iPhone SE) the story is the normal stacked
 * page: there is not enough room for the text and the phone without one covering the other. Keep in sync with
 * PX_ON_SCRIPT in layout.tsx.
 */
export const MIN_STAGE_HEIGHT = 600;
/**
 * Above this root font size (the visitor chose larger text in the browser) the story is the stacked page too: the
 * stage positions are made for the default 16px, and bigger text would run into the phone. Keep in sync with
 * PX_ON_SCRIPT in layout.tsx.
 */
export const MAX_STAGE_FONT_SIZE = 20;

export type ParallaxRefs = {
  /** Tall wrapper: its height is the timeline length + one viewport. */
  stage: RefObject<HTMLElement | null>;
  /** The sticky 100svh box that holds the scenes. */
  viewport: RefObject<HTMLElement | null>;
  /** Color layer over the stage gradient. */
  backdrop: RefObject<HTMLElement | null>;
  /** Optional debug readout (?px-debug). */
  debug: RefObject<HTMLElement | null>;
};

/** Asks a running parallax engine to jump to an anchor. Falls back to a normal #hash jump. */
export function goToAnchor(anchor: string) {
  if (document.documentElement.classList.contains(PX_ON_CLASS)) {
    window.dispatchEvent(new CustomEvent(PX_GOTO_EVENT, { detail: anchor }));
  } else {
    window.location.hash = anchor;
  }
}

/**
 * Where the visitor is, kept across a switch between the stage and the stacked page (turning a phone, resizing a
 * window across MIN_STAGE_HEIGHT): a scene of the story, or a block after the stage (a section, the footer) and how
 * far its top is from the top of the screen. Remembered on scroll, not when the resize is handled: by then the layout
 * has already changed (sections with min-h-svh grow or shrink with the screen).
 */
type Place = { scene: string } | { block: Element; top: number } | null;

/** The block after the stage at the top of the screen, if the visitor is past the stage. */
function placeAfterStage(stage: HTMLElement | null): Place {
  // The stage ref is already null for a moment while React unmounts (or Fast Refresh swaps) the component.
  if (!stage || stage.getBoundingClientRect().bottom > window.innerHeight * 0.3) return null;
  const blocks = [...document.querySelectorAll("main > *, body > footer")].filter(
    (el) => stage.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  const block = blocks.filter((el) => el.getBoundingClientRect().top <= window.innerHeight * 0.3).at(-1);
  return block ? { block, top: block.getBoundingClientRect().top } : null;
}

/** Scrolls a block after the stage back to where it was on screen. */
function restoreBlock(place: { block: Element; top: number }) {
  window.scrollBy({ top: place.block.getBoundingClientRect().top - place.top, behavior: "instant" });
}

export function useParallax(build: BuildTimeline, refs: ParallaxRefs) {
  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia(REDUCED_MOTION);
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    let engine: Engine | null = null;
    let width = window.innerWidth;
    let resizeTimer = 0;
    let place: Place = null;
    let placeFrame = 0;
    let resizing = false;

    const allowed = () =>
      !motion.matches &&
      window.innerHeight >= MIN_STAGE_HEIGHT &&
      parseFloat(getComputedStyle(root).fontSize) <= MAX_STAGE_FONT_SIZE;

    /** On the stacked page: a block after the stage, or the scene at the top of the screen. */
    const stackedPlace = (): Place => {
      const stage = refs.stage.current;
      if (!stage) return null;
      const after = placeAfterStage(stage);
      if (after) return after;
      const scenes = [...stage.querySelectorAll<HTMLElement>("[data-scene]")];
      const current = scenes.filter((scene) => scene.getBoundingClientRect().top <= window.innerHeight * 0.3).at(-1);
      return current && window.scrollY > 0 ? { scene: current.dataset.scene! } : null;
    };
    const remember = () => {
      if (resizing || placeFrame) return;
      placeFrame = requestAnimationFrame(() => {
        placeFrame = 0;
        if (!resizing) place = engine ? engine.place() : stackedPlace();
      });
    };

    const start = (from: Place = null) => {
      if (engine || !allowed() || !refs.stage.current || !refs.viewport.current) return;
      root.classList.add(PX_ON_CLASS);
      engine = new Engine(build, refs);
      if (from) engine.goTo(from);
    };
    const stop = (from: Place = null) => {
      engine?.destroy();
      engine = null;
      root.classList.remove(PX_ON_CLASS);
      if (from && "scene" in from) {
        document.querySelector(`[data-scene="${from.scene}"]`)?.scrollIntoView({ behavior: "instant" });
      } else if (from) {
        restoreBlock(from);
      }
    };
    const update = () => (allowed() ? start(place) : stop(place));
    const onMotionChange = () => {
      update();
      remember();
    };
    const onResize = () => {
      // From here until the switch below, scroll events come from the layout change, not from the visitor.
      resizing = true;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // On touch screens only a width change (turning the phone) counts: the address bar changes the height only.
        if (!isTouch || window.innerWidth !== width) {
          width = window.innerWidth;
          update();
        }
        resizing = false;
        remember();
      }, RESIZE_DEBOUNCE_MS);
    };

    // Decided here, not by the class: the class only covers the first paint, and a remount (React Strict Mode runs
    // effects twice in development) must start again after its own cleanup removed it.
    if (allowed()) start();
    else root.classList.remove(PX_ON_CLASS);
    remember();

    // The first screen first: the other stage images wait for the load event (see PX_READY_CLASS).
    const ready = () => root.classList.add(PX_READY_CLASS);
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    motion.addEventListener("change", onMotionChange);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", remember, { passive: true });
    return () => {
      window.removeEventListener("load", ready);
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", remember);
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(placeFrame);
      stop();
    };
  }, [build, refs]);
}

class Engine {
  private compiled!: CompiledTimeline;
  private stageTop = 0;
  private elements = new Map<string, HTMLElement[]>();
  private scenes: HTMLElement[] = [];
  private written = new WeakMap<HTMLElement, { transform: string; opacity: string }>();
  private colors = new Map<ColorToken, Rgba>();
  private last: FrameState | null = null;
  private frame = 0;
  private resizeTimer = 0;
  private viewportSize = { width: 0, height: 0 };
  private readonly isTouch = window.matchMedia("(pointer: coarse)").matches;
  private readonly showDebug = new URLSearchParams(window.location.search).has("px-debug");

  constructor(
    private readonly build: BuildTimeline,
    private readonly refs: ParallaxRefs,
  ) {
    this.collect();
    this.layout();

    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize);
    window.addEventListener(PX_GOTO_EVENT, this.onGoTo as EventListener);
    window.addEventListener("hashchange", this.onHashChange);
    document.addEventListener("click", this.onClick);
    document.addEventListener("focusin", this.onFocus);

    // Opened with a #hash: a timeline anchor (#story, #beta) or a section after the stage (#features, #about).
    // The browser already scrolled to the section, but before the stage got its height, so scroll again.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) this.scrollToAnchor(hash, "instant");
    this.update();
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.clearTimeout(this.resizeTimer);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener(PX_GOTO_EVENT, this.onGoTo as EventListener);
    window.removeEventListener("hashchange", this.onHashChange);
    document.removeEventListener("click", this.onClick);
    document.removeEventListener("focusin", this.onFocus);
    // Back to the normal stacked page.
    for (const list of this.elements.values()) {
      for (const el of list) {
        el.style.removeProperty("transform");
        el.style.removeProperty("opacity");
      }
    }
    for (const scene of this.scenes) scene.removeAttribute("data-active");
    this.refs.stage.current?.style.removeProperty("height");
    this.refs.backdrop.current?.style.removeProperty("background-color");
    document.documentElement.removeAttribute("data-tone");
    if (this.refs.debug.current) {
      this.refs.debug.current.textContent = "";
      this.refs.debug.current.hidden = true;
    }
  }

  /** Reads the AppColor CSS variables used as keyframe backgrounds. */
  refreshColors(redraw = true) {
    const style = getComputedStyle(document.documentElement);
    this.colors.clear();
    this.colors.set("stage", TRANSPARENT);
    for (const keyframe of this.compiled.keyframes) {
      for (const token of [keyframe.background?.from, keyframe.background?.to]) {
        if (token && !this.colors.has(token)) this.colors.set(token, parseHex(style.getPropertyValue(`--${token}`)));
      }
    }
    if (redraw) this.update(true);
  }

  private collect() {
    const stage = this.refs.stage.current!;
    this.elements.clear();
    for (const el of stage.querySelectorAll<HTMLElement>("[data-px]")) {
      const name = el.dataset.px!;
      this.elements.set(name, [...(this.elements.get(name) ?? []), el]);
    }
    this.scenes = [...stage.querySelectorAll<HTMLElement>("[data-scene]")];
  }

  private readViewport(): Viewport {
    const width = window.innerWidth;
    // The sticky box is 100svh, so its height is the height the timeline is measured in.
    const height = this.refs.viewport.current?.clientHeight || window.innerHeight;
    return { width, height, isMobile: width < 768 };
  }

  private layout() {
    const viewport = this.readViewport();
    this.viewportSize = { width: viewport.width, height: viewport.height };
    this.compiled = compileTimeline(this.build(viewport), viewport);
    this.refreshColors(false); // a new timeline (e.g. the mobile one) may use other colors
    const stage = this.refs.stage.current!;
    stage.style.height = `${this.compiled.total + viewport.height}px`;
    this.stageTop = stage.getBoundingClientRect().top + window.scrollY;
  }

  private position() {
    return window.scrollY - this.stageTop;
  }

  private onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  };

  private onResize = () => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      if (!this.refs.stage.current) return; // unmounting
      const width = window.innerWidth;
      const height = this.refs.viewport.current?.clientHeight || window.innerHeight;
      const before = this.viewportSize;
      const heightOnly = width === before.width;
      if (this.isTouch && heightOnly && Math.abs(height - before.height) / before.height < IGNORE_HEIGHT_CHANGE) return;

      // Keep the visitor on the same keyframe and progress.
      const pos = this.position();
      const inside = pos >= 0 && pos <= this.compiled.total;
      const { index, progress } = locate(this.compiled, pos);
      this.layout();
      if (inside) {
        const keyframe = this.compiled.keyframes[index];
        window.scrollTo({ top: this.stageTop + keyframe.start + progress * keyframe.duration, behavior: "instant" });
      }
      this.update(true);
    }, RESIZE_DEBOUNCE_MS);
  };

  private onGoTo = (event: CustomEvent<string>) => this.scrollToAnchor(event.detail, "smooth");

  /** Plain <a href="#story"> links: jump to the timeline anchor instead of the scene element. */
  private onHashChange = () => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && findAnchor(this.compiled, hash) >= 0) this.scrollToAnchor(hash, "smooth");
  };

  /**
   * Clicks on links to a timeline anchor, anywhere on the page (header, footer). Left alone, the browser scrolls to
   * the scene element, which sits in the sticky box, and a link to the hash already in the address bar fires no
   * hashchange at all. So the engine scrolls to the keyframe itself. Links to normal sections are left to the browser.
   */
  private onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    const anchor = link ? decodeURIComponent(link.hash.slice(1)) : "";
    if (!link || !anchor || findAnchor(this.compiled, anchor) < 0) return;
    event.preventDefault();
    if (window.location.hash !== link.hash) window.history.pushState(null, "", link.hash);
    this.scrollToAnchor(anchor, "smooth");
  };

  private onFocus = (event: FocusEvent) => {
    const scene = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-scene]");
    if (!scene || scene.hasAttribute("data-active")) return;
    this.goToScene(scene.dataset.scene!);
  };

  /** Jumps to the end of the scene's first keyframe: its content has finished coming in. */
  private goToScene(scene: string) {
    const index = findScene(this.compiled, scene);
    if (index < 0) return;
    const keyframe = this.compiled.keyframes[index];
    window.scrollTo({ top: this.stageTop + keyframe.start + keyframe.duration - 1, behavior: "instant" });
  }

  /** Where the visitor is: a block after the stage, the active scene, or null above the stage (see `Place`). */
  place(): Place {
    const after = placeAfterStage(this.refs.stage.current);
    if (after) return after;
    return this.position() > 0 && this.last ? { scene: this.last.scene } : null;
  }

  /** Puts the visitor back where they were on the stacked page (see `Place`). */
  goTo(place: NonNullable<Place>) {
    if ("scene" in place) this.goToScene(place.scene);
    else restoreBlock(place);
    this.update(true);
  }

  scrollToAnchor(anchor: string, behavior: ScrollBehavior) {
    const index = findAnchor(this.compiled, anchor);
    if (index < 0) {
      document.getElementById(anchor)?.scrollIntoView({ behavior });
      return;
    }
    window.scrollTo({ top: this.stageTop + this.compiled.keyframes[index].start + 1, behavior });
  }

  private update(force = false) {
    const state = stateAt(this.compiled, this.position());

    for (const [target, value] of state.targets) {
      const transform = toTransform(value);
      const opacity = String(Math.round(value.opacity * 1000) / 1000);
      for (const el of this.elements.get(target) ?? []) {
        const prev = this.written.get(el);
        if (!force && prev?.transform === transform && prev.opacity === opacity) continue;
        el.style.transform = transform;
        el.style.opacity = opacity;
        this.written.set(el, { transform, opacity });
      }
    }

    if (force || state.scene !== this.last?.scene) {
      for (const scene of this.scenes) scene.toggleAttribute("data-active", scene.dataset.scene === state.scene);
    }
    if (force || state.tone !== this.last?.tone) document.documentElement.dataset.tone = state.tone;

    const { from, to, t } = state.background;
    const color = lerpColor(this.colors.get(from) ?? TRANSPARENT, this.colors.get(to) ?? TRANSPARENT, t);
    const backdrop = this.refs.backdrop.current;
    if (backdrop) backdrop.style.backgroundColor = rgbaToCss(color);

    const debug = this.refs.debug.current;
    if (debug && this.showDebug) {
      debug.hidden = false;
      debug.textContent = [
        `keyframe ${state.index + 1}/${this.compiled.keyframes.length}`,
        `scene    ${state.scene}`,
        `progress ${Math.round(state.progress * 100)}%`,
        `scrollY  ${Math.round(window.scrollY)}`,
        `total    ${Math.round(this.compiled.total)}px`,
        `viewport ${this.compiled.viewport.width}×${this.compiled.viewport.height}${this.compiled.viewport.isMobile ? " mobile" : ""}`,
        `tone     ${state.tone}`,
      ].join("\n");
    }

    this.last = state;
  }
}
