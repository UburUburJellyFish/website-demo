import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// The display font from the Claire demo video.
const astonpoliz = localFont({
  src: "./fonts/Astonpoliz.ttf",
  variable: "--font-astonpoliz",
});

// Light only (decided by Aaron, 2026-11-25). themeColor = AppColor homeCream, the page background.
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fffdf6",
};

// Link previews: the images come from opengraph-image.png and twitter-image.png in this folder (npm run og).
// metadataBase makes their URLs absolute; it is set once site.url is known (phase 8, hosting and domain).
export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

// Turns the parallax stage on before the first paint, unless the visitor prefers reduced motion, the screen is
// shorter than 600px (phones in landscape, iPhone SE, 200% zoom) or the browser text size is larger than 20px.
// Without JavaScript this never runs and the story stays a normal stacked page (docs/02-parallax.md). Keep the class
// name and the numbers in sync with PX_ON_CLASS, MIN_STAGE_HEIGHT and MAX_STAGE_FONT_SIZE in
// src/lib/parallax/useParallax.ts.
const PX_ON_SCRIPT = `(function(){var d=document.documentElement;if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&window.innerHeight>=600&&parseFloat(getComputedStyle(d).fontSize)<=20){d.classList.add("px-on")}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above adds a class to <html> before React hydrates.
    <html
      lang={site.lang}
      className={`${geistSans.variable} ${astonpoliz.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* A plain inline script so it runs before the first paint. next/script "beforeInteractive" was tried:
            Next queues it at the end of <body>, so the stacked page flashed before the stage turned on. */}
        <script id="px-on" dangerouslySetInnerHTML={{ __html: PX_ON_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
