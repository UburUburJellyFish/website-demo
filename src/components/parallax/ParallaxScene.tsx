import type { ReactNode } from "react";

type ParallaxSceneProps = {
  /** Matches `scene` in the timeline keyframes. */
  id: string;
  /** id for #hash links when the parallax is off (reduced motion, no JavaScript). */
  anchor?: string;
  /** Shown before the engine starts, so the first paint is not empty. Only the first scene. */
  initial?: boolean;
  /** Accessible name of the section. */
  label?: string;
  className?: string;
  children: ReactNode;
};

// One scene of the parallax story. Position its content with normal classes for the stacked page and `px:` classes
// for the stage (e.g. `px:absolute px:top-[63%]`). Elements the timeline moves get `data-px="<name>"`.
export function ParallaxScene({ id, anchor, initial, label, className = "", children }: ParallaxSceneProps) {
  return (
    <section
      data-scene={id}
      data-active={initial ? "" : undefined}
      id={anchor}
      aria-label={label}
      className={`relative scroll-mt-16 px:z-20 ${className}`}
    >
      {children}
    </section>
  );
}
