import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Required by `output: "export"`: the file is written once at build time.
export const dynamic = "force-static";

// robots.txt, written at build time (static export). Everything may be crawled.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site.url ? { sitemap: new URL("/sitemap.xml", site.url).toString() } : {}),
  };
}
