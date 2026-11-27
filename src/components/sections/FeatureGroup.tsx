import { FeatureCard } from "@/components/sections/FeatureCard";
import { PRIVACY_BG } from "@/components/privacy/colors";
import type { FeatureGroupContent } from "@/content/features";

type FeatureGroupProps = FeatureGroupContent & {
  /** Position in the section, shown as 01–04. */
  index: number;
};

// One group of features as an editorial row: on the left the number in a clay tile of the group's color, the title in
// the display font and one line about the group (it stays in view while its cards scroll by, from lg); on the right a
// two-column bento grid with the featured card across the top. Phones: the heading, then one card per row.
export function FeatureGroup({ id, title, text, color, featured, cards, index }: FeatureGroupProps) {
  const headingId = `features-${id}`;

  return (
    <section aria-labelledby={headingId} className="grid gap-6 lg:grid-cols-12 lg:gap-12">
      <header className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <span
          aria-hidden
          className={`flex size-12 items-center justify-center rounded-2xl border-3 border-home-card font-display text-xl text-voice-bottom shadow-clay ${PRIVACY_BG[color]}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 id={headingId} className="mt-5 font-display text-[2rem] leading-tight text-navy md:text-[2.5rem]">
          {title}
        </h3>
        <p className="type-body-l mt-2 max-w-sm text-pretty">{text}</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:gap-5">
        {cards.map((card) => (
          <li key={card.id} className={card.id === featured ? "sm:col-span-2" : undefined}>
            <FeatureCard {...card} color={color} featured={card.id === featured} />
          </li>
        ))}
      </ul>
    </section>
  );
}
