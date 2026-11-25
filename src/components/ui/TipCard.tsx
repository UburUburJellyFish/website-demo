type TipCardProps = {
  title: string;
  text: string;
  /** low = range-low accent, high = range-high accent (AppColor glucose range bar). */
  tone: "low" | "high";
  target?: string;
  className?: string;
};

const ACCENT = { low: "border-range-low", high: "border-range-high" } as const;

// One of Claire's little tips: a home-card with a thick colored edge on the left. The accent is decoration only;
// the text stays home-ink on home-card (5.9:1).
export function TipCard({ title, text, tone, target, className = "" }: TipCardProps) {
  return (
    <div
      data-px={target}
      className={`w-full max-w-sm rounded-3xl border-l-8 bg-home-card px-5 py-4 text-home-ink shadow-card ${ACCENT[tone]} ${className}`}
    >
      <p className="type-body font-semibold">{title}</p>
      <p className="type-body mt-1">{text}</p>
    </div>
  );
}
