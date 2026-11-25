"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

// Plain #hash links. The parallax engine catches links to timeline anchors (#story, #beta) and scrolls to their
// keyframe; #features and #about are normal sections the browser scrolls to (scroll-mt clears this header).
const LINK =
  "rounded-full px-3 py-2 transition-colors duration-150 hover:bg-log-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current tone-dark:hover:bg-on-dark/10";
// Primary button: yellow with voice-bottom text (home-ink and navy are too weak on yellow).
const BUTTON =
  "inline-flex shrink-0 items-center rounded-full bg-home-star px-4 py-2 font-semibold text-voice-bottom shadow-card transition-colors duration-150 hover:bg-highlight-chart focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
const MENU_LINK =
  "block rounded-2xl px-4 py-3 type-body-l font-semibold transition-colors duration-150 hover:bg-log-field focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-current tone-dark:hover:bg-on-dark/10";

// The header's links. From md up they sit in a row; below md they open from a menu button. The menu is a native
// <details>, so it opens without JavaScript and screen readers hear "Menu, collapsed/expanded". With JavaScript it
// also closes on Escape (focus goes back to the button), on a tap outside and after choosing a link.
type HeaderNavProps = {
  /** "" on the home page (plain #hash links), "/" on other pages (back to the home page's sections). */
  linkBase?: string;
};

export function HeaderNav({ linkBase = "" }: HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menu.current?.querySelector("summary")?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <nav aria-label={site.navLabel} className="type-small flex items-center gap-1 font-medium">
      <ul className="mr-2 hidden items-center gap-1 md:flex">
        {site.nav.map((item) => (
          <li key={item.href}>
            <a href={`${linkBase}${item.href}`} className={LINK}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a href={`${linkBase}${site.cta.href}`} className={BUTTON}>
        {site.cta.label}
      </a>
      <details
        ref={menu}
        open={open}
        onToggle={(event) => setOpen(event.currentTarget.open)}
        className="md:hidden"
      >
        <summary className="ml-1 flex size-11 cursor-pointer list-none items-center justify-center rounded-full transition-colors duration-150 hover:bg-log-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current tone-dark:hover:bg-on-dark/10 [&::-webkit-details-marker]:hidden">
          <span className="sr-only">{site.menuLabel}</span>
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </summary>
        <ul className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-frame-line bg-home-cream/95 px-3 pt-2 pb-4 shadow-card backdrop-blur-md transition-colors duration-300 tone-dark:border-on-dark/15 tone-dark:bg-voice-bottom/95">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={`${linkBase}${item.href}`} onClick={() => setOpen(false)} className={MENU_LINK}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
