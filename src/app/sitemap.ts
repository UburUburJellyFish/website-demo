import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Required by `output: "export"`: the file is written once at build time.
export const dynamic = "force-static";

// sitemap.xml, written at build time (static export). Two pages: home and the privacy policy. A sitemap needs absolute URLs, so it stays empty
// until site.url is set (phase 8, hosting and domain).
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return [
    { url: new URL("/", site.url).toString(), changeFrequency: "monthly", priority: 1 },
    { url: new URL("/privacy", site.url).toString(), changeFrequency: "yearly", priority: 0.5 },
  ];
}
