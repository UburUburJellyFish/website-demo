import { Droplet, Footprints, Syringe, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { LogKind, LogTileContent } from "@/content/scenes";

// Color and icon per kind. Glucose, insulin and activity: their deck colors with voice-bottom text (6.0–8.5:1).
// Meal: card-meal deepened with 35% voice-bottom, with on-dark text (≈5.4:1); plain card-meal only passes for large
// text, which is what made the old meal tiles shout. Icons match DeckIcon (lucide, ISC license).
const KIND: Record<LogKind, { tile: string; Icon: LucideIcon }> = {
  glucose: { tile: "bg-card-glucose text-voice-bottom", Icon: Droplet },
  insulin: { tile: "bg-card-insulin text-voice-bottom", Icon: Syringe },
  meal: {
    tile: "bg-[color-mix(in_srgb,var(--card-meal)_65%,var(--voice-bottom))] text-on-dark",
    Icon: UtensilsCrossed,
  },
  activity: { tile: "bg-card-activity text-voice-bottom", Icon: Footprints },
};

type LogTileProps = LogTileContent & {
  target?: string;
};

// One tile of the Burden grid, laid out like a log entry: the kind's icon top-left, then a bold one-line value and a
// small one-line caption at the bottom. Every tile uses the same two text sizes (UI/UX Pro Max: one type scale, compact
// labels never wrap, nothing under 12px). A soft inner shade at the bottom gives the tiles a little depth.
export function LogTile({ kind, value, caption, target }: LogTileProps) {
  const { tile, Icon } = KIND[kind];

  return (
    <div
      data-px={target}
      className={`flex size-[4.25rem] flex-col justify-between rounded-2xl p-1.5 shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--voice-bottom)_12%,transparent)] md:size-18 md:p-2 lg:size-20 lg:p-2.5 xl:size-22 ${tile}`}
    >
      <Icon aria-hidden className="size-3.5 lg:size-4" strokeWidth={2.5} />
      <p className="leading-none">
        <span className="block text-[0.9375rem] font-bold tracking-tight whitespace-nowrap tabular-nums xl:text-lg">
          {value}
        </span>
        <span className="mt-1 block text-xs font-medium whitespace-nowrap">{caption}</span>
      </p>
    </div>
  );
}
