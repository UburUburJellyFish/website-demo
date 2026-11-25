import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { ClaireBubble } from "@/components/ui/ClaireBubble";
import { DeckIcon } from "@/components/ui/DeckIcon";
import { IngredientChip } from "@/components/ui/IngredientChip";
import { SceneLabel } from "@/components/ui/SceneLabel";
import { StackedPhone } from "@/components/ui/StackedPhone";
import { scenes } from "@/content/scenes";

// While the parallax runs, the shared StagePhone sits 20vw right of center (desktop) and is
// min(22rem,26vw,35svh) wide, so half of it is min(11rem,13vw,17.5svh). The positions below hang off that.
// (Class names are written out in full so Tailwind can find them.)

// The three text blocks share one spot on the stage (left on desktop, top on mobile) and take turns.
const TEXT =
  "max-w-md px:absolute px:top-[34%] px:left-[8%] px:max-w-[22rem] lg:px:left-[10%] max-md:px:inset-x-6 max-md:px:top-[4.75rem] max-md:px:max-w-none";

// Claire's reply, just left of the phone (never on top of it: Apple's bezel rules). On the mobile stage there is no
// room beside the phone, so the bubble is only read by screen readers there.
const BUBBLE =
  "px:absolute px:top-[18%] px:right-[calc(30vw_+_min(11rem,13vw,17.5svh)_+_1rem)] max-md:px:sr-only";

// Ingredient chips, always clear of the phone: right of it on large screens, under the text on tablets, and in one
// row just above the phone on mobile. Mobile: bottom = the phone's bottom gap + its height (width × 2000/978) + 0.75rem.
const CHIPS =
  "flex flex-wrap justify-center gap-2 px:absolute md:px:flex-col md:px:items-start lg:px:top-[44%] lg:px:left-[calc(70vw_+_min(11rem,13vw,17.5svh)_+_1.25rem)] md:max-lg:px:top-[64%] md:max-lg:px:left-[8%] max-md:px:inset-x-3 max-md:px:gap-1.5 max-md:px:bottom-[calc(max(1rem,2svh)_+_min(62vw,25svh)*2.045_+_0.75rem)]";

// Each part is a normal two-column row on the stacked page; `px:contents` lets its pieces sit on the stage instead.
const ROW = "grid items-center gap-8 md:grid-cols-2 px:contents";
const PHONE_COLUMN = "flex flex-col items-center gap-4 px:contents";

// Scene 4: logging. The shared phone shows Voice log, then Meal, then Glucose → Insulin → Activity
// (docs/02-parallax.md, keyframes 8–14). Without the parallax every part gets its own phone.
export function LogScene() {
  const { voice, meal, quick } = scenes.log;

  return (
    <ParallaxScene
      id="log"
      label={voice.label}
      className="mx-auto flex max-w-5xl flex-col gap-20 px-4 py-20 px:max-w-none px:py-0"
    >
      {/* Voice log */}
      <div className={ROW}>
        <div data-px="voice-text" className={TEXT}>
          <SceneLabel>{voice.label}</SceneLabel>
          <p className="type-body-l mt-3">{voice.text}</p>
        </div>
        <div className={PHONE_COLUMN}>
          <ClaireBubble target="bubble-voice" tail="right" className={BUBBLE}>
            {voice.bubble}
          </ClaireBubble>
          <StackedPhone screen={voice.screen} />
        </div>
      </div>

      {/* Meal photo */}
      <div className={ROW}>
        <div data-px="meal-text" className={TEXT}>
          <SceneLabel>{meal.label}</SceneLabel>
          <p className="type-body-l mt-3">{meal.text}</p>
        </div>
        <div className={PHONE_COLUMN}>
          <ClaireBubble target="bubble-meal" tail="right" className={BUBBLE}>
            {meal.bubble}
          </ClaireBubble>
          <ul className={CHIPS}>
            {meal.ingredientChips.map((name, i) => (
              <IngredientChip key={name} name={name} target={`ingredient-${i + 1}`} />
            ))}
          </ul>
          <StackedPhone screen={meal.screen} />
        </div>
      </div>

      {/* Glucose, insulin, activity */}
      <div className={ROW}>
        <div data-px="quick-text" className={TEXT}>
          <SceneLabel>{quick.label}</SceneLabel>
          <p className="type-body-l mt-3">{quick.text}</p>
          <ul className="mt-6 flex gap-4 max-md:mt-4 max-md:px:hidden">
            {quick.decks.map((deck) => (
              <li key={deck.kind}>
                <DeckIcon kind={deck.kind} label={deck.label} target={`deck-${deck.kind}`} />
              </li>
            ))}
          </ul>
        </div>
        <div className={PHONE_COLUMN}>
          <StackedPhone screen={quick.decks[0].screen} />
        </div>
      </div>
    </ParallaxScene>
  );
}
