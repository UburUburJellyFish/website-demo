"use client";

import { useEffect, useRef, useState } from "react";
import { PRIVACY_BG } from "@/components/privacy/colors";
import { privacy } from "@/content/privacy";

// The sticky chapter bar under the header: four chips (plain #links, so they work without JavaScript) and a yellow
// reading progress bar (CSS scroll-driven, globals.css). With JavaScript the chapter on screen is marked
// (aria-current="location") and filled with its color, and on phones the bar scrolls sideways to keep it in view.
export function PrivacyChapterNav() {
  const { chapters, chapterNavLabel } = privacy;
  const [active, setActive] = useState<string>(chapters[0].id);
  const list = useRef<HTMLOListElement>(null);
  // Moves right after the page opens happen at once (it may open deep down, e.g. /privacy#contact); later ones glide.
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  useEffect(() => {
    const targets = chapters.map((chapter) => document.getElementById(chapter.id)).filter((el) => el !== null);
    // A chapter counts as "on screen" while it crosses a thin band just above the middle of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [chapters]);

  useEffect(() => {
    const chip = list.current?.querySelector<HTMLElement>(`[data-chapter="${active}"]`);
    const bar = list.current;
    if (!chip || !bar || bar.scrollWidth <= bar.clientWidth) return;
    const left = chip.offsetLeft - bar.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
    bar.scrollTo({ left, behavior: performance.now() - openedAt.current < 1500 ? "instant" : "smooth" });
  }, [active]);

  return (
    <nav
      aria-label={chapterNavLabel}
      className="sticky top-16 z-40 border-b border-frame-line bg-home-cream/85 backdrop-blur-md"
    >
      <ol
        ref={list}
        className="mx-auto flex max-w-[46rem] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden"
      >
        {chapters.map((chapter, i) => {
          const current = chapter.id === active;
          return (
            <li key={chapter.id} data-chapter={chapter.id} className="shrink-0">
              <a
                href={`#${chapter.id}`}
                aria-current={current ? "location" : undefined}
                className={`type-small flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  current ? `${PRIVACY_BG[chapter.color]} text-voice-bottom shadow-clay` : "bg-home-tile text-navy hover:bg-home-accent"
                }`}
              >
                <span className="tabular-nums">{i + 1}</span>
                {chapter.short}
              </a>
            </li>
          );
        })}
      </ol>
      <div aria-hidden className="reading-progress h-1 bg-home-star" />
    </nav>
  );
}
