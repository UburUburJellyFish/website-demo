import { Droplet, Footprints, Syringe, type LucideIcon } from "lucide-react";

type DeckKind = "glucose" | "insulin" | "activity";

type DeckIconProps = {
  kind: DeckKind;
  label: string;
  /** data-px target, e.g. "deck-glucose". */
  target?: string;
};

// Deck colors from AppColor (glucosedeck, insulindeck, activitydeck); icon in voice-bottom (6.0–8.5:1 on them).
const DECK: Record<DeckKind, { color: string; Icon: LucideIcon }> = {
  glucose: { color: "bg-glucose-deck", Icon: Droplet },
  insulin: { color: "bg-insulin-deck", Icon: Syringe },
  activity: { color: "bg-activity-deck", Icon: Footprints },
};

// One of the Daily log buttons: a colored circle with an icon and a label under it.
export function DeckIcon({ kind, label, target }: DeckIconProps) {
  const { color, Icon } = DECK[kind];
  return (
    <div data-px={target} className="flex w-16 flex-col items-center gap-2 md:w-18">
      <span className={`flex size-12 items-center justify-center rounded-full shadow-card md:size-14 ${color}`}>
        <Icon aria-hidden className="size-6 text-voice-bottom md:size-7" strokeWidth={2.25} />
      </span>
      <span className="type-small font-semibold">{label}</span>
    </div>
  );
}
