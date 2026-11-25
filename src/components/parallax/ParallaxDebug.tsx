import type { Ref } from "react";

// Readout for tuning the timeline. Hidden unless the URL has ?px-debug; the engine shows it and writes the text
// each frame (no React state per frame).
export function ParallaxDebug({ ref }: { ref: Ref<HTMLPreElement> }) {
  return (
    <pre
      ref={ref}
      hidden
      aria-hidden
      className="type-small pointer-events-none fixed right-3 bottom-3 z-50 rounded-2xl bg-voice-bottom/90 px-4 py-3 font-mono text-on-dark shadow-card"
    />
  );
}
