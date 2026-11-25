// Privacy Policy page (/privacy), the URL for App Store Connect. Copy source: docs/03-content.md ("/privacy").
// Every statement comes from the Claire app's code (audit on 2026-11-25, see docs/03-content.md). If the app changes
// what it collects or where data goes, update this file and `lastUpdated`.

export type PrivacyHighlightIcon = "account" | "device" | "meal" | "tracking";

/** A paragraph, a bullet list, or a row of outside links (opened in a new tab). */
export type PrivacyBlock = string | { list: string[] } | { links: { label: string; href: string }[] };

export type PrivacySection = { id: string; title: string; blocks: PrivacyBlock[] };

// Written by hand (no `new Date()` in a Server Component, and the date is the policy's, not the build's).
const lastUpdated = "November 25, 2026";

export const privacy = {
  path: "/privacy",
  metaTitle: "Privacy Policy · Claire",
  metaDescription: "How the Claire app for iPhone handles your information: what stays on your iPhone, and what is sent where.",
  skipLink: "Skip to the policy",
  backLabel: "Back to home",
  title: "Privacy Policy",
  intro:
    "Claire is built so your diabetes logbook stays yours. Here's exactly what the app does, and doesn't do, with your information.",
  chips: [`Last updated: ${lastUpdated}`, "Applies to Claire for iPhone (beta)"],

  highlights: [
    { icon: "account", title: "No account needed", text: "No sign-up, login or password." },
    { icon: "device", title: "Stays on your iPhone", text: "Your profile and logs are stored on your device." },
    { icon: "meal", title: "Meals, to find ingredients", text: "Meal photos and names go to Google Gemini." },
    { icon: "tracking", title: "No tracking or ads", text: "No analytics, ads or third-party SDKs." },
  ] satisfies { icon: PrivacyHighlightIcon; title: string; text: string }[],

  tocLabel: "On this page",
  opening:
    "The UburUbur team (“we,” “our” or “us”) makes Claire, a logbook for people with type 1 diabetes. This Privacy Policy explains how the Claire app for iPhone (the “App”) and this website handle information. By using the App, you agree to the practices described here.",
  notice: "This policy covers the Claire beta on TestFlight. We’ll update it before the App’s public release.",

  sections: [
    {
      id: "information-we-collect",
      title: "Information we collect",
      blocks: [
        "We don’t run servers for Claire, and we don’t collect, store or sell your personal information. The App has no account: we never ask for your email address, phone number or a password.",
        "The information in Claire is what you enter or connect yourself, and it stays on your iPhone as described below. The only time Claire itself sends information off your iPhone is to find the ingredients of a meal (section 3).",
      ],
    },
    {
      id: "data-on-your-iphone",
      title: "Data stored on your iPhone",
      blocks: [
        "Everything you log is saved in the App’s own storage on your iPhone:",
        {
          list: [
            "Your profile: your name, birth date, gender, height, weight and any body measurements you choose to enter (body fat, neck, waist, hip), your daily calories, your glucose unit and your glucose range.",
            "Your insulins and your glucometers.",
            "Your logs: glucose readings, insulin doses, meals (including meal photos), activities, sleep and mood check-ins, and reminders.",
          ],
        },
        "Claire’s Home Screen and Lock Screen widgets read your latest glucose and insulin from a shared space on the same iPhone. Claire doesn’t sync anything to iCloud or to any server.",
        "If you back up your iPhone (with iCloud Backup or a computer), Apple may include the App’s data in that backup, according to your backup settings and Apple’s privacy policy.",
      ],
    },
    {
      id: "meal-analysis",
      title: "Meal analysis with Google Gemini",
      blocks: [
        "When Claire works out the ingredients of a meal (when you tap “Find ingredients,” save a meal, or change a meal that already has ingredients), the App sends what you gave it for that meal to Google’s Gemini API: the meal photo (made smaller first), the meal name and the ingredients you typed. Gemini sends back a list of ingredients and their estimated grams. Nutrition values come from Indonesia’s food composition table (TKPI), which is built into the App.",
        "Claire doesn’t send your name, your profile, your glucose, your insulin or any other health data with these requests, and doesn’t add anything that identifies you or your iPhone.",
        "Google handles these requests under its Gemini API terms and its privacy policy, which explain how Google may use and keep them. Please don’t include people or personal details in your meal photos.",
        {
          links: [
            { label: "Gemini API Additional Terms of Service", href: "https://ai.google.dev/gemini-api/terms" },
            { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
          ],
        },
      ],
    },
    {
      id: "voice-log",
      title: "Voice log",
      blocks: [
        "When you tap the microphone, the App listens and turns what you say into text with Apple’s speech recognition. When your iPhone has the speech model for your language, this happens on your iPhone; otherwise Apple may process the audio on its servers, under Apple’s privacy policy.",
        "Claire then reads the text with Apple’s on-device language model to fill in your log. Claire doesn’t save your recordings.",
        { links: [{ label: "Apple Privacy Policy", href: "https://www.apple.com/legal/privacy/" }] },
      ],
    },
    {
      id: "apple-health",
      title: "Apple Health",
      blocks: [
        "If you allow it, Claire reads your workouts, active energy and sleep from Apple Health, to log your activities and to ask how you slept. Claire never writes to Apple Health.",
        "Health data stays on your iPhone. We don’t use it for advertising and don’t share it with anyone, including Google.",
      ],
    },
    {
      id: "bluetooth-glucometer",
      title: "Bluetooth glucometer",
      blocks: [
        "If you connect a glucometer that uses the standard Bluetooth Glucose Profile, Claire reads its glucose readings over Bluetooth and saves them in the App on your iPhone.",
      ],
    },
    {
      id: "tips-and-reminders",
      title: "Tips, insights and reminders",
      blocks: [
        "Tips, the weekly summary, patterns and workout heads-ups are worked out on your iPhone from your own logs.",
        "Reminders are notifications scheduled on your iPhone. Claire has no notification server.",
      ],
    },
    {
      id: "permissions",
      title: "Permissions",
      blocks: [
        "Claire asks for these permissions only when you use the feature that needs them:",
        {
          list: [
            "Camera: to take a photo of your meal.",
            "Photos: to pick a meal photo. The App only gets the photo you choose.",
            "Microphone and Speech Recognition: for the voice log.",
            "Apple Health: to read workouts, active energy and sleep (read only).",
            "Bluetooth: to bring in readings from your glucometer.",
            "Notifications: for reminders.",
          ],
        },
        "You can turn any of them off in the Settings app at any time; only the feature that needs it stops working.",
      ],
    },
    {
      id: "data-sharing",
      title: "Data sharing",
      blocks: [
        "We don’t sell, rent or share your information. The only outside service that receives information from Claire is Google, to find the ingredients of your meals (section 3).",
      ],
    },
    {
      id: "analytics-tracking-ads",
      title: "Analytics, tracking and ads",
      blocks: [
        "Claire has no analytics, no advertising and no third-party SDKs, and doesn’t track you across apps or websites.",
      ],
    },
    {
      id: "keeping-and-deleting",
      title: "Keeping and deleting your data",
      blocks: [
        "Your data stays on your iPhone until you delete it. You can delete entries in the App, and deleting the App removes its data from your iPhone (backups follow your backup settings).",
        "We don’t hold a copy of your data, so there is nothing for us to delete on our side. For meal analysis requests, see Google’s terms in section 3.",
      ],
    },
    {
      id: "this-website",
      title: "This website",
      blocks: [
        "This website is a static page: no cookies, no analytics, no forms and no accounts, and we don’t collect information through it. Our hosting provider (Vercel) may keep standard server logs, such as IP addresses, to deliver and protect the site.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        "When this policy changes, we’ll post the new version on this page and update the “Last updated” date at the top.",
      ],
    },
  ] satisfies PrivacySection[],

  contact: {
    id: "contact",
    title: "Contact us",
    text: "Questions about your privacy or this policy? Email us at",
    // Shown publicly, chosen by Aaron (2026-11-25).
    email: "aaron.soelistiono22@gmail.com",
    team: "Claire is made by the UburUbur team at Apple Developer Academy @ UC Surabaya.",
  },
} as const;
