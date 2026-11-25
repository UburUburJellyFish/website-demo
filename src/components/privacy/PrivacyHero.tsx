import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { privacy } from "@/content/privacy";

// Top of the privacy page: a deep navy band (voice-bottom, text on-dark) with the title, a short intro and two chips.
// It starts under the fixed header (mt-16), so the header bar stays cream. The highlight cards overlap its lower edge.
export function PrivacyHero() {
  return (
    <section className="mt-16 bg-voice-bottom pt-12 pb-36 text-on-dark md:pt-16 md:pb-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Link
          href="/"
          className="type-small -ml-1 inline-flex items-center gap-1 rounded-full py-1 pr-2 font-medium text-on-dark/80 transition-colors duration-150 hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark"
        >
          <ChevronLeft aria-hidden className="size-4" />
          {privacy.backLabel}
        </Link>
        <h1 className="type-display-l mt-6">{privacy.title}</h1>
        <p className="type-body-l mt-4 max-w-2xl text-on-dark/85">{privacy.intro}</p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {privacy.chips.map((chip) => (
            <li key={chip} className="type-small rounded-full border border-on-dark/30 px-4 py-1.5 font-semibold">
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
