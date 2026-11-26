import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { PRIVACY_BG } from "@/components/privacy/colors";
import type { PrivacyColor } from "@/content/privacy";
import type { SupportFaq } from "@/content/support";

type SupportFaqItemProps = SupportFaq & { color: PrivacyColor };

// One question as a native <details> clay card (opens without JavaScript, keyboard and screen readers get
// "collapsed/expanded" for free). A dot in the topic's deck color, the question, a chevron that turns when open.
export function SupportFaqItem({ question, answer, link, color }: SupportFaqItemProps) {
  const external = link?.href.startsWith("http");

  return (
    <details className="group rounded-3xl bg-home-card text-home-ink shadow-clay">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-3xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy md:px-6 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className={`size-3 shrink-0 rounded-full ${PRIVACY_BG[color]}`} />
        <span className="flex-1 text-[1.0625rem] leading-snug font-semibold text-voice-bottom">{question}</span>
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-navy transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="type-body flex max-w-prose flex-col gap-3 px-5 pb-6 pl-11 md:px-6 md:pl-12">
        {answer.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {link &&
          (external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 rounded font-semibold text-navy underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              {link.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : (
            <Link
              href={link.href}
              className="w-fit rounded font-semibold text-navy underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              {link.label}
            </Link>
          ))}
      </div>
    </details>
  );
}
