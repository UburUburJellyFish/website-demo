import Image from "next/image";
import { Mail } from "lucide-react";
import { brand } from "@/content/images";
import { privacy } from "@/content/privacy";

type PrivacyContactProps = {
  number: number;
};

// The last section: a yellow clay card (home-star, voice-bottom text, like the CTA on the home page) with Claire and a
// big email button.
export function PrivacyContact({ number }: PrivacyContactProps) {
  const { id, title, text, email, team } = privacy.contact;

  return (
    <section
      aria-labelledby={id}
      className="rounded-3xl border-3 border-home-card bg-home-star p-5 text-voice-bottom shadow-clay sm:p-6 md:flex md:items-center md:gap-8 md:p-8"
    >
      <Image
        src={brand.starMain.src}
        alt=""
        width={brand.starMain.width}
        height={brand.starMain.height}
        className="size-24 shrink-0 max-md:mx-auto max-md:mb-4 md:size-32"
      />
      <div className="min-w-0">
        <h3 id={id} className="flex scroll-mt-40 items-start gap-3 text-xl leading-snug font-semibold">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-home-card text-sm tabular-nums">
            {number}
          </span>
          <span className="pt-0.5">{title}</span>
        </h3>
        <p className="type-body mt-3">{text}</p>
        <a
          href={`mailto:${email}`}
          className="type-small mt-5 inline-flex max-w-full items-center gap-2 rounded-full border-2 border-voice-bottom px-5 py-3 font-semibold transition-colors duration-150 hover:bg-voice-bottom hover:text-home-star focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-voice-bottom max-[359px]:px-4 max-[359px]:text-xs md:text-base"
        >
          {/* Below 360px the icon makes room, so the address fits on one line. */}
          <Mail aria-hidden className="size-5 shrink-0 max-[359px]:hidden" />
          <span className="break-all">{email}</span>
        </a>
        <p className="type-small mt-5">{team}</p>
      </div>
    </section>
  );
}
