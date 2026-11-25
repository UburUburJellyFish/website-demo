// Site-wide text: name, metadata, navigation, footer. Copy source: docs/03-content.md.
// Nothing here is saved or loaded; it is all baked into the static HTML at build time.

const year = 2026; // Written by hand: new Date() in a Server Component breaks the static build.
const team = "UburUbur Team";

export const site = {
  name: "Claire",
  tagline: "Live beyond diabetes",
  year,
  team,
  lang: "en",
  title: "Claire · Live beyond diabetes",
  description:
    "Claire is a cheerful little logbook for type 1 diabetes. Log glucose, insulin, meals and activity by tapping, talking or snapping a photo.",

  // The website's address, once hosting and the domain are decided (docs/03-content.md, "Perlu konfirmasi").
  // While it is null: link previews use a relative image URL, the sitemap is empty and robots.txt has no Sitemap line.
  url: null as string | null,

  // Public TestFlight link, read from the QR codes in C5-M01-UburUbur/QR-TestFlight (the QR on the site opens
  // the same link). Confirmed by Aaron on 2026-11-25.
  // Set to null to send "Join the beta" to the #beta section instead.
  testflightUrl: "https://testflight.apple.com/join/utWcPjDc" as string | null,

  nav: [
    { label: "Story", href: "#story" },
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
  ],
  cta: { label: "Join the beta", href: "#beta" },
  // In the footer. The page App Store Connect links to as the app's privacy policy.
  privacyLink: { label: "Privacy Policy", href: "/privacy" },
  // Accessible names for the header and footer navigation and the mobile menu button.
  skipLink: "Skip to features",
  navLabel: "Main",
  menuLabel: "Menu",
  footerNavLabel: "Footer",
  // Accessible name of the header star, the easter egg button (src/components/easter-egg/RainbowStar.tsx).
  starLabel: "Claire's star",

  footer: {
    disclaimer: "Claire helps you keep track. It does not replace advice from your doctor.",
    copyright: `© ${year} Claire · ${team}`,
    trademarks: "Apple, iPhone, Apple Health and TestFlight are trademarks of Apple Inc.",
  },
} as const;
