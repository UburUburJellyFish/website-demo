import Image from "next/image";
import { screens, type ScreenId } from "@/content/screens";

type PhoneScreenProps = {
  screen: ScreenId;
  target?: string;
  className?: string;
};

// One app screenshot inside PhoneFrame. Stacked absolutely so the engine can crossfade via opacity.
export function PhoneScreen({ screen, target, className = "" }: PhoneScreenProps) {
  const { src, alt, width, height } = screens[screen];

  return (
    <div data-px={target} className={`absolute inset-0 ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} className="h-full w-full object-cover" />
    </div>
  );
}
