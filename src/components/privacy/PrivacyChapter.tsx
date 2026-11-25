import Image from "next/image";
import type { ReactNode } from "react";
import { PRIVACY_BG } from "@/components/privacy/colors";
import { PrivacySectionBlock } from "@/components/privacy/PrivacySectionBlock";
import { ClaireBubble } from "@/components/ui/ClaireBubble";
import { brand } from "@/content/images";
import { privacy, type PrivacyChapter as PrivacyChapterContent } from "@/content/privacy";

type PrivacyChapterProps = {
  chapter: PrivacyChapterContent;
  /** 0-based chapter index. */
  index: number;
  /** Number of the chapter's first section (sections are numbered across chapters). */
  firstNumber: number;
  /** Extra content after the sections (the contact card in the last chapter). */
  children?: ReactNode;
};

// One chapter of the policy, told like a scene of the story: a big clay number in the chapter color, the title in
// Astonpoliz, Claire's one-line summary in her speech bubble, then the chapter's numbered section cards.
export function PrivacyChapter({ chapter, index, firstNumber, children }: PrivacyChapterProps) {
  const titleId = `${chapter.id}-title`;

  return (
    <section id={chapter.id} aria-labelledby={titleId} className="scroll-mt-40">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border-3 border-home-card font-display text-3xl text-voice-bottom shadow-clay ${PRIVACY_BG[chapter.color]}`}
        >
          {index + 1}
        </span>
        <div>
          <p className="type-label text-navy">
            {privacy.chapterLabel} {index + 1}
          </p>
          <h2 id={titleId} className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight text-navy">
            {chapter.title}
          </h2>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Image
          src={brand.starMain.src}
          alt=""
          width={brand.starMain.width}
          height={brand.starMain.height}
          className="size-12 shrink-0"
        />
        <ClaireBubble tail="left">{chapter.bubble}</ClaireBubble>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        {chapter.sections.map((section, i) => (
          <PrivacySectionBlock key={section.id} number={firstNumber + i} color={chapter.color} {...section} />
        ))}
        {children}
      </div>
    </section>
  );
}
