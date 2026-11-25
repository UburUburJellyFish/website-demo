// "Everything in Claire" cards, in four groups. Copy source: docs/03-content.md ("#features").

export type FeatureId =
  | "voice"
  | "meal"
  | "glucose"
  | "insulin"
  | "activity"
  | "start-day"
  | "on-time"
  | "tips"
  | "check-again"
  | "heads-up"
  | "history"
  | "summary"
  | "glucometer"
  | "health"
  | "reminders"
  | "widgets"
  | "setup"
  | "secret";

// id picks the card's icon (and, for the Log cards, its deck color) in components/sections/FeatureCard.tsx.
export type FeatureCardContent = { id: FeatureId; title: string; text: string };

export type FeatureGroupContent = {
  id: "log" | "every-day" | "look-back" | "connect";
  title: string;
  cards: FeatureCardContent[];
};

export const featureSection = {
  id: "features",
  title: "Everything in Claire",
  subtitle: "Built for people who use insulin pens and a glucometer every day.",
  groups: [
    {
      id: "log",
      title: "Log",
      cards: [
        {
          id: "voice",
          title: "Talk to log",
          text: "Say it out loud in English or Bahasa Indonesia. Claire fills in the log and reads it back to you.",
        },
        {
          id: "meal",
          title: "Snap your meal",
          text: "A photo or a dish name is enough. Claire lists the ingredients and their grams, with nutrition from TKPI.",
        },
        {
          id: "glucose",
          title: "Glucose",
          text: "Every check is compared with your own range, so a high or low stands out right away.",
        },
        {
          id: "insulin",
          title: "Insulin",
          text: "Log rapid and basal doses. A ring shows how long your last dose keeps working, based on your insulin.",
        },
        {
          id: "activity",
          title: "Activity",
          text: "Pick a workout, how long and how hard. Workouts from Apple Health come in too.",
        },
      ],
    },
    {
      id: "every-day",
      title: "Every day",
      cards: [
        {
          id: "start-day",
          title: "Let's start the day",
          text: "Your last glucose, your last insulin and one idea for today, on one calm screen.",
        },
        {
          id: "on-time",
          title: "Right on time",
          text: "Claire asks how you slept in the morning, reminds you when a basal dose is due and checks in at bedtime.",
        },
        {
          id: "tips",
          title: "Little tips",
          text: "Running low? A snack first. Running high? Maybe a short walk. Meal and activity ideas come from what worked for you.",
        },
        { id: "check-again", title: "Check again", text: "After a low, Claire reminds you to check again." },
        {
          id: "heads-up",
          title: "Workout heads-up",
          text: "If a workout like this one ended low before, Claire gives you a heads-up. You can mute it any time.",
        },
      ],
    },
    {
      id: "look-back",
      title: "Look back",
      cards: [
        {
          id: "history",
          title: "History",
          text: "Every day on one timeline: checks, doses, meals, workouts and how you felt.",
        },
        {
          id: "summary",
          title: "Weekly summary",
          text: "Your glucose range, averages for fasting, before and after meals, and patterns from the last seven days.",
        },
      ],
    },
    {
      id: "connect",
      title: "Connect",
      cards: [
        {
          id: "glucometer",
          title: "Bluetooth glucometer",
          text: "Meters with the standard Bluetooth Glucose Profile sync their readings to Claire.",
        },
        { id: "health", title: "Apple Health", text: "Workouts and sleep come in from Apple Health." },
        {
          id: "reminders",
          title: "Smart reminders",
          text: "Reminders move to the times you usually eat, work out and go to bed. Or keep the default times.",
        },
        {
          id: "widgets",
          title: "Widgets",
          text: "Quick Log on your Home Screen. Last glucose and insulin on your Lock Screen.",
        },
        {
          id: "setup",
          title: "Quick setup",
          text: "Tell Claire your glucose range, your insulins and your daily calories in a few steps.",
        },
        { id: "secret", title: "A little secret", text: "There's a surprise hidden on Home. Can you find it?" },
      ],
    },
  ] satisfies FeatureGroupContent[],
} as const;
