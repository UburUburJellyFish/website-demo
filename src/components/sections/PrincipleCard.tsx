import { Star } from "lucide-react";

type PrincipleCardProps = {
  title: string;
  text: string;
};

// One of Claire's three principles in the About section: a small yellow star, title and text on home-card.
export function PrincipleCard({ title, text }: PrincipleCardProps) {
  return (
    <article data-reveal className="h-full rounded-3xl bg-home-card p-6 text-home-ink shadow-card">
      <Star aria-hidden className="size-6 fill-home-star text-home-star" />
      <h3 className="type-body mt-3 font-semibold text-navy">{title}</h3>
      <p className="type-body mt-2">{text}</p>
    </article>
  );
}
