import type { Ref } from "react";
import { StarField } from "@/components/ui/StarField";

type StageBackgroundProps = {
  /** Color layer the engine paints with the keyframes' `background`. */
  backdropRef: Ref<HTMLDivElement>;
};

// Behind the scenes while the parallax runs: the stage gradient, a color layer for keyframe backgrounds, three star
// layers at different depths, and a thin frame 10px from the edges (a nod to the reference). Hidden on the stacked page.
export function StageBackground({ backdropRef }: StageBackgroundProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden px:block">
      {/* data-stage-gradient: the easter egg paints the rainbow here (globals.css). */}
      <div data-stage-gradient className="absolute inset-0 bg-linear-to-b from-home-background to-home-cream" />
      <div ref={backdropRef} className="absolute inset-0" />
      <StarField layer="far" />
      <StarField layer="mid" />
      <StarField layer="near" />
      <div className="absolute inset-2.5 border border-frame-line" />
    </div>
  );
}
