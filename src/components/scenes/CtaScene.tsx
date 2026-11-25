import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { ClaireBubble } from "@/components/ui/ClaireBubble";
import { qr } from "@/content/images";
import { scenes } from "@/content/scenes";
import { site } from "@/content/site";

// Scene 9: join the beta, on the home-star yellow stage (docs keyframes 23–24). Everything on yellow is voice-bottom
// (9.55:1), set explicitly: the stage text color is home-ink, which is too weak on yellow. The QR card keeps the video's
// cream (on-dark). On mobile the QR is hidden (the visitor is already on a phone). On tablets the text
// block is narrower so it stays clear of the QR card.
export function CtaScene() {
  const { title, text, textMobile, note, bubble } = scenes.cta;
  const href = site.testflightUrl ?? site.cta.href;
  const external = href.startsWith("http");

  return (
    <ParallaxScene
      id="cta"
      anchor="beta"
      label={title}
      className="mx-auto my-20 grid max-w-5xl items-center gap-10 rounded-3xl bg-home-star px-6 py-16 text-voice-bottom md:grid-cols-2 md:px-12 px:my-0 px:max-w-none px:rounded-none px:bg-transparent px:py-0"
    >
      <div
        data-px="cta-block"
        className="max-w-md px:absolute px:top-[30%] px:left-[10%] md:px:max-w-[19rem] lg:px:max-w-md max-md:px:inset-x-6 max-md:px:top-[22%] max-md:px:max-w-none max-md:px:text-center"
      >
        <h2 className="type-display-l">{title}</h2>
        <p className="type-body-l mt-4 max-md:hidden">{text}</p>
        <p className="type-body-l mt-4 md:hidden">{textMobile}</p>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-voice-bottom px-6 py-3 font-semibold transition-colors duration-150 hover:bg-voice-bottom hover:text-home-star focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-voice-bottom max-md:px-8 max-md:py-4 max-md:text-lg"
        >
          {site.cta.label}
          <ArrowUpRight aria-hidden className="size-5" />
        </a>
        <p className="type-small mt-6">{note}</p>
      </div>

      {/* The QR card, as big as the screen allows: on the stage it is centered vertically on the right and up to 30rem
          wide (its height is 4/3 of its width, so the height cap is (100svh − 12rem) × 3/4). Claire's bubble sits just
          left of its top corner from xl up (positioned from the wrapper, not with a transform: the engine owns
          transforms), and above the card below 1280px, where the text block needs the room on the left.
          Hidden on mobile: the visitor is already on a phone. */}
      <div className="flex flex-col items-center max-md:hidden px:absolute px:inset-y-0 px:right-[8%] px:justify-center">
        <div className="relative flex flex-col items-center gap-3">
          <ClaireBubble
            target="bubble-cta"
            tail="right"
            className="xl:px:absolute xl:px:top-10 xl:px:right-full xl:px:mr-4 xl:px:whitespace-nowrap"
          >
            {bubble}
          </ClaireBubble>
          <div
            data-px="qr-card"
            className="w-80 rounded-3xl bg-on-dark p-3 shadow-card px:w-[min(30rem,34vw,calc((100svh_-_12rem)*0.75))]"
          >
            <Image src={qr.src} alt={qr.alt} width={qr.width} height={qr.height} className="h-auto w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </ParallaxScene>
  );
}
