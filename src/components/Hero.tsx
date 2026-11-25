import Image from "next/image";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20">
      <Image
        src="/images/claire-wordmark.webp"
        alt={`${site.name}: ${site.tagline}`}
        width={2000}
        height={1067}
        priority
        // The wordmark is navy; flip it to a light blue on dark backgrounds.
        className="h-auto w-full max-w-md dark:invert dark:hue-rotate-180"
      />
      <p className="mt-6 max-w-xl text-lg">{site.description}</p>
      <span className="mt-8 rounded-full bg-star px-6 py-3 font-semibold text-[#366799]">
        Coming soon on the App Store
      </span>
    </section>
  );
}
