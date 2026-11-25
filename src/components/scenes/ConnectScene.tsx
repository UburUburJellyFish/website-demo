import { ParallaxScene } from "@/components/parallax/ParallaxScene";
import { ConnectChip, type ConnectId } from "@/components/ui/ConnectChip";
import { SceneLabel } from "@/components/ui/SceneLabel";
import { StackedPhone } from "@/components/ui/StackedPhone";
import { scenes } from "@/content/scenes";

// Where each chip lands on the stage. The shared phone is back in the center here, so half its width
// (min(11rem,13vw,17.5svh)) + 2rem keeps the chips clear of it. On mobile the chips form a 2×2 grid above the phone
// (the wrapper turns into that grid) and show their title only; the full text stays for screen readers.
const CHIP_POSITION: Record<ConnectId, string> = {
  glucometer: "md:px:absolute px:top-[28%] px:right-[calc(50vw_+_min(11rem,13vw,17.5svh)_+_2rem)]",
  health: "md:px:absolute px:top-[28%] px:left-[calc(50vw_+_min(11rem,13vw,17.5svh)_+_2rem)]",
  reminders: "md:px:absolute px:top-[56%] px:right-[calc(50vw_+_min(11rem,13vw,17.5svh)_+_2rem)]",
  widgets: "md:px:absolute px:top-[56%] px:left-[calc(50vw_+_min(11rem,13vw,17.5svh)_+_2rem)]",
};
const CHIP_SIZE = "md:max-w-[13rem] lg:max-w-[17rem] max-md:px:max-w-none";

// Scene 8: connect & log fast. Four chips fly in from the corners and settle around the phone, the reverse of the
// burden explosion (docs keyframes 21–22). The phone shows the Quick Log widget.
export function ConnectScene() {
  const { label, chips, screen } = scenes.connect;

  return (
    <ParallaxScene
      id="connect"
      label={label}
      className="mx-auto grid min-h-svh max-w-5xl items-center gap-10 px-4 py-20 md:grid-cols-2 px:max-w-none px:py-0"
    >
      <div className="flex flex-col gap-4 px:contents">
        <div
          data-px="connect-label"
          className="px:absolute px:inset-x-4 px:top-[10%] px:text-center max-md:px:top-[4.75rem]"
        >
          <SceneLabel>{label}</SceneLabel>
        </div>
        {/* md+ stage: contents (chips are absolute). Mobile stage: stays a grid, placed above the phone.
            Breakpoint-split on purpose so two display/position classes never compete on one element. */}
        <div className="grid gap-3 md:px:contents max-md:px:absolute max-md:px:inset-x-4 max-md:px:top-[6.75rem] max-md:px:grid-cols-2">
          {chips.map((chip) => (
            <ConnectChip
              key={chip.id}
              id={chip.id}
              title={chip.title}
              text={chip.text}
              target={`chip-${chip.id}`}
              compactOnMobileStage
              className={`${CHIP_POSITION[chip.id]} ${CHIP_SIZE}`}
            />
          ))}
        </div>
      </div>
      <StackedPhone screen={screen} />
    </ParallaxScene>
  );
}
