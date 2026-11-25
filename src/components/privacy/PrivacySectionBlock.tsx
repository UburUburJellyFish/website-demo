import { ExternalLink, Star } from "lucide-react";
import { PRIVACY_BG } from "@/components/privacy/colors";
import type { PrivacyBlock, PrivacyColor } from "@/content/privacy";

type PrivacySectionBlockProps = {
  number: number;
  id: string;
  title: string;
  color: PrivacyColor;
  blocks: readonly PrivacyBlock[];
};

// One numbered section of the policy on a soft clay card: a number badge in the chapter's color, the heading (a deep
// link target, clear of the header and the chapter bar), then paragraphs, star-bulleted lists and outside links.
// Text is kept to a readable line length (max-w-prose, UI/UX Pro Max: 65–75 characters).
export function PrivacySectionBlock({ number, id, title, color, blocks }: PrivacySectionBlockProps) {
  return (
    <section aria-labelledby={id} className="rounded-3xl bg-home-card p-6 text-home-ink shadow-clay md:p-8">
      <h3 id={id} className="flex scroll-mt-40 items-start gap-3 text-xl leading-snug font-semibold text-voice-bottom">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm tabular-nums ${PRIVACY_BG[color]}`}
        >
          {number}
        </span>
        <span className="pt-0.5">{title}</span>
      </h3>
      <div className="type-body mt-4 flex max-w-prose flex-col gap-4">
        {blocks.map((block, i) => {
          if (typeof block === "string") return <p key={i}>{block}</p>;
          if ("list" in block) {
            return (
              <ul key={i} className="flex flex-col gap-2.5">
                {block.list.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Star aria-hidden className="mt-1 size-4 shrink-0 fill-home-star text-home-star" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <ul key={i} className="flex flex-wrap gap-x-6 gap-y-2">
              {block.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded font-medium text-navy underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    {link.label}
                    <ExternalLink aria-hidden className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </section>
  );
}
