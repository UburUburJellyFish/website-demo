import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { AnimatedWordmark } from "@/components/ui/AnimatedWordmark";
import { scenes } from "@/content/scenes";

// Scene 1: the Claire wordmark builds itself letter by letter on load (AnimatedWordmark), then the wordmark and the
// tagline rise and fade as the visitor starts scrolling.
export function IntroScene() {
  const { wordmarkAlt, tagline, scrollHint } = scenes.intro;

  return (
    <ParallaxScene
      id="intro"
      initial
      label={wordmarkAlt}
      className="flex min-h-svh flex-col items-center justify-center px-4 py-16 text-center px:block px:min-h-0 px:py-0"
    >
      <div className="flex flex-col items-center px:absolute px:inset-x-0 px:top-[32%] px:px-4">
        <h1 data-px="wordmark">
          <AnimatedWordmark label={wordmarkAlt} />
        </h1>
        <p data-px="tagline" className="type-body-l mt-5 max-w-xl">
          {tagline}
        </p>
      </div>
      <p
        data-px="scroll-hint"
        className="type-small mt-12 text-navy px:mt-0 px:absolute px:inset-x-0 px:bottom-24 px:text-center"
      >
        {scrollHint} ↓
      </p>
    </ParallaxScene>
  );
}
