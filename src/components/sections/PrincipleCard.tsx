import { NotebookPen, ShieldCheck, Smile, type LucideIcon } from "lucide-react";
import { PRIVACY_BG } from "@/components/privacy/colors";
import type { PrivacyColor } from "@/content/privacy";

const ICON: Record<"dose" | "logs" | "friendly", LucideIcon> = {
  dose: ShieldCheck,
  logs: NotebookPen,
  friendly: Smile,
};

type PrincipleCardProps = {
  icon: keyof typeof ICON;
  color: PrivacyColor;
  title: string;
  text: string;
  /** Position, shown as a large faint 01–03 in the corner (decoration). */
  index: number;
};

// One of Claire's three principles under the About stage: a clay card like the feature cards, with an icon in a deck
// color tile and a big faint number. data-reveal: fades in as it enters the screen.
export function PrincipleCard({ icon, color, title, text, index }: PrincipleCardProps) {
  const Icon = ICON[icon];

  return (
    <article
      data-reveal
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border-3 border-home-card bg-home-card p-6 text-home-ink shadow-clay md:p-7"
    >
      <span
        aria-hidden
        className="absolute top-3 right-5 font-display text-6xl leading-none text-[color-mix(in_srgb,var(--navy)_12%,transparent)]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`flex size-12 items-center justify-center rounded-2xl text-voice-bottom shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--voice-bottom)_12%,transparent)] ${PRIVACY_BG[color]}`}
      >
        <Icon aria-hidden className="size-6" strokeWidth={2.25} />
      </span>
      <h4 className="mt-5 text-lg leading-snug font-semibold text-navy">{title}</h4>
      <p className="type-body mt-2 text-pretty">{text}</p>
    </article>
  );
}
