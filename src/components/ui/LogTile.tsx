import type { LogKind, LogTileContent } from "@/content/scenes";

const TILE_COLOR: Record<LogKind, string> = {
  glucose: "bg-card-glucose",
  insulin: "bg-card-insulin",
  meal: "bg-card-meal",
  activity: "bg-card-activity",
};

type LogTileProps = LogTileContent & {
  target?: string;
};

// Meal tiles use large bold text (>= 18.66px) so voice-bottom over card-meal meets WCAG AA contrast (3.73).
export function LogTile({ kind, text, target }: LogTileProps) {
  const textStyle =
    kind === "meal" ? "text-[1.167rem] leading-[1.05] font-bold" : "text-xs leading-tight font-semibold";

  return (
    <div
      data-px={target}
      className={`flex size-[4.25rem] items-center justify-center rounded-2xl p-1 text-center text-voice-bottom md:size-18 md:p-1.5 ${TILE_COLOR[kind]} ${textStyle}`}
    >
      {text}
    </div>
  );
}
