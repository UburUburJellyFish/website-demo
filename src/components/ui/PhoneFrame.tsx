import Image from "next/image";
import type { ReactNode } from "react";
import { device } from "@/content/images";

type PhoneFrameProps = {
  children: ReactNode;
  /** "stage" = the main phone (default). "wall" = the small phones of the History wall. */
  size?: "stage" | "wall";
  className?: string;
};

// Widths per size. The stage width is also what the scenes' positions assume (half = min(11rem,13vw,17.5svh)).
// The svh caps keep the phone inside short viewports like 1280×800.
const SIZE = {
  stage: "w-[min(62vw,25svh)] md:w-[min(22rem,26vw,35svh)]",
  wall: "w-[34vw] md:w-[min(16vw,22svh)]",
} as const;

// The official Apple iPhone bezel with an app screenshot inside (docs/01-design-system.md, "Bingkai HP").
// The bezel image is shown as is, on top: no shadow, no tilt, nothing placed over it (Apple's "Apple Product Images"
// rules). The screen area is the bezel's transparent cutout (874×1900 at 52,50 in the 978×2000 image, i.e. 5.32% /
// 2.5% insets). The screenshot reaches a little under the black border and its corners are a little tighter than the
// cutout's (about 140px), so no gap shows at the rounded corners.
export function PhoneFrame({ children, size = "stage", className = "" }: PhoneFrameProps) {
  return (
    <div className={`relative aspect-[978/2000] ${SIZE[size]} ${className}`}>
      <div className="absolute inset-x-[5%] inset-y-[2.35%] overflow-hidden rounded-[13.6%/6.3%] bg-voice-bottom">
        {children}
      </div>
      <Image
        src={device.bezel.src}
        alt={device.bezel.alt}
        width={device.bezel.width}
        height={device.bezel.height}
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </div>
  );
}
