import { Camera, EyeOff, Smartphone, UserRoundX, type LucideIcon } from "lucide-react";
import type { PrivacyHighlightIcon } from "@/content/privacy";

const ICON: Record<PrivacyHighlightIcon, LucideIcon> = {
  account: UserRoundX,
  device: Smartphone,
  meal: Camera,
  tracking: EyeOff,
};

type PrivacyHighlightProps = {
  icon: PrivacyHighlightIcon;
  title: string;
  text: string;
};

// One of the four short promises at the top of the privacy page: icon in a home-accent circle (like the feature
// cards), title and one line, on a white card.
export function PrivacyHighlight({ icon, title, text }: PrivacyHighlightProps) {
  const Icon = ICON[icon];
  return (
    <div className="h-full rounded-3xl bg-home-card p-4 text-home-ink shadow-card md:p-6">
      <span className="flex size-11 items-center justify-center rounded-full bg-home-accent">
        <Icon aria-hidden className="size-5 text-navy" strokeWidth={2.25} />
      </span>
      <h2 className="type-body mt-4 font-semibold text-navy">{title}</h2>
      <p className="type-small mt-1">{text}</p>
    </div>
  );
}
