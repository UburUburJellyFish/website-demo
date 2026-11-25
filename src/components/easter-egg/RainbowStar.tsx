"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/images";
import { site } from "@/content/site";

// Same rules as the app (View/Home/HomeView.swift): eight taps in a row, each within 2 seconds of the last.
const TAPS = 8;
const TAP_GAP_MS = 2000;

// Easter egg, like Home in the app: tap the header star eight times in a row and the page background runs through
// the rainbow (AppColor.rainbow = hsl(<hue> 100% 77.5%)); eight more taps bring the cream back. Nothing is saved.
// The colors live in globals.css (html[data-rainbow]); with reduced motion one round takes 24s instead of 8s, as in
// the app. A short vibration where the browser supports it, like the app's sensoryFeedback.
export function RainbowStar() {
  const [on, setOn] = useState(false);
  const taps = useRef({ count: 0, last: 0 });

  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-rainbow", on);
    return () => root.removeAttribute("data-rainbow");
  }, [on]);

  const onTap = () => {
    const now = performance.now();
    const t = taps.current;
    t.count = now - t.last > TAP_GAP_MS ? 1 : t.count + 1;
    t.last = now;
    if (t.count < TAPS) return;
    t.count = 0;
    setOn((value) => !value);
    navigator.vibrate?.(40);
  };

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={site.starLabel}
      className="shrink-0 touch-manipulation rounded-full p-1 transition-transform duration-150 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
    >
      <Image src={brand.icon.src} alt="" width={36} height={36} className="size-9 rounded-lg" />
    </button>
  );
}
