import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { ClaireBubble } from "@/components/ui/ClaireBubble";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { PhoneScreen } from "@/components/ui/PhoneScreen";
import { SceneLabel } from "@/components/ui/SceneLabel";
import { StackedPhone } from "@/components/ui/StackedPhone";
import { scenes } from "@/content/scenes";

// Text on a cream card, left on desktop (narrower on tablets so the phones fit beside it), top on mobile.
const TEXT_CARD =
  "max-w-md px:absolute px:top-[30%] px:left-[8%] px:rounded-3xl px:bg-home-cream/90 px:p-6 px:shadow-card md:px:max-w-[20rem] lg:px:left-[10%] lg:px:max-w-[24rem] max-md:px:inset-x-4 max-md:px:top-[4.75rem] max-md:px:max-w-none";

// Same spot as LogScene's bubbles: just left of a phone 20vw right of center. Screen readers only on the mobile stage.
const BUBBLE =
  "px:absolute px:top-[18%] px:right-[calc(30vw_+_min(11rem,13vw,17.5svh)_+_1rem)] max-md:px:sr-only";

// Where the phone wall sits: beside the text card from md up (its left edge = card left + card width + 2rem), under it
// on mobile. Every phone stays fully on screen and uncovered (Apple's bezel rules: no cropping, nothing on top).
const WALL =
  "absolute flex justify-center gap-[3vw] md:inset-y-0 md:right-[4vw] md:left-[calc(8vw_+_22rem)] md:items-center lg:left-[calc(10vw_+_26rem)] max-md:inset-x-4 max-md:top-[38svh] max-md:items-start";

// Scene 7: history and weekly insights (docs keyframes 19–20). Upright phones drift up at different speeds (depth),
// then fade away while the Summary phone rises in the shared phone's spot.
export function HistoryScene() {
  const { history, insight, wall, wallHero } = scenes.history;

  return (
    <ParallaxScene
      id="history"
      label={history.label}
      className="mx-auto flex max-w-5xl flex-col gap-20 px-4 py-20 px:max-w-none px:overflow-hidden px:py-0"
    >
      {/* The wall: decoration for the stage only. The outer element fades (data-px "wall"), each phone drifts
          (data-px "wall-col-N"). The third phone only shows from 1280px wide. */}
      <div data-px="wall" aria-hidden className="pointer-events-none absolute inset-0 hidden px:block">
        <div className={WALL}>
          {wall.map((screen, i) => (
            <div key={screen} data-px={`wall-col-${i + 1}`} className={i === 2 ? "max-xl:hidden" : ""}>
              <PhoneFrame size="wall">
                <PhoneScreen screen={screen} />
              </PhoneFrame>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="grid items-center gap-8 md:grid-cols-2 px:contents">
        <div data-px="history-text" className={TEXT_CARD}>
          <SceneLabel>{history.label}</SceneLabel>
          <p className="type-body-l mt-3">{history.text}</p>
        </div>
        <StackedPhone screen="history" />
      </div>

      {/* Weekly insights */}
      <div className="grid items-center gap-8 md:grid-cols-2 px:contents">
        <div data-px="insight-text" className={TEXT_CARD}>
          <SceneLabel>{insight.label}</SceneLabel>
          <p className="type-body-l mt-3">{insight.text}</p>
        </div>
        <div className="flex flex-col items-center gap-4 px:contents">
          {/* Stage: the Summary phone, centered 20vw right of center like the shared phone (margin, not transform). */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center px:flex max-md:items-end max-md:pb-[max(1rem,2svh)]">
            <div data-px="wall-hero" className="md:ml-[40vw]">
              <PhoneFrame>
                <PhoneScreen screen={wallHero} />
              </PhoneFrame>
            </div>
          </div>
          <ClaireBubble target="bubble-insight" tail="right" className={BUBBLE}>
            {insight.bubble}
          </ClaireBubble>
          <StackedPhone screen={wallHero} />
        </div>
      </div>
    </ParallaxScene>
  );
}
