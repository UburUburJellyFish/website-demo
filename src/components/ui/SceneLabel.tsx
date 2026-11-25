import type { ReactNode } from "react";

type SceneLabelProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Uppercase spaced scene eyebrow, matching the reference typography. An h2, so every part of the story shows up in a
 * screen reader's heading list (under the intro's h1).
 */
export function SceneLabel({ children, className = "" }: SceneLabelProps) {
  return <h2 className={`type-label text-navy tone-dark:text-current ${className}`}>{children}</h2>;
}
