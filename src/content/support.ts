// Support page (/support), the Support URL for App Store Connect (Apple wants real contact information there).
// Copy source: docs/03-content.md ("/support"). Answers describe what the Claire app actually does (checked in the app
// code on 2026-11-26: Profile › glucometer card, the meal sheet's "Try Again" / "Save Without Nutrition", the Health
// settings path the app itself shows). Never write anything that sounds like dosing or treatment advice.

import type { PrivacyColor } from "@/content/privacy";
import { site } from "@/content/site";

/** One question with its answer paragraphs and, optionally, a link under them (e.g. the TestFlight invite). */
export type SupportFaq = { question: string; answer: string[]; link?: { label: string; href: string } };

export type SupportTopic = { id: string; title: string; color: PrivacyColor; faqs: SupportFaq[] };

export const support = {
  path: "/support",
  metaTitle: "Support · Claire",
  metaDescription: "Help with the Claire app for iPhone: how to get the beta, answers to common questions, and how to reach the team.",
  skipLink: "Skip to support",
  backLabel: "Back to home",
  title: "Support",
  intro: "Something not working, a question about Claire, or an idea for us? Here's how to get help.",
  chips: ["Claire for iPhone (beta)", "iOS 26 or later"],
  heroBubble: "Need a hand? The team is here to help.",

  email: "supportclaires@gmail.com",
  emailLabel: "Email the team",

  emergency: {
    title: "Claire can't help in an emergency",
    text: "Claire is a logbook, not a medical device, and it never picks your insulin dose. If you feel unwell or your glucose is very low or very high, follow the plan you made with your doctor and contact your doctor or local emergency services.",
  },

  faqTitle: "Common questions",
  topics: [
    {
      id: "getting-started",
      title: "Getting started",
      color: "glucose",
      faqs: [
        {
          question: "How do I get Claire?",
          answer: [
            "Claire is in beta on TestFlight. Install Apple’s TestFlight app from the App Store, then open our invite link on your iPhone and tap Install.",
            "Claire needs an iPhone with iOS 26 or later.",
          ],
          link: { label: "Open the TestFlight invite", href: site.testflightUrl ?? site.cta.href },
        },
        {
          question: "Does Claire tell me how much insulin to take?",
          answer: ["No. Claire never picks your insulin dose. That stays between you and your doctor."],
        },
      ],
    },
    {
      id: "logging",
      title: "Logging",
      color: "insulin",
      faqs: [
        {
          question: "The voice log doesn’t understand me.",
          answer: [
            "The voice log understands English and Bahasa Indonesia. Make sure Claire may use the microphone and speech recognition in Settings › Apps › Claire.",
            "If your iPhone doesn’t have the speech model for your language, speech recognition needs an internet connection.",
          ],
        },
        {
          question: "Finding the ingredients of my meal didn’t work.",
          answer: [
            "Finding ingredients needs an internet connection. If it fails, Claire lets you try again or save the meal without nutrition, so nothing you typed is lost.",
          ],
        },
      ],
    },
    {
      id: "connections",
      title: "Connections and reminders",
      color: "activity",
      faqs: [
        {
          question: "How do I connect my glucometer?",
          answer: [
            "Open the Profile tab and tap + on the glucometer card. Meters that use the standard Bluetooth Glucose Profile can sync their readings. You can always type a reading yourself too.",
          ],
        },
        {
          question: "How do I change what Claire reads from Apple Health?",
          answer: [
            "Open Settings › Health › Data Access & Devices › Claire. Claire only reads workouts, active energy and sleep, and never writes to Apple Health.",
          ],
        },
        {
          question: "My reminders don’t show up.",
          answer: ["Check that notifications are turned on for Claire in Settings › Notifications › Claire."],
        },
        {
          question: "How do I add the Claire widget?",
          answer: [
            "Touch and hold an empty spot on your Home Screen, tap Edit › Add Widget, and search for Claire. The Lock Screen widgets are added the same way when you customize your Lock Screen.",
          ],
        },
      ],
    },
    {
      id: "your-data",
      title: "Your data",
      color: "star",
      faqs: [
        {
          question: "How do I delete my data?",
          answer: [
            "Your logs are only on your iPhone. You can delete entries in the app, and deleting the app removes all of its data from your iPhone. We don’t keep a copy.",
          ],
        },
        {
          question: "Where can I read how Claire handles my information?",
          answer: ["Everything is in our Privacy Policy: what stays on your iPhone, and what is sent where."],
          link: { label: "Read the Privacy Policy", href: "/privacy" },
        },
      ],
    },
  ] satisfies SupportTopic[],

  contact: {
    title: "Still need help?",
    text: "Write to us and tell us what happened. These details help us find the problem faster:",
    include: [
      "Your iPhone model and iOS version.",
      "The Claire build number (shown in TestFlight).",
      "What you did, what you expected and what happened instead.",
      "A screenshot or screen recording, if you can.",
    ],
    testflightTip:
      "Testing the beta? You can also take a screenshot in Claire and tap Share Beta Feedback to send it to us through TestFlight.",
    privacyLink: { label: "Privacy Policy", href: "/privacy" },
    team: "Claire is made by the UburUbur team at Apple Developer Academy @ UC Surabaya.",
  },
} as const;
