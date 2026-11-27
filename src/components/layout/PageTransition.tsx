"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { STAR } from "@/components/ui/StarField";
import { brand } from "@/content/images";
import { seeded } from "@/lib/seeded";

// Three sheets fall from the top, one after the other: Claire yellow, insulin lilac, then the night sky of the app's
// voice screen with stars and Claire falling into place. The page changes behind them, then they fall away (night
// first), so the colors pass by again in reverse and the new page shows. AppColor only.
const SHEETS = ["bg-home-star", "bg-card-insulin", "bg-linear-to-b from-voice-top to-voice-bottom"] as const;

const COVER_MS = 560;
const REVEAL_MS = 600;
const STAGGER_MS = 90;
/** Pause between the new page showing up behind the sheets and the sheets falling away. */
const REVEAL_WAIT_MS = 80;
/** When the night sheet starts to fall. */
const NIGHT_DELAY = (SHEETS.length - 1) * STAGGER_MS;
/** If the new page never shows up (navigation failed), load it the normal way. */
const FALLBACK_MS = 6000;

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.55, 0, 1, 0.45)";

const random = seeded(23);
/**
 * Stars on the night sheet. top is a % of the sheet (130vh tall, starting 15vh above the screen), so 14–86% is on
 * screen. lag: how far above its place a star starts (vh); it falls into place a little after the sheet.
 */
const STARS = Array.from({ length: 34 }, (_, i) => ({
  left: 3 + random() * 94,
  top: 14 + random() * 72,
  size: 0.7 + random() * 1.5,
  rotate: random() * 60 - 30,
  lag: 20 + random() * 45,
  delay: random() * 120,
  color: i % 3 === 0 ? "fill-highlight-chart" : "fill-home-star",
}));

/** "/support/", "/support.html" and "/support" are the same page. */
function clean(path: string) {
  return path.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
}

function play(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  return el.animate(keyframes, { fill: "forwards", ...options });
}

