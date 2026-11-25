import Link from "next/link";
import { RainbowStar } from "@/components/easter-egg/RainbowStar";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { site } from "@/content/site";

type SiteHeaderProps = {
  /** "" on the home page, "/" on other pages, so the nav links lead back to the home page's sections. */
  linkBase?: string;
};

// Fixed at the top over the parallax stage and the sections. Colors follow the stage's tone (html[data-tone], set by
// the engine): home-ink on a frosted home-cream bar, on-dark on a frosted voice-bottom bar while the stage is navy.
// On the yellow CTA stage the bar stays cream, so the text never sits on yellow. Without the engine (reduced motion,
// short screens, no JavaScript) there is no data-tone and the header stays in its light tone.
// The star is the easter egg button (RainbowStar); the name next to it links home.
export function SiteHeader({ linkBase = "" }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-home-ink transition-colors duration-300 tone-dark:text-on-dark">
      {/* The frosted bar is its own layer: an element with backdrop-filter would stop the menu panel inside it from
          blurring the page. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 border-b border-frame-line bg-home-cream/75 backdrop-blur-md transition-colors duration-300 tone-dark:border-on-dark/15 tone-dark:bg-voice-bottom/45"
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="-ml-1 flex shrink-0 items-center gap-1">
          <RainbowStar />
          <Link
            href="/"
            className="rounded-full px-1 py-1.5 font-display text-xl leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            {site.name}
          </Link>
        </div>
        <HeaderNav linkBase={linkBase} />
      </div>
    </header>
  );
}
