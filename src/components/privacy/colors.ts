import type { PrivacyColor } from "@/content/privacy";

// Background class per privacy color (AppColor deck colors + home-star). Text on all of them is voice-bottom (≥ 6:1).
// Written out in full so Tailwind finds the class names.
export const PRIVACY_BG: Record<PrivacyColor, string> = {
  glucose: "bg-card-glucose",
  insulin: "bg-card-insulin",
  activity: "bg-card-activity",
  star: "bg-home-star",
};
