import { site } from "@/content/site";

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-4 py-12 sm:px-6"
    >
      <div className="rounded-3xl bg-accent/40 p-6 sm:p-10">
        <h2 className="font-display text-3xl text-navy">About</h2>
        <p className="mt-4 max-w-2xl">{site.about}</p>
      </div>
    </section>
  );
}
