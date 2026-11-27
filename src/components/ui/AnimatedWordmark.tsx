import type { CSSProperties } from "react";
import { STAR } from "@/components/ui/StarField";
import { site } from "@/content/site";

type AnimatedWordmarkProps = {
  /** What screen readers hear (the letters themselves are hidden from them). */
  label: string;
};

/** Sparks thrown off when the star lands, in star sizes (em) from its center. */
const SPARKS = [
  { dx: "-1.7em", dy: "-1.1em", color: "fill-home-star" },
  { dx: "1.8em", dy: "-1.3em", color: "fill-highlight-chart" },
  { dx: "-2em", dy: "0.6em", color: "fill-highlight-chart" },
  { dx: "2.1em", dy: "0.5em", color: "fill-home-star" },
  { dx: "-0.3em", dy: "-2.1em", color: "fill-home-star" },
  { dx: "0.5em", dy: "1.7em", color: "fill-highlight-chart" },
];

const letterStyle = (i: number) => ({ "--i": i }) as CSSProperties;

// The intro wordmark as live text in Astonpoliz, the font of the official Claire logo, in the logo's own two colors
// (tokens wordmark / wordmark-tagline). The i is a dotless ı with Claire's star as its dot, like the logo. Every
// letter, the star, its sparks and every tagline word animate in CSS (globals.css, "Intro wordmark"); nothing here
// needs JavaScript. Sizes follow the logo (measured side by side): "Claıre" is 2.58em wide, the star 0.155em, centered
// 0.66em above the baseline over the ı, and the tagline 0.21× the title size and 0.8× its width.
export function AnimatedWordmark({ label }: AnimatedWordmarkProps) {
  const letters = [...site.name];

  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden className="block font-display leading-none select-none">
        <span className="block text-[min(9.25rem,27.5vw)] whitespace-nowrap text-wordmark">
          {letters.map((letter, i) => (
            <span key={i} className="wordmark-letter" style={letterStyle(i)}>
              {letter === "i" ? (
                <span className="wordmark-glyph relative">
                  ı
                  <span className="wordmark-star absolute top-[0.47em] left-[calc(50%-0.5em)] size-[1em] text-[0.155em]">
                    {/* A stroke in the same yellow rounds the points, like the logo's softer star. */}
                    <svg
                      viewBox="0 0 24 24"
                      className="size-full fill-home-star stroke-home-star stroke-2 [stroke-linejoin:round]"
                    >
                      <polygon points={STAR} />
                    </svg>
                    {SPARKS.map((spark) => (
                      <svg
                        key={spark.dx}
                        viewBox="0 0 24 24"
                        className={`wordmark-spark absolute top-[0.25em] left-[0.25em] size-[0.5em] ${spark.color}`}
                        style={
                          {
                            "--dx": spark.dx,
                            "--dy": spark.dy,
                          } as CSSProperties
                        }
                      >
                        <polygon points={STAR} />
                      </svg>
                    ))}
                  </span>
                </span>
              ) : (
                <span className="wordmark-glyph">{letter}</span>
              )}
            </span>
          ))}
        </span>
        <span className="-mt-[0.12em] block text-[min(1.94rem,5.78vw)] whitespace-nowrap text-wordmark-tagline">
          {site.tagline.split(" ").map((word, i) => (
            <span key={word}>
              {i > 0 && " "}
              <span className="wordmark-word" style={letterStyle(i)}>
                {word}
              </span>
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
