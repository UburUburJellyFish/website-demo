import { site } from "@/content/site";
import { FeatureCard } from "@/components/FeatureCard";

export function FeatureList() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-4 py-12 sm:px-6"
    >
      <h2 className="font-display text-3xl text-navy">What Claire does</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {site.features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            body={feature.body}
          />
        ))}
      </div>
    </section>
  );
}
