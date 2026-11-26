import { HeartPulse } from "lucide-react";
import { support } from "@/content/support";

// A calm but clear note near the top: Claire is not for emergencies and never picks a dose. A range-low (soft red)
// bar on the left marks it; the text stays voice-bottom on the white card (decoration only, never red text).
export function SupportEmergency() {
  const { title, text } = support.emergency;

  return (
    <section
      aria-labelledby="emergency-title"
      className="relative overflow-hidden rounded-3xl bg-home-card p-6 pl-8 text-voice-bottom shadow-clay md:p-8 md:pl-10"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-range-low" />
      <h2 id="emergency-title" className="flex items-start gap-3 text-lg leading-snug font-semibold">
        <HeartPulse aria-hidden className="mt-0.5 size-5 shrink-0" />
        {title}
      </h2>
      <p className="type-body mt-3 max-w-prose">{text}</p>
    </section>
  );
}
