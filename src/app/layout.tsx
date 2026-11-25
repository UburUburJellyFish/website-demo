import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${astonpoliz.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
