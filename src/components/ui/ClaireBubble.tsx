import type { ReactNode } from "react";

type BubbleTail = "bottom" | "left" | "right";

type ClaireBubbleProps = {
  children: ReactNode;
  target?: string;
  tail?: BubbleTail;
  className?: string;
};

const TAIL_POS: Record<BubbleTail, string> = {
  bottom: "-bottom-1.5 left-6",
  left: "top-1/2 -left-1.5 -mt-1.5",
  right: "top-1/2 -right-1.5 -mt-1.5",
};

// Speech bubble for Claire's responses, always on home-card with home-ink text.
export function ClaireBubble({ children, target, tail = "bottom", className = "" }: ClaireBubbleProps) {
  return (
    <div
      data-px={target}
      className={`relative w-fit rounded-3xl bg-home-card px-5 py-3 text-home-ink shadow-card ${className}`}
    >
      <p className="type-body font-medium">{children}</p>
      <span aria-hidden className={`absolute size-3 rotate-45 bg-home-card ${TAIL_POS[tail]}`} />
    </div>
  );
}
