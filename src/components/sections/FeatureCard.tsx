import {
  AlarmClock,
  BellRing,
  Bluetooth,
  CalendarDays,
  Camera,
  ChartColumn,
  Droplet,
  Footprints,
  Gift,
  HeartPulse,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  Megaphone,
  Mic,
  RotateCw,
  Sunrise,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { FeelingRow } from "@/components/ui/FeelingRow";
import { PRIVACY_BG } from "@/components/privacy/colors";
import type { FeatureCardContent, FeatureId } from "@/content/features";
import type { PrivacyColor } from "@/content/privacy";

// Generic icons (lucide, ISC license); no SF Symbols or brand marks. Connect icons match ConnectChip.
const ICON: Record<FeatureId, LucideIcon> = {
  voice: Mic,
  meal: Camera,
  glucose: Droplet,
  insulin: Syringe,
  activity: Footprints,
  "start-day": Sunrise,
  "on-time": AlarmClock,
  tips: Lightbulb,
  "check-again": RotateCw,
  "heads-up": Megaphone,
  history: CalendarDays,
  summary: ChartColumn,
  glucometer: Bluetooth,
  health: HeartPulse,
  reminders: BellRing,
  widgets: LayoutGrid,
  setup: ListChecks,
  secret: Gift,
};

// The Log cards keep the app's own colors for each kind of log; every other card uses its group's deck color.
// Meal and voice are deep colors, so their icons are light (≥ 4.5:1); all others use voice-bottom (≥ 6:1).
const TILE: Partial<Record<FeatureId, string>> = {
  voice: "bg-voice-top text-on-dark",
  meal: "bg-[color-mix(in_srgb,var(--card-meal)_65%,var(--voice-bottom))] text-on-dark",
  glucose: "bg-card-glucose text-voice-bottom",
  insulin: "bg-card-insulin text-voice-bottom",
  activity: "bg-card-activity text-voice-bottom",
};

type FeatureCardProps = FeatureCardContent & {
  /** The group's deck color. */
  color: PrivacyColor;
  /** The group's main card: wide, on the deck color, with the title in the display font. */
  featured?: boolean;
};

// One feature as a soft clay card with a thick white rim (the style of the privacy and support pages): an icon in a
// colored tile, a title and one or two sentences. Not a link, so no hover effect. data-reveal: fades in as it enters
// the screen (globals.css, CSS only, off with reduced motion).
export function FeatureCard({ id, title, text, color, featured = false }: FeatureCardProps) {
  const Icon = ICON[id];

  if (featured) {
    return (
      <article
        data-reveal
        className={`flex h-full flex-col gap-5 rounded-3xl border-3 border-home-card p-6 text-voice-bottom shadow-clay sm:flex-row sm:items-center sm:gap-7 md:p-8 ${PRIVACY_BG[color]}`}
      >
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-home-card shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--voice-bottom)_10%,transparent)] md:size-20">
          <Icon aria-hidden className="size-8 md:size-9" strokeWidth={2} />
        </span>
        <div>
          <h4 className="font-display text-[1.75rem] leading-tight md:text-[2rem]">{title}</h4>
          <p className="type-body-l mt-2 text-pretty">{text}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      data-reveal
      className="flex h-full flex-col rounded-3xl border-3 border-home-card bg-home-card p-6 text-home-ink shadow-clay"
    >
      <span
        className={`flex size-12 items-center justify-center rounded-2xl shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--voice-bottom)_12%,transparent)] ${TILE[id] ?? `${PRIVACY_BG[color]} text-voice-bottom`}`}
      >
        <Icon aria-hidden className="size-6" strokeWidth={2.25} />
      </span>
      <h4 className="mt-5 text-lg leading-snug font-semibold text-navy">{title}</h4>
      <p className="type-body mt-2 text-pretty">{text}</p>
      {id === "history" && <FeelingRow className="mt-auto pt-5" />}
    </article>
  );
}
