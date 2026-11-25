// App screenshots shown in the phone frame. Copy source: docs/05-assets.md.
// Made by `npm run images` from frames of Demo-Video/recordings (sample data "Sticky").
// Which recording and second each frame comes from: docs/05-assets.md.

export type ScreenId =
  | "onboarding"
  | "home"
  | "homeBasal"
  | "voice"
  | "meal"
  | "glucose"
  | "insulin"
  | "activity"
  | "history"
  | "summary"
  | "tipsLow"
  | "tipsHigh"
  | "glucometer"
  | "reminders"
  | "widget";

export type Screen = {
  src: string;
  alt: string;
  /** Pixel size of the WebP file. */
  width: number;
  height: number;
};

export const screens: Record<ScreenId, Screen> = {
  onboarding: {
    src: "/images/screens/onboarding.webp",
    alt: "Onboarding step for your glucose range.",
    width: 900,
    height: 1957,
  },
  home: {
    src: "/images/screens/home.webp",
    alt: "Claire's Home screen: Let's start the day, with last glucose, last insulin and a highlight card.",
    width: 900,
    height: 1957,
  },
  homeBasal: {
    src: "/images/screens/home-basal.webp",
    alt: "Home asking how you slept last night.",
    width: 900,
    height: 1957,
  },
  voice: {
    src: "/images/screens/voice.webp",
    alt: "Voice log: Claire asks what you want to log.",
    width: 900,
    height: 1957,
  },
  meal: {
    src: "/images/screens/meal.webp",
    alt: "Meal log for nasi goreng telur ceplok with the ingredients Claire found.",
    width: 900,
    height: 1957,
  },
  glucose: {
    src: "/images/screens/glucose.webp",
    alt: "Glucose log for 205 mg/dL with a note that insulin is still working.",
    width: 900,
    height: 1957,
  },
  insulin: {
    src: "/images/screens/insulin.webp",
    alt: "An alert that the last insulin dose is still active.",
    width: 900,
    height: 1957,
  },
  activity: {
    src: "/images/screens/activity.webp",
    alt: "Activity log with Walking, 30 minutes and moderate effort.",
    width: 900,
    height: 1957,
  },
  history: {
    src: "/images/screens/history.webp",
    alt: "History timeline for one day.",
    width: 900,
    height: 1957,
  },
  summary: {
    src: "/images/screens/summary.webp",
    alt: "Weekly summary with glucose range, averages and patterns.",
    width: 900,
    height: 1957,
  },
  tipsLow: {
    src: "/images/screens/tips-low.webp",
    alt: "A low reading of 62 mg/dL with a snack tip.",
    width: 900,
    height: 1957,
  },
  tipsHigh: {
    src: "/images/screens/tips-high.webp",
    alt: "A tip to take a short walk after a meal.",
    width: 900,
    height: 1957,
  },
  glucometer: {
    src: "/images/screens/glucometer.webp",
    alt: "Connecting a Bluetooth glucometer: supported meters and steps.",
    width: 900,
    height: 1957,
  },
  reminders: {
    src: "/images/screens/reminders.webp",
    alt: "Profile with insulins, Smart timing reminders, glucose range and Apple Health.",
    width: 900,
    height: 1957,
  },
  widget: {
    src: "/images/screens/widget.webp",
    alt: "Quick Log widget on the iPhone Home Screen.",
    width: 900,
    height: 1957,
  },
};
