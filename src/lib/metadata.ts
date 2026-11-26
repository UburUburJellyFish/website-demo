import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMetadataInput = { title: string; description: string; path: string };

// Metadata for the pages after the story (/privacy, /support). Next merges metadata shallowly: a page that sets its
// own openGraph/twitter replaces the layout's, image included. So the shared preview image
// (src/app/opengraph-image.png, 1200×630), type, site name and the large card are repeated here for every page.
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const image = { url: "/opengraph-image.png", width: 1200, height: 630, alt: site.ogImageAlt };
  return {
    title,
    description,
    openGraph: { type: "website", siteName: site.name, locale: "en_US", url: path, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
