import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PrivacyHero } from "@/components/privacy/PrivacyHero";
import { PrivacyHighlight } from "@/components/privacy/PrivacyHighlight";
import { PrivacyPolicy } from "@/components/privacy/PrivacyPolicy";
import { PrivacyToc } from "@/components/privacy/PrivacyToc";
import { SkipLink } from "@/components/ui/SkipLink";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: privacy.metaTitle,
  description: privacy.metaDescription,
  openGraph: { title: privacy.metaTitle, description: privacy.metaDescription },
  twitter: { title: privacy.metaTitle, description: privacy.metaDescription },
};

// /privacy: the app's privacy policy (the Privacy Policy URL in App Store Connect). A normal page, no parallax.
// Layout after the reference Aaron shared: navy band, four promises overlapping it, then "On this page" beside the
// numbered policy. Header and footer links lead back to the home page's sections (linkBase "/").
export default function PrivacyPage() {
  return (
    <>
      <SkipLink href="#policy">{privacy.skipLink}</SkipLink>
      <SiteHeader linkBase="/" />
      <main className="flex-1 pb-20">
        <PrivacyHero />
        <div className="relative mx-auto -mt-24 max-w-6xl px-4 md:px-6">
          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {privacy.highlights.map((highlight) => (
              <li key={highlight.title}>
                <PrivacyHighlight {...highlight} />
              </li>
            ))}
          </ul>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <PrivacyToc />
            <PrivacyPolicy />
          </div>
        </div>
      </main>
      <SiteFooter linkBase="/" />
    </>
  );
}
