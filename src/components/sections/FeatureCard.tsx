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
import type { FeatureCardContent, FeatureId } from "@/content/features";

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

// The Log cards carry their deck color from the app as a small line on top (decoration only, never behind text).
const ACCENT: Partial<Record<FeatureId, string>> = {
  voice: "bg-voice-top",
  meal: "bg-card-meal",
  glucose: "bg-glucose-deck",
  insulin: "bg-insulin-deck",
  activity: "bg-activity-deck",
};

// One feature: icon in a home-accent circle, title, text, on home-tile. data-reveal: fades in as it enters the screen
// (globals.css, CSS only).
export function FeatureCard({ id, title, text }: FeatureCardContent) {
  const Icon = ICON[id];
  const accent = ACCENT[id];

  return (
    <article data-reveal className="relative h-full overflow-hidden rounded-3xl bg-home-tile p-6 text-home-ink">
      {accent && <span aria-hidden className={`absolute inset-x-6 top-0 h-1.5 rounded-b-full ${accent}`} />}
      <span className="flex size-11 items-center justify-center rounded-full bg-home-accent">
        <Icon aria-hidden className="size-5 text-navy" strokeWidth={2.25} />
      </span>
      <h4 className="type-body mt-4 font-semibold text-navy">{title}</h4>
      <p className="type-body mt-2">{text}</p>
      {id === "history" && <FeelingRow className="mt-4" />}
    </article>
  );
}
