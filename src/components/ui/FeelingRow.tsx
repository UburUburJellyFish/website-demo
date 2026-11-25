import Image from "next/image";
import { feelings } from "@/content/images";

const ROW = [feelings.sleepGood, feelings.moodCalm, feelings.moodThrilled, feelings.moodExhausted, feelings.moodFrustrated];

type FeelingRowProps = {
  className?: string;
};

// A few of the app's sleep and mood faces in an overlapping row. Decoration: the card text already says
// "how you felt", so the images have no alt text.
export function FeelingRow({ className = "" }: FeelingRowProps) {
  return (
    <div aria-hidden className={`flex -space-x-2 ${className}`}>
      {ROW.map((feeling) => (
        <Image
          key={feeling.src}
          src={feeling.src}
          alt=""
          width={feeling.width}
          height={feeling.height}
          className="size-9 rounded-full ring-2 ring-home-tile"
        />
      ))}
    </div>
  );
}
