import { ExternalLink } from "lucide-react";
import type { PrivacyBlock } from "@/content/privacy";

type PrivacySectionBlockProps = {
  number: number;
  id: string;
  title: string;
  blocks: readonly PrivacyBlock[];
};

// One numbered section of the policy: a heading (the target of the "On this page" link, clear of the fixed header)
// and its paragraphs, bullet lists and outside links.
export function PrivacySectionBlock({ number, id, title, blocks }: PrivacySectionBlockProps) {
  return (
    <section aria-labelledby={id} className="border-t border-frame-line pt-10">
      <h2 id={id} className="type-body-l scroll-mt-24 text-[1.375rem] font-semibold text-voice-bottom md:text-2xl">
        <span className="mr-2 text-navy">{number}.</span>
        {title}
      </h2>
      <div className="type-body mt-4 flex flex-col gap-4">
        {blocks.map((block, i) => {
          if (typeof block === "string") return <p key={i}>{block}</p>;
          if ("list" in block) {
            return (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-6 marker:text-navy">
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
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
