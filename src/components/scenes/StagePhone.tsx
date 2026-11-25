import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { PhoneScreen } from "@/components/ui/PhoneScreen";

// Shared iPhone on the sticky stage across scenes `meet` through `connect` (only visible while parallax is on).
// Kept outside any individual ParallaxScene so screen transitions and positions stay continuous across scene changes.
// Each later screen sits on top of the one before, so a crossfade is just the next screen fading in. The timeline
// holds every screen at opacity 0 until its keyframe (an element waits at its first keyframe's "from").
export function StagePhone() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center px:flex max-md:items-end max-md:pb-[max(1rem,2svh)]">
      {/* isolate: the glow can sit behind the frame (-z-10) without leaving the phone. */}
      <div data-px="phone" className="relative isolate">
        <div
          data-px="voice-glow"
          aria-hidden
          className="absolute -inset-x-[70%] -inset-y-[20%] -z-10 rounded-full bg-[radial-gradient(closest-side,var(--voice-glow),transparent)]"
        />
        <PhoneFrame>
          <PhoneScreen target="screen-home" screen="home" />
          <PhoneScreen target="screen-voice" screen="voice" />
          <PhoneScreen target="screen-meal" screen="meal" />
          <PhoneScreen target="screen-glucose" screen="glucose" />
          <PhoneScreen target="screen-insulin" screen="insulin" />
          <PhoneScreen target="screen-activity" screen="activity" />
          <PhoneScreen target="screen-tips" screen="tipsLow" />
          <PhoneScreen target="screen-widget" screen="widget" />
        </PhoneFrame>
      </div>
    </div>
  );
}
