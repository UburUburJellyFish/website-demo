import { FeatureGroup } from "@/components/sections/FeatureGroup";
import { featureSection } from "@/content/features";

// "Everything in Claire" (#features): every feature of the app in four numbered groups, after the parallax story.
// A thin line separates the groups, so the long list reads as four short chapters.
export function FeatureSection() {
  const { id, title, subtitle, groups } = featureSection;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-20 md:px-6 md:py-28"
    >
      <div className="max-w-2xl">
        <h2 id={`${id}-title`} className="type-display-l text-navy">
          {title}
        </h2>
        <p className="type-body-l mt-4 text-pretty">{subtitle}</p>
      </div>
      <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
        {groups.map((group, index) => (
          <div key={group.id} className={index > 0 ? "border-t border-frame-line pt-14 md:pt-20" : undefined}>
            <FeatureGroup {...group} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
