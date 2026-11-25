import { FeatureCard } from "@/components/sections/FeatureCard";
import type { FeatureGroupContent } from "@/content/features";

// One group of feature cards under a small label. Grid: 1 column on phones, 2 on tablets, 3 on desktops.
export function FeatureGroup({ id, title, cards }: FeatureGroupContent) {
  const headingId = `features-${id}`;

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="type-label text-navy">
        {title}
      </h3>
      <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.id}>
            <FeatureCard {...card} />
          </li>
        ))}
      </ul>
    </section>
  );
}
