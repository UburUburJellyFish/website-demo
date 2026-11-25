import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { scenes } from "@/content/scenes";

// Scene 6: "Your dose, your call." on the deep navy stage (voice-bottom, tone dark → on-dark text).
// Claire never picks an insulin dose; this is the one statement the whole site keeps to.
export function DoseScene() {
  const { statement, sub } = scenes.dose;

  return (
    <ParallaxScene
      id="dose"
      label={statement}
      className="mx-auto flex min-h-[60svh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center px:max-w-none px:py-0"
    >
      <h2 data-px="dose-statement" className="type-display-xl max-w-4xl">
        {statement}
      </h2>
      <p data-px="dose-sub" className="type-body-l mt-6 max-w-xl">
        {sub}
      </p>
    </ParallaxScene>
  );
}
