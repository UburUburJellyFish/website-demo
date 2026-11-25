import { FeatureGroup } from "@/components/sections/FeatureGroup";
import { featureSection } from "@/content/features";

// "Everything in Claire" (#features): every feature of the app in four groups, after the parallax story.
export function FeatureSection() {
  const { id, title, subtitle, groups } = featureSection;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-20 md:px-6 md:py-28"
    >
      <h2 id={`${id}-title`} className="type-display-l text-navy">
        {title}
      </h2>
      <p className="type-body-l mt-3 max-w-2xl">{subtitle}</p>
      <div className="mt-12 flex flex-col gap-14">
        {groups.map((group) => (
          <FeatureGroup key={group.id} {...group} />
        ))}
      </div>
    </section>
  );
}
