"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { ParallaxDebug } from "@/components/parallax/ParallaxDebug";
import { StageBackground } from "@/components/parallax/StageBackground";
import { useParallax, type ParallaxRefs } from "@/lib/parallax/useParallax";
import type { BuildTimeline } from "@/lib/parallax/types";

type ParallaxStageProps = {
  timeline: BuildTimeline;
  children: ReactNode;
};

// The tall stage of the parallax story. With the engine on (html.px-on) it holds a sticky 100svh box where the
// scenes are stacked and animated while the visitor scrolls through the stage's height. Without it (reduced motion,
// no JavaScript, search engines) the scenes are a normal stacked page. Spec: docs/02-parallax.md.
export function ParallaxStage({ timeline, children }: ParallaxStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const debug = useRef<HTMLPreElement>(null);
  const refs = useMemo<ParallaxRefs>(() => ({ stage, viewport, backdrop, debug }), []);

  useParallax(timeline, refs);

  return (
    <div ref={stage} data-px-stage className="relative">
      <div ref={viewport} data-px-viewport className="relative px:sticky px:top-0 px:h-svh px:overflow-hidden">
        <StageBackground backdropRef={backdrop} />
        {children}
      </div>
      <ParallaxDebug ref={debug} />
    </div>
  );
}
