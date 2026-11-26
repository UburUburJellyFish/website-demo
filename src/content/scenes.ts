// Text for every parallax scene, in timeline order. Copy source: docs/03-content.md ("Scene parallax").
// Element names (wordmark, burden-text, ...) match the data-px targets in docs/02-parallax.md.

import type { ScreenId } from "@/content/screens";

export type LogKind = "glucose" | "insulin" | "meal" | "activity";

/** One tile in the Burden grid: a short value (one line) and a small caption (one line), like a log entry. */
export type LogTileContent = { kind: LogKind; value: string; caption: string };

export const scenes = {
  intro: {
    wordmarkAlt: "Claire, live beyond diabetes",
    tagline: "A smart journal designed for people with Type 1 diabetes that learns daily habits, turns them into actionable insights, and brings clarity to their glucose patterns.",
    scrollHint: "Scroll to meet Claire",
  },

  burden: {
    label: "Every. Single. Day.",
    text: "Glucose checks. Insulin shots. Meals. Workouts. Writing every one of them down is a lot.",
    relief: "Claire takes it from here.",
    // 4×4 grid, row by row. Each row and column holds one of each kind, so the colors mix.
    // Values stay short (≤ 6 characters) and captions ≤ 7, so every tile keeps one size and nothing wraps.
    tiles: [
      { kind: "glucose", value: "180", caption: "mg/dL" },
      { kind: "insulin", value: "4 u", caption: "rapid" },
      { kind: "meal", value: "Lunch", caption: "12:05" },
      { kind: "activity", value: "20 min", caption: "walk" },

      { kind: "activity", value: "30 min", caption: "cycling" },
      { kind: "glucose", value: "95", caption: "mg/dL" },
      { kind: "insulin", value: "10 u", caption: "basal" },
      { kind: "meal", value: "45 g", caption: "carbs" },

      { kind: "meal", value: "Snack?", caption: "15:00" },
      { kind: "activity", value: "Hard", caption: "effort" },
      { kind: "glucose", value: "62", caption: "low" },
      { kind: "insulin", value: "2 h", caption: "active?" },

      { kind: "insulin", value: "Dose?", caption: "21:00" },
      { kind: "meal", value: "350", caption: "kcal" },
      { kind: "activity", value: "15:00", caption: "gym" },
      { kind: "glucose", value: "110", caption: "fasting" },
    ] satisfies LogTileContent[],
  },

  meet: {
    hello: "Hi! I'm Claire.",
    label: "Let's start the day!",
    text: "Every morning Claire shows your last glucose, your last insulin and a little idea to try today.",
    screen: "home" satisfies ScreenId,
  },

  log: {
    voice: {
      label: "Hands full? Just talk.",
      text: "Say what you ate or did, and Claire writes it down for you. Claire understands English and Bahasa Indonesia.",
      bubble: "Got it! All saved.",
      screen: "voice" satisfies ScreenId,
    },
    meal: {
      label: "Snap your meal",
      text: "Take a photo or type the dish. Claire finds the ingredients and their grams, with nutrition from TKPI, Indonesia's food composition table.",
      bubble: "Yum, nasi goreng!",
      screen: "meal" satisfies ScreenId,
      // From the meal.webp screenshot. The app shows ingredient names only (the grams are stored, not shown).
      ingredients: ["Nasi putih", "Telur ceplok", "Minyak goreng", "Kecap manis", "Kerupuk udang"],
      // The three chips that fly in next to the phone (docs/03-content.md).
      ingredientChips: ["Nasi putih", "Telur ceplok", "Kerupuk udang"],
    },
    quick: {
      label: "Just a few taps",
      text: "Glucose, insulin and activity take seconds. A little high? Claire can remind you to check again. Last dose still working? Claire gives you a heads-up.",
      decks: [
        { kind: "glucose", label: "Glucose", screen: "glucose" },
        { kind: "insulin", label: "Insulin", screen: "insulin" },
        { kind: "activity", label: "Activity", screen: "activity" },
      ] satisfies { kind: LogKind; label: string; screen: ScreenId }[],
    },
  },

  tips: {
    label: "Little tips, right on time",
    text: "Ideas come from your own logs and from TKPI.",
    low: { title: "Running low?", text: "Have a snack first, then check again." },
    high: { title: "Running high?", text: "Maybe a short walk." },
    screen: "tipsLow" satisfies ScreenId,
  },

  dose: {
    statement: "Your dose, your call.",
    sub: "Claire never picks your insulin dose. That stays between you and your doctor.",
  },

  history: {
    history: {
      label: "Your days at a glance",
      text: "Look back on any day: checks, doses, meals, workouts and how you slept.",
    },
    insight: {
      label: "Weekly insights",
      text: "At the end of the week, Claire puts it all together: your glucose range, your averages by time of day and a few patterns worth knowing.",
      bubble: "Here's what I noticed this week.",
    },
    // Phone wall: three upright phones side by side (two below 1280px wide). The hero phone is "summary".
    wall: ["history", "home", "glucose"] satisfies ScreenId[],
    wallHero: "summary" satisfies ScreenId,
  },

  connect: {
    label: "Connect & log fast",
    chips: [
      { id: "glucometer", title: "Bluetooth glucometer.", text: "Readings sync on their own." },
      { id: "health", title: "Apple Health.", text: "Workouts and sleep come in by themselves." },
      { id: "reminders", title: "Smart reminders.", text: "They learn your routine." },
      {
        id: "widgets",
        title: "Widgets.",
        text: "Log from your Home Screen. See your last glucose and insulin on your Lock Screen.",
      },
    ],
    screen: "widget" satisfies ScreenId,
  },

  cta: {
    title: "Claire is in beta on TestFlight.",
    text: "Scan the code with your iPhone, or tap the button.",
    // On phones the QR code is hidden (the visitor is already on one).
    textMobile: "Tap the button to join on your iPhone.",
    note: "iPhone only. Requires iOS 26 or later.",
    bubble: "See you there!",
    qrAlt: "QR code to join the Claire beta on TestFlight.",
  },
} as const;
