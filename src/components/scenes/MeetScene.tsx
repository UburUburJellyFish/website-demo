import Image from "next/image";
import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { PhoneScreen } from "@/components/ui/PhoneScreen";
import { SceneLabel } from "@/components/ui/SceneLabel";
import { brand } from "@/content/images";
import { scenes } from "@/content/scenes";

// Scene 3: Claire's star mascot spins in, says hello, and introduces the Home screen (shared StagePhone when parallax is on).
export function MeetScene() {
  const { hello, label, text, screen } = scenes.meet;

  return (
    <ParallaxScene
      id="meet"
      anchor="story"
      label={hello}
      className="mx-auto grid min-h-svh max-w-5xl items-center gap-12 px-4 py-20 md:grid-cols-2 px:max-w-none px:py-0"
    >
      <div className="flex flex-col items-start gap-4 px:contents">
        <div
          data-px="star"
          className="px:absolute px:top-[42%] px:left-1/2 px:-mt-20 px:-ml-20 md:px:-mt-24 md:px:-ml-24"
          // Centered with negative half-size margins because the parallax engine owns transform.
        >
          <Image
            src={brand.starMain.src}
            alt={brand.starMain.alt}
            width={brand.starMain.width}
            height={brand.starMain.height}
            className="size-20 md:size-24 px:size-40 md:px:size-48"
          />
        </div>

        <h2 data-px="hello" className="type-display-l text-navy px:absolute px:inset-x-4 px:top-[58%] px:text-center">
          {hello}
        </h2>

        <div
          data-px="meet-text"
          className="max-w-sm md:max-w-[19rem] lg:max-w-sm px:absolute px:top-[63%] px:left-[8%] lg:px:left-[10%] max-md:px:inset-x-6 max-md:px:top-[33%] max-md:px:max-w-[90vw]"
        >
          <SceneLabel>{label}</SceneLabel>
          <p className="type-body-l mt-3">{text}</p>
        </div>
      </div>

      {/* Stacked-page fallback phone when parallax is off; while parallax runs, StagePhone carries the shared phone. */}
      <div className="flex justify-center px:hidden">
        <PhoneFrame>
          <PhoneScreen screen={screen} />
        </PhoneFrame>
      </div>
    </ParallaxScene>
  );
}
