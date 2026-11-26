import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SupportContact } from "@/components/support/SupportContact";
import { SupportEmergency } from "@/components/support/SupportEmergency";
import { SupportTopic } from "@/components/support/SupportTopic";
import { EmailButton } from "@/components/ui/EmailButton";
import { PageHero } from "@/components/ui/PageHero";
import { SkipLink } from "@/components/ui/SkipLink";
import { support } from "@/content/support";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: support.metaTitle,
  description: support.metaDescription,
  path: support.path,
});

// /support: the Support URL in App Store Connect. Apple wants real contact information there, so the email button is
// already in the hero. Then a note that Claire is not for emergencies, the common questions in four deck-colored
// topics (native <details>, after the UI/UX Pro Max "FAQ/Documentation" pattern: hero, topics, FAQ, contact), and a
// yellow contact card last. Same look as /privacy (shared PageHero, clay cards).
export default function SupportPage() {
  const { topics, faqTitle } = support;

  return (
    <>
      <SkipLink href="#support">{support.skipLink}</SkipLink>
      <SiteHeader linkBase="/" />
      <main className="flex-1 pb-24">
        <PageHero
          backLabel={support.backLabel}
          title={support.title}
          intro={support.intro}
          chips={support.chips}
          bubble={support.heroBubble}
        >
          <EmailButton email={support.email} label={support.emailLabel} variant="filled" className="mt-8" />
        </PageHero>

        <div id="support" tabIndex={-1} className="mx-auto max-w-[46rem] scroll-mt-24 px-4 focus:outline-none">
          <SupportEmergency />

          <section aria-labelledby="faq-title" className="mt-16">
            <h2 id="faq-title" className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight text-navy">
              {faqTitle}
            </h2>
            <div className="mt-8 flex flex-col gap-10">
              {topics.map((topic) => (
                <SupportTopic key={topic.id} {...topic} />
              ))}
            </div>
          </section>

          <div className="mt-16">
            <SupportContact />
          </div>
        </div>
      </main>
      <SiteFooter linkBase="/" />
    </>
  );
}
