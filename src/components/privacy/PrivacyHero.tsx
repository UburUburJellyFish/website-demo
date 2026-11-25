import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ClaireBubble } from "@/components/ui/ClaireBubble";
import { StarField } from "@/components/ui/StarField";
import { brand } from "@/content/images";
import { privacy } from "@/content/privacy";

// Top of the privacy page, in the home page's own look: the stage gradient (home-background → home-cream) with the
// three star layers (still here: no parallax on this page), the title in Astonpoliz, and Claire herself greeting the
// visitor in a speech bubble. Text left and Claire right from md up; on phones Claire sits between the back link and
// the title.
export function PrivacyHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-home-background to-home-cream pt-28 pb-14 md:pt-32 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <StarField layer="far" />
        <StarField layer="mid" />
        <StarField layer="near" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <Link
          href="/"
          className="type-small -ml-1 inline-flex items-center gap-1 rounded-full py-1 pr-2 font-medium text-navy transition-colors duration-150 hover:text-home-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          <ChevronLeft aria-hidden className="size-4" />
          {privacy.backLabel}
        </Link>
      </div>
      <div className="relative mx-auto mt-4 grid max-w-5xl items-center gap-6 px-4 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:px-6">
        <div className="max-md:text-center">
          <h1 className="type-display-xl text-navy">{privacy.title}</h1>
          <p className="type-body-l mt-5 max-w-xl max-md:mx-auto">{privacy.intro}</p>
          <ul className="mt-7 flex flex-wrap gap-2 max-md:justify-center">
            {privacy.chips.map((chip) => (
              <li key={chip} className="type-small rounded-full bg-home-accent px-4 py-1.5 font-semibold text-navy">
                {chip}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center max-md:order-first">
          <ClaireBubble tail="bottom" className="mb-4 max-w-[17rem] md:-ml-16">
            {privacy.heroBubble}
          </ClaireBubble>
          <Image
            src={brand.starMain.src}
            alt=""
            width={brand.starMain.width}
            height={brand.starMain.height}
            className="size-32 md:size-56"
          />
        </div>
      </div>
    </section>
  );
}
