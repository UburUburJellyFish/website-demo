"use client";

import type { ReactNode } from "react";
import { ParallaxStage } from "@/components/parallax/ParallaxStage";
import { buildTimeline } from "@/timeline/claire";

// The Claire story: the stage with Claire's timeline. A client component so the timeline function never has to cross
// from the server; the scenes come in as children and stay server-rendered.
export function ParallaxStory({ children }: { children: ReactNode }) {
  return <ParallaxStage timeline={buildTimeline}>{children}</ParallaxStage>;
}
