import type { ReactNode } from "react";

type SkipLinkProps = {
  href: string;
  children: ReactNode;
};

// The first thing a keyboard reaches on a page: jumps past the header (and on Home, past the long story).
// Visible only while focused.
export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only rounded-full bg-home-star font-semibold text-voice-bottom shadow-card focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:px-5 focus:py-3 focus:outline-2 focus:outline-offset-2 focus:outline-voice-bottom"
    >
      {children}
    </a>
  );
}