// Page transition for links between pages (/, /support, /privacy): header, footer, "Back to home", the logo.
// One click listener on window (capture phase, so it runs before next/link and the parallax engine) takes over
// links to another page of this site; links to a #section on the same page, other sites, mailto and new tabs are
// left alone. With "reduce motion" on, nothing is taken over and pages change instantly. The overlay only exists
// while a transition runs, so it costs nothing on page load. Browser back/forward changes pages without it.
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [href, setHref] = useState<string | null>(null);
  const overlay = useRef<HTMLDivElement>(null);
  // from: the page the visitor left ("" = no transition). covered: everything has fallen into place.
  // arrived: the new page is on screen behind the sheets.
  const run = useRef({ from: "", covered: false, arrived: false, revealing: false });

  // The sheets fall away once the screen is fully covered and the new page is there, whichever comes last.
  const tryReveal = useCallback(() => {
    const root = overlay.current;
    const state = run.current;
    if (!root || !state.covered || !state.arrived || state.revealing) return;
    state.revealing = true;
    // A short wait so the new page has laid out (the home page's parallax engine starts in an effect). Not
    // requestAnimationFrame: it never fires while the tab is hidden, which would leave the screen covered.
    window.setTimeout(
      () => {
        const sheets = [...root.querySelectorAll("[data-sheet]")].reverse();
        const animations = sheets.map((el, i) =>
          play(el, [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], {
            duration: REVEAL_MS,
            delay: i * STAGGER_MS,
            easing: EASE,
          }),
        );
        // Stars and Claire fall a bit faster than their sheet.
        root.querySelectorAll("[data-star]").forEach((el, i) => {
          const star = STARS[i];
          animations.push(
            play(
              el,
              [
                { transform: `translateY(0) rotate(${star.rotate}deg)` },
                { transform: `translateY(${star.lag}vh) rotate(${star.rotate + 90}deg)` },
              ],
              { duration: REVEAL_MS, easing: EASE_IN },
            ),
          );
        });
        const mascot = root.querySelector("[data-mascot]");
        if (mascot) {
          animations.push(
            play(mascot, [{ transform: "translateY(0)" }, { transform: "translateY(60vh) rotate(25deg)" }], {
              duration: REVEAL_MS,
              easing: EASE_IN,
            }),
          );
        }
        Promise.all(animations.map((animation) => animation.finished))
          .catch(() => undefined)
          .then(() => {
            run.current = { from: "", covered: false, arrived: false, revealing: false };
            setHref(null);
          });
      },
      REVEAL_WAIT_MS,
    );
  }, []);

  // Take over clicks on links to another page.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || clean(url.pathname) === clean(window.location.pathname)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      if (run.current.from) return; // A transition is already running.
      run.current = { from: clean(window.location.pathname), covered: false, arrived: false, revealing: false };
      const target = url.pathname + url.search + url.hash;
      router.prefetch(target);
      setHref(target);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // Cover: the sheets fall in; the page changes as soon as the first one covers the screen.
  useEffect(() => {
    const root = overlay.current;
    if (!href || !root) return;

    const animations = [...root.querySelectorAll("[data-sheet]")].map((el, i) =>
      play(el, [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }], {
        duration: COVER_MS,
        delay: i * STAGGER_MS,
        easing: EASE,
      }),
    );
    const firstSheet = animations[0];
    root.querySelectorAll("[data-star]").forEach((el, i) => {
      const star = STARS[i];
      animations.push(
        play(
          el,
          [
            { transform: `translateY(-${star.lag}vh) rotate(${star.rotate - 90}deg)` },
            { transform: `translateY(0) rotate(${star.rotate}deg)` },
          ],
          { duration: COVER_MS + 40, delay: NIGHT_DELAY + star.delay, easing: EASE_OUT },
        ),
      );
    });
    const mascot = root.querySelector("[data-mascot]");
    if (mascot) {
      // Claire drops in, squashes a little as she lands and settles.
      animations.push(
        play(
          mascot,
          [
            { transform: "translateY(-80vh) rotate(-25deg)", easing: "cubic-bezier(0.5, 0, 0.75, 0)" },
            { offset: 0.7, transform: "translateY(2vh) rotate(4deg) scale(1.06, 0.92)", easing: EASE_OUT },
            { transform: "translateY(0) rotate(0deg) scale(1)" },
          ],
          { duration: 680, delay: NIGHT_DELAY + 40 },
        ),
      );
    }

    firstSheet.finished.then(() => router.push(href)).catch(() => undefined);
    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        run.current.covered = true;
        tryReveal();
      })
      .catch(() => undefined);

    const fallback = window.setTimeout(() => {
      if (!run.current.arrived) window.location.assign(href);
    }, FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [href, router, tryReveal]);

  // The new page is on screen.
  useEffect(() => {
    const state = run.current;
    if (!state.from || clean(pathname) === state.from) return;
    state.arrived = true;
    tryReveal();
  }, [pathname, tryReveal]);

  if (!href) return null;

  return (
    // Covers everything (header included) and catches clicks while it runs. Decorative only.
    <div ref={overlay} aria-hidden className="fixed inset-0 z-100 overflow-hidden">
      {SHEETS.map((sheet, i) => (
        // 130vh tall with a 15vh curve at both ends, so the screen is fully covered while it rests and the edges
        // are round while it moves. Starts above the screen (inline transform) so the first frame shows nothing.
        <div
          key={sheet}
          data-sheet
          className={`absolute inset-x-0 -top-[15vh] h-[130vh] rounded-[50%/15vh] ${sheet}`}
          style={{ transform: "translateY(-100%)" }}
        >
          {i === SHEETS.length - 1 && (
            <>
              {STARS.map((star, j) => (
                <svg
                  key={j}
                  data-star
                  viewBox="0 0 24 24"
                  className={`absolute ${star.color}`}
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: `${star.size}rem`,
                    height: `${star.size}rem`,
                    transform: `translateY(-${star.lag}vh) rotate(${star.rotate - 90}deg)`,
                  }}
                >
                  <polygon points={STAR} />
                </svg>
              ))}
              <div
                data-mascot
                className="absolute top-1/2 left-1/2 size-36 -translate-1/2 md:size-52"
                style={{ transform: "translateY(-80vh)" }}
              >
                <Image
                  src={brand.starMain.src}
                  alt=""
                  width={brand.starMain.width}
                  height={brand.starMain.height}
                  loading="eager"
                  className="size-full"
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
