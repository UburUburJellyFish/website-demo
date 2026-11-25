import type { Metadata } from "next";
import { Info } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PrivacyChapter } from "@/components/privacy/PrivacyChapter";
import { PrivacyChapterNav } from "@/components/privacy/PrivacyChapterNav";
import { PrivacyContact } from "@/components/privacy/PrivacyContact";
import { PrivacyHero } from "@/components/privacy/PrivacyHero";
import { PrivacyPromise } from "@/components/privacy/PrivacyPromise";
import { SkipLink } from "@/components/ui/SkipLink";
import { privacy } from "@/content/privacy";
import { site } from "@/content/site";

// Next merges metadata shallowly: setting openGraph/twitter here replaces the layout's, image included. So the same
// preview image (src/app/opengraph-image.png, 1200×630), type and large card are repeated here.
const previewImage = { url: "/opengraph-image.png", width: 1200, height: 630, alt: site.ogImageAlt };

export const metadata: Metadata = {
  title: privacy.metaTitle,
  description: privacy.metaDescription,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: privacy.path,
    title: privacy.metaTitle,
    description: privacy.metaDescription,
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: privacy.metaTitle,
    description: privacy.metaDescription,
    images: [previewImage],
  },
};

// /privacy: the app's privacy policy (the Privacy Policy URL in App Store Connect). A normal page, no parallax, but in
// Claire's own look (designed with the UI/UX Pro Max skill: claymorphism, a story told in chapters with a progress
// bar): the star-sky hero with Claire, four promises as deck-colored clay tiles, then four chapters with Claire's
// summary bubbles and numbered section cards, a sticky chapter bar, and the contact card last.
// Header and footer links lead back to the home page's sections (linkBase "/").
export default function PrivacyPage() {
  const { promises, summaryTitle, notice, opening, chapters } = privacy;
  // Sections are numbered across chapters; the contact card takes the number after the last section.
  const firstNumbers = chapters.map((_, i) => 1 + chapters.slice(0, i).reduce((sum, c) => sum + c.sections.length, 0));
  const contactNumber = 1 + chapters.reduce((sum, c) => sum + c.sections.length, 0);

  return (
    <>
      <SkipLink href="#policy">{privacy.skipLink}</SkipLink>
      <SiteHeader linkBase="/" />
      <main className="flex-1 pb-24">
        <PrivacyHero />

        <section aria-labelledby="short-version" className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 id="short-version" className="type-label text-center text-navy">
            {summaryTitle}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {promises.map((promise, i) => (
              <li key={promise.title}>
                <PrivacyPromise {...promise} index={i} />
              </li>
            ))}
          </ul>
          <p className="type-small mx-auto mt-8 flex max-w-2xl items-start gap-2 rounded-2xl border-2 border-dashed border-navy/30 px-4 py-3 font-medium text-navy">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            {notice}
          </p>
        </section>

        {/* The chapter bar sticks while this wrapper (the whole policy) is on screen. */}
        <div className="mt-16">
          <PrivacyChapterNav />
          <div id="policy" tabIndex={-1} className="mx-auto max-w-[46rem] scroll-mt-32 px-4 pt-10 focus:outline-none">
            <p className="type-body-l font-medium text-voice-bottom">{opening}</p>
            <div className="mt-14 flex flex-col gap-20">
              {chapters.map((chapter, i) => (
                <PrivacyChapter key={chapter.id} chapter={chapter} index={i} firstNumber={firstNumbers[i]}>
                  {i === chapters.length - 1 && <PrivacyContact number={contactNumber} />}
                </PrivacyChapter>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter linkBase="/" />
    </>
  );
}
