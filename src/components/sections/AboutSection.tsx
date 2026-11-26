import { PrincipleCard } from "@/components/sections/PrincipleCard";
import { StarPlayground } from "@/components/ui/StarPlayground";
import { about } from "@/content/about";

// "About Claire" (#about): why Claire exists, three principles, the team. The member list and the privacy line only
// show once they are filled in and confirmed in src/content/about.ts (docs/03-content.md, "Perlu konfirmasi").
// The star mascot sits in a playable constellation (StarPlayground): above the text on phones, beside it from md up.
export function AboutSection() {
  const { id, title, paragraphs, principles, team, members, privacy, playground } = about;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 bg-home-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 id={`${id}-title`} className="type-display-l text-navy">
              {title}
            </h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="type-body-l mt-5">
                {paragraph}
              </p>
            ))}
          </div>
          <StarPlayground
            hint={playground.hint}
            className="order-first h-60 w-full self-center sm:h-64 md:order-last md:size-72 md:shrink-0 lg:size-80"
          />
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <li key={principle.title}>
              <PrincipleCard {...principle} />
            </li>
          ))}
        </ul>

        <div className="type-body mt-12 flex flex-col gap-3">
          <p>{team}</p>
          {members.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {members.map((member) => (
                <li key={member} className="rounded-full bg-home-accent px-4 py-1.5 font-medium">
                  {member}
                </li>
              ))}
            </ul>
          )}
          {privacy.confirmed && <p>{privacy.text}</p>}
        </div>
      </div>
    </section>
  );
}
