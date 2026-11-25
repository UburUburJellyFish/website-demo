import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { LogTile } from "@/components/ui/LogTile";
import { SceneLabel } from "@/components/ui/SceneLabel";
import { scenes } from "@/content/scenes";

// Scene 2: Everyday diabetes logging rises in as a 4×4 grid of tiles, explodes outward, then yields to "Claire takes it from here."
export function BurdenScene() {
  const { label, text, relief, tiles } = scenes.burden;

  return (
    <ParallaxScene
      id="burden"
      label={label}
      className="mx-auto grid min-h-svh max-w-5xl items-center gap-10 px-4 py-20 md:grid-cols-2 px:max-w-none px:py-0"
    >
      <div
        data-px="burden-text"
        className="max-w-sm md:max-w-[18rem] lg:max-w-[24rem] px:absolute px:top-[63%] px:left-[8%] lg:px:left-[10%] max-md:px:inset-x-6 max-md:px:top-[28%] max-md:px:max-w-[90vw]"
      >
        <SceneLabel>{label}</SceneLabel>
        {/* text-pretty: no single word left alone on the last line. */}
        <p className="type-body-l mt-3 text-pretty">{text}</p>
      </div>

      <div
        data-px="tile-grid"
        className="grid w-fit grid-cols-4 justify-self-center gap-2 md:gap-3 px:absolute px:top-full px:right-[8%] lg:px:right-[15%] max-md:px:right-auto max-md:px:left-1/2 max-md:px:-ml-[9.25rem]"
        // Centered on mobile with negative margin (half of 4×4.25rem + 3×0.5rem): the parallax engine owns transform.
      >
        {tiles.map((tile, i) => (
          <LogTile key={`${tile.value}-${tile.caption}`} {...tile} target={`tile-${i + 1}`} />
        ))}
      </div>

      <p
        data-px="relief-text"
        className="type-display-l mt-4 text-center text-balance text-navy md:col-span-2 px:mt-0 px:absolute px:inset-x-6 px:top-[44%]"
      >
        {relief}
      </p>
    </ParallaxScene>
  );
}
