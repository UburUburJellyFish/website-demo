import { site } from "@/content/site";

const LINK =
  "inline-block rounded-full py-1.5 underline-offset-4 transition-colors duration-150 hover:text-navy hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

type SiteFooterProps = {
  /** "" on the home page (plain #hash links), "/" on other pages (back to the home page's sections). */
  linkBase?: string;
};

// Disclaimer, the same links as the header plus the privacy policy, copyright and the Apple trademark line, on
// home-tile. All text is home-ink: text-muted (home-ink 70%) is below 4.5:1 on home-tile for small text.
export function SiteFooter({ linkBase = "" }: SiteFooterProps) {
  const links = [
    ...[...site.nav, site.cta].map((link) => ({ ...link, href: `${linkBase}${link.href}` })),
    site.privacyLink,
  ];

  return (
    <footer className="border-t border-frame-line bg-home-tile text-home-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <p className="type-body max-w-md font-medium text-navy">{site.footer.disclaimer}</p>
          <nav aria-label={site.footerNavLabel}>
            <ul className="type-small flex flex-wrap gap-x-6 gap-y-1 font-medium">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="type-small flex flex-col gap-1 border-t border-frame-line pt-6 md:flex-row md:justify-between md:gap-6">
          <p>{site.footer.copyright}</p>
          <p>{site.footer.trademarks}</p>
        </div>
      </div>
    </footer>
  );
}
