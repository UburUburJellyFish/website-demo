import { BellRing, Bluetooth, HeartPulse, LayoutGrid, type LucideIcon } from "lucide-react";

export type ConnectId = "glucometer" | "health" | "reminders" | "widgets";

type ConnectChipProps = {
  id: ConnectId;
  title: string;
  text: string;
  /** data-px target, e.g. "chip-glucometer". */
  target?: string;
  /** On the mobile stage show the title only (the text stays for screen readers). */
  compactOnMobileStage?: boolean;
  className?: string;
};

// Generic icons (lucide, ISC license); no Apple or meter-brand marks.
const ICON: Record<ConnectId, LucideIcon> = {
  glucometer: Bluetooth,
  health: HeartPulse,
  reminders: BellRing,
  widgets: LayoutGrid,
};

// One thing Claire connects to: icon in a home-accent circle, bold title, short text.
export function ConnectChip({ id, title, text, target, compactOnMobileStage, className = "" }: ConnectChipProps) {
  const Icon = ICON[id];
  return (
    <div
      data-px={target}
      className={`flex w-full max-w-[17rem] items-start gap-3 rounded-3xl bg-home-card p-4 text-home-ink shadow-card max-md:px:items-center max-md:px:p-3 ${className}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-accent max-md:px:size-8">
        <Icon aria-hidden className="size-5 text-navy max-md:px:size-4" strokeWidth={2.25} />
      </span>
      <p className="type-small">
        <span className="font-semibold">{title}</span>{" "}
        <span className={compactOnMobileStage ? "max-md:px:sr-only" : ""}>{text}</span>
      </p>
    </div>
  );
}
