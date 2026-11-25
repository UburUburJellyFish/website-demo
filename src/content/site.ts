// All website text lives here. Edit this file to change the copy;
// nothing is saved or loaded from a database.

export const site = {
  name: "Claire",
  tagline: "Live beyond diabetes",
  year: 2026,
  description:
    "Claire helps people with type 1 diabetes log glucose, insulin, meals and activity in a few taps.",
  nav: [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
  ],
  features: [
    {
      title: "Log in seconds",
      body: "Glucose, insulin, meals and activity from one Daily log.",
    },
    {
      title: "Talk to log",
      body: "Say what you ate or injected and Claire fills in the entry.",
    },
    {
      title: "See your day",
      body: "Highlights and insights that make patterns easier to spot.",
    },
  ],
  about:
    "Claire is made by the UburUbur team at Apple Developer Academy @ UC Surabaya. Claire does not give medical advice and never decides an insulin dose.",
} as const;
