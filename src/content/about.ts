// "About Claire" section. Copy source: docs/03-content.md ("#about").

export const about = {
  id: "about",
  title: "About Claire",
  // Particle sculptures beside the About text (components/ui/StarPlayground.tsx), after igloo.inc: grains push away
  // from the pointer and scatter on a tap; the arrows turn Claire into the other shapes. The hint is device-neutral.
  // shapes: one name per sculpture, in this order (src/lib/particles/shapes.ts).
  playground: {
    hint: "Give the stars a nudge",
    shapes: ["Claire", "Glucose", "Insulin", "Meals"],
    previousLabel: "Previous shape",
    nextLabel: "Next shape",
  },
  paragraphs: [
    "Claire started with conversations with people who live with type 1 diabetes and use insulin pens and a glucometer every day. Many told us logging felt like homework. So we built a logbook that is quick, friendly and on your side.",
    "Our mission is in our name tag: live beyond diabetes. Less time writing things down, more time living.",
  ],
  principlesTitle: "What Claire stands for",
  // icon: picked in components/sections/PrincipleCard.tsx. color: the icon tile's deck color.
  principles: [
    {
      icon: "dose",
      color: "insulin",
      title: "Your dose, your call",
      text: "Claire never picks your insulin dose. That stays between you and your doctor.",
    },
    {
      icon: "logs",
      color: "glucose",
      title: "Built on your own logs",
      text: "Tips and patterns come from your own days, not from a one-size-fits-all rule.",
    },
    {
      icon: "friendly",
      color: "star",
      title: "Friendly, not clinical",
      text: "A cheerful star, plain words and as few taps as possible.",
    },
  ],
  team: "Claire is made by the UburUbur team at Apple Developer Academy @ UC Surabaya.",
  // TODO: team member names (docs/03-content.md, "Perlu konfirmasi"). Empty = the list is not shown.
  members: [] as string[],
  privacy: {
    text: "Your logs are kept on your iPhone. Meal photos and descriptions are sent to Google Gemini to find the ingredients. This website doesn't collect any data.",
    // Not shown until the team confirms the wording (docs/03-content.md, "Perlu konfirmasi").
    confirmed: false,
  },
} as const;
