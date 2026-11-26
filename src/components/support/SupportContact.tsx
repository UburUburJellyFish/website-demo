import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { EmailButton } from "@/components/ui/EmailButton";
import { brand } from "@/content/images";
import { support } from "@/content/support";

// The end of the support page: a light blue clay card (home-accent, voice-bottom text ≈ 10:1) so the yellow Claire star
// stands out on it, with the email button and the details that help the team, plus the TestFlight feedback tip.
export function SupportContact() {
  const { title, text, include, testflightTip, privacyLink, team } = support.contact;

  return (
    <section
      aria-labelledby="contact-title"
      className="rounded-3xl border-3 border-home-card bg-home-accent p-5 text-voice-bottom shadow-clay sm:p-6 md:p-8"
    >
      <div className="flex items-center gap-4">
        <Image
          src={brand.starMain.src}
          alt=""
          width={brand.starMain.width}
          height={brand.starMain.height}
          className="size-16 shrink-0 md:size-20"
        />
        <h2 id="contact-title" className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight">
          {title}
        </h2>
      </div>
      <p className="type-body mt-5">{text}</p>
      <ul className="type-body mt-3 flex flex-col gap-2">
        {include.map((item) => (
          <li key={item} className="flex gap-3">
            <Star aria-hidden className="mt-1 size-4 shrink-0 fill-home-star text-home-star" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <EmailButton email={support.email} variant="outline" className="mt-6" />
      <p className="type-small mt-6">{testflightTip}</p>
      <p className="type-small mt-4">
        {team}{" "}
        <Link
          href={privacyLink.href}
          className="rounded font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voice-bottom"
        >
          {privacyLink.label}
        </Link>
      </p>
    </section>
  );
}
