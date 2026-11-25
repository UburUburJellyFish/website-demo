import { Camera, EyeOff, Smartphone, UserRoundX, type LucideIcon } from "lucide-react";
import { PRIVACY_BG } from "@/components/privacy/colors";
import type { PrivacyColor, PrivacyPromiseIcon } from "@/content/privacy";

const ICON: Record<PrivacyPromiseIcon, LucideIcon> = {
  account: UserRoundX,
  device: Smartphone,
  meal: Camera,
  tracking: EyeOff,
};

// A small tilt per tile (large screens only), so the four promises look like stickers rather than a table.
const TILT = ["lg:-rotate-2", "lg:rotate-1", "lg:-rotate-1", "lg:rotate-2"];

type PrivacyPromiseProps = {
  icon: PrivacyPromiseIcon;
  color: PrivacyColor;
  title: string;
  text: string;
  index: number;
};

// One of the four promises in "The short version": a chunky clay tile in an app deck color (like the log tiles on the
// home page), with a thick white rim and voice-bottom text.
export function PrivacyPromise({ icon, color, title, text, index }: PrivacyPromiseProps) {
  const Icon = ICON[icon];
  return (
    <div
      className={`h-full rounded-3xl border-3 border-home-card p-5 text-voice-bottom shadow-clay transition-transform duration-200 ease-out motion-safe:hover:rotate-0 md:p-6 ${PRIVACY_BG[color]} ${TILT[index % TILT.length]}`}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-home-card">
        <Icon aria-hidden className="size-5" strokeWidth={2.25} />
      </span>
      <h3 className="type-body mt-4 font-semibold">{title}</h3>
      <p className="type-small mt-1">{text}</p>
    </div>
  );
}
