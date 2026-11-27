import Image from "next/image";
import { PrincipleCard } from "@/components/sections/PrincipleCard";
import { StarPlayground } from "@/components/ui/StarPlayground";
import { about } from "@/content/about";
import { brand } from "@/content/images";

// "About Claire" (#about): why Claire exists, three principles, the team. The member list and the privacy line only
// show once they are filled in and confirmed in src/content/about.ts (docs/03-content.md, "Perlu konfirmasi").
// It opens on a full-width stage, after igloo.inc: Claire as a large, playable particle sculpture (StarPlayground).
// From lg the stage is one screen tall, the sculpture stands right of center and the title and text sit on the stage
// to the left (only the text catches the pointer, the rest plays with the grains). On phones and tablets the text
// comes first and the stage follows, edge to edge.
export function AboutSection() {
  const { id, title, paragraphs, principlesTitle, principles, team, members, privacy, playground } = about;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 bg-home-background">
      <div className="relative flex flex-col lg:h-[min(100svh,60rem)] lg:min-h-[40rem]">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-20 pb-8 md:px-6 lg:pointer-events-none lg:absolute lg:inset-0 lg:flex lg:items-center lg:py-0">
          <div className="max-w-xl lg:pointer-events-auto lg:w-[42%]">
            <h2 id={`${id}-title`} className="type-display-l text-navy">
              {title}
            </h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="type-body-l mt-5 text-voice-bottom">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <StarPlayground {...playground} className="h-[34rem] w-full sm:h-[40rem] lg:absolute lg:inset-0 lg:h-full" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-20 md:px-6 md:pb-28">
        <h3 className="font-display text-[2rem] leading-tight text-navy md:text-[2.5rem]">{principlesTitle}</h3>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <PrincipleCard {...principle} index={index} />
            </li>
          ))}
        </ul>

        {/* The team, next to Claire's star. */}
        <div className="mt-10 flex flex-col gap-4 rounded-3xl border-3 border-home-card bg-home-accent p-6 text-voice-bottom shadow-clay sm:flex-row sm:items-center sm:gap-6 md:p-7">
          <Image
            src={brand.icon.src}
            alt=""
            width={brand.icon.width}
            height={brand.icon.height}
            className="size-16 shrink-0"
          />
          <div className="flex flex-col gap-3">
            <p className="type-body-l font-medium text-pretty">{team}</p>
            {members.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <li key={member} className="type-small rounded-full bg-home-card px-4 py-1.5 font-medium">
                    {member}
                  </li>
                ))}
              </ul>
            )}
            {privacy.confirmed && <p className="type-small">{privacy.text}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
