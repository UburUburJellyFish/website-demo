import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { PhoneScreen } from "@/components/ui/PhoneScreen";
import type { ScreenId } from "@/content/screens";

// A phone for the stacked page only (reduced motion, no JavaScript). While the parallax runs it is hidden and the
// shared StagePhone shows the screens instead.
export function StackedPhone({ screen }: { screen: ScreenId }) {
  return (
    <div className="flex justify-center px:hidden">
      <PhoneFrame>
        <PhoneScreen screen={screen} />
      </PhoneFrame>
    </div>
  );
}
