import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 py-8 text-sm sm:px-6">
      © {site.year} {site.name}. {site.tagline}.
    </footer>
  );
}
