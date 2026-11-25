// Brand, mascot, feelings and QR images (made by `npm run images`, see docs/05-assets.md).
// App screenshots are in screens.ts.

export type SiteImage = { src: string; width: number; height: number; alt: string };

export const brand = {
  wordmark: {
    src: "/images/brand/claire-wordmark.webp",
    width: 1200,
    height: 640,
    alt: "Claire, live beyond diabetes",
  },
  icon: { src: "/images/brand/claire-icon.webp", width: 512, height: 512, alt: "" },
  starMain: { src: "/images/brand/claire-star-main.webp", width: 800, height: 800, alt: "Claire, the star mascot" },
  starWidget: { src: "/images/brand/claire-star-widget.webp", width: 400, height: 400, alt: "" },
} satisfies Record<string, SiteImage>;

export const feelings = {
  sleepGood: { src: "/images/feelings/sleep-good.webp", width: 256, height: 256, alt: "Slept well" },
  sleepOkay: { src: "/images/feelings/sleep-okay.webp", width: 256, height: 256, alt: "Slept okay" },
  sleepBad: { src: "/images/feelings/sleep-bad.webp", width: 256, height: 256, alt: "Slept badly" },
  moodCalm: { src: "/images/feelings/mood-calm.webp", width: 256, height: 256, alt: "Calm" },
  moodThrilled: { src: "/images/feelings/mood-thrilled.webp", width: 256, height: 256, alt: "Thrilled" },
  moodExhausted: { src: "/images/feelings/mood-exhausted.webp", width: 256, height: 256, alt: "Exhausted" },
  moodFrustrated: { src: "/images/feelings/mood-frustrated.webp", width: 256, height: 256, alt: "Frustrated" },
} satisfies Record<string, SiteImage>;

// Official Apple iPhone bezel (from Apple's marketing resources, given by Aaron). Used "as is": Apple's
// "Apple Product Images" rules forbid shadows, tilting, spinning, cropping and anything placed on top of it.
// The screen is the transparent area: 874×1900 at (52, 50) in this 978×2000 image (measured, see PhoneFrame).
export const device = {
  bezel: { src: "/images/device/iphone-bezel.webp", width: 978, height: 2000, alt: "" },
} satisfies Record<string, SiteImage>;

export const qr: SiteImage = {
  src: "/images/qr/claire-qr.webp",
  width: 900,
  height: 1200,
  alt: "QR code to join the Claire beta on TestFlight.",
};
