import { PRIVACY_BG } from "@/components/privacy/colors";
import { SupportFaqItem } from "@/components/support/SupportFaqItem";
import type { SupportTopic as SupportTopicContent } from "@/content/support";

// One group of questions under a small label with a clay chip in the topic's deck color.
export function SupportTopic({ id, title, color, faqs }: SupportTopicContent) {
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId}>
      <h3 id={titleId} className="flex items-center gap-3">
        <span aria-hidden className={`size-4 rounded-md border-2 border-home-card shadow-clay ${PRIVACY_BG[color]}`} />
        <span className="type-label text-navy">{title}</span>
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {faqs.map((faq) => (
          <SupportFaqItem key={faq.question} color={color} {...faq} />
        ))}
      </div>
    </section>
  );
}
