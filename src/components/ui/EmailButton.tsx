import { Mail } from "lucide-react";

type EmailButtonProps = {
  email: string;
  /** Visible label; the address is shown under it ("filled") or used as the label itself ("outline"). */
  label?: string;
  /** "filled": yellow button for light backgrounds. "outline": voice-bottom outline for the yellow cards. */
  variant: "filled" | "outline";
  className?: string;
};

// A mailto button. Text is voice-bottom in both variants (the only text color that reads well on home-star yellow).
// Below 360px the icon makes room so the address stays on one line.
export function EmailButton({ email, label, variant, className = "" }: EmailButtonProps) {
  const look =
    variant === "filled"
      ? "bg-home-star shadow-card hover:bg-highlight-chart focus-visible:outline-navy"
      : "border-2 border-voice-bottom hover:bg-voice-bottom hover:text-home-star focus-visible:outline-voice-bottom";

  return (
    <a
      href={`mailto:${email}`}
      className={`inline-flex max-w-full items-center gap-3 rounded-full px-5 py-3 text-left font-semibold text-voice-bottom transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 max-[359px]:px-4 ${look} ${className}`}
    >
      <Mail aria-hidden className="size-5 shrink-0 max-[359px]:hidden" />
      {label ? (
        <span className="flex min-w-0 flex-col leading-tight">
          <span>{label}</span>
          <span className="type-small font-medium break-all">{email}</span>
        </span>
      ) : (
        <span className="type-small break-all md:text-base">{email}</span>
      )}
    </a>
  );
}
