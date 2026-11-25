import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { SceneLabel } from "@/components/ui/SceneLabel";
import { StackedPhone } from "@/components/ui/StackedPhone";
import { TipCard } from "@/components/ui/TipCard";
import { scenes } from "@/content/scenes";

// Stage layout: text and the two cards in the left column (the shared phone sits right of center). On mobile there is
// no room for both the cards and the phone, so the phone fades out here and the cards stack under the text.
// (TipCard is w-full; with left+right insets on mobile it must be w-auto or it overflows.)
const TEXT =
  "max-w-md px:absolute px:top-[20%] px:left-[8%] px:max-w-[24rem] lg:px:left-[10%] max-md:px:inset-x-6 max-md:px:top-[4.75rem] max-md:px:max-w-none";
const CARD_LOW =
  "px:absolute px:top-[44%] px:left-[8%] lg:px:left-[10%] max-md:px:inset-x-6 max-md:px:top-[10.75rem] max-md:px:w-auto max-md:px:max-w-none";
const CARD_HIGH =
  "px:absolute px:top-[60%] px:left-[8%] lg:px:left-[10%] max-md:px:inset-x-6 max-md:px:top-[16.5rem] max-md:px:w-auto max-md:px:max-w-none";

// Scene 5: little tips. Running low → a snack first; running high → maybe a short walk (docs keyframes 15–16).
export function TipsScene() {
  const { label, text, low, high, screen } = scenes.tips;

  return (
    <ParallaxScene
      id="tips"
      label={label}
      className="mx-auto grid min-h-svh max-w-5xl items-center gap-10 px-4 py-20 md:grid-cols-2 px:max-w-none px:py-0"
    >
      <div className="flex flex-col gap-4 px:contents">
        <div data-px="tips-text" className={TEXT}>
          <SceneLabel>{label}</SceneLabel>
          <p className="type-body-l mt-3">{text}</p>
        </div>
        <TipCard target="card-low" tone="low" title={low.title} text={low.text} className={CARD_LOW} />
        <TipCard target="card-high" tone="high" title={high.title} text={high.text} className={CARD_HIGH} />
      </div>
      <StackedPhone screen={screen} />
    </ParallaxScene>
  );
}
