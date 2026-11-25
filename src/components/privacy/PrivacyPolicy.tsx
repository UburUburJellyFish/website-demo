import { Info, Mail } from "lucide-react";
import { PrivacySectionBlock } from "@/components/privacy/PrivacySectionBlock";
import { privacy } from "@/content/privacy";

// The policy itself on a white card: opening paragraph, the beta notice, the numbered sections and the contact.
// The notice is pale yellow (home-star 25%) with voice-bottom text, like the yellow button.
export function PrivacyPolicy() {
  const { opening, notice, sections, contact } = privacy;

  return (
    <article
      id="policy"
      tabIndex={-1}
      className="scroll-mt-24 rounded-3xl bg-home-card p-6 text-home-ink shadow-card focus:outline-none md:p-12"
    >
      <p className="type-body-l font-medium text-voice-bottom">{opening}</p>
      <p className="type-body mt-6 flex items-start gap-3 rounded-2xl border border-home-star bg-home-star/25 px-5 py-4 font-medium text-voice-bottom">
        <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
        {notice}
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((section, i) => (
          <PrivacySectionBlock key={section.id} number={i + 1} {...section} />
        ))}

        <section aria-labelledby={contact.id} className="border-t border-frame-line pt-10">
          <h2 id={contact.id} className="type-body-l scroll-mt-24 text-[1.375rem] font-semibold text-voice-bottom md:text-2xl">
            <span className="mr-2 text-navy">{sections.length + 1}.</span>
            {contact.title}
          </h2>
          <p className="type-body mt-4">
            {contact.text}{" "}
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1 rounded font-semibold break-all text-navy underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              <Mail aria-hidden className="size-4 shrink-0" />
              {contact.email}
            </a>
            .
          </p>
          <p className="type-body mt-4">{contact.team}</p>
        </section>
      </div>
    </article>
  );
}
