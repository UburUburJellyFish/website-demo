// Converts the website images to WebP. Run with `npm run images`.
// Spec: docs/05-assets.md. Sources come from the Claire app repo (read only) and from assets-src/
// (raw frames taken from the screen recordings with ffmpeg; see docs/05-assets.md).
//
// A job is skipped when its output is newer than both its source and this script,
// so changing a job's settings here regenerates it.

import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.resolve(ROOT, "../C5-M01-UburUbur");
const SELF = fileURLToPath(import.meta.url);
const QUALITY = 82;

const app = (p) => path.join(APP, p);
const raw = (p) => path.join(ROOT, "assets-src", p);
const out = (p) => path.join(ROOT, "public/images", p);
const xcassets = (p) => app(`C5-M01-UburUbur/Assets.xcassets/${p}`);

/**
 * @typedef {{ left: number, top: number, width: number, height: number, sample: [number, number], why: string }} Cover
 * Covers a rectangle (in source pixels) with the color of the `sample` pixel next to it.
 * Only for things that must not be on the website: debug labels, Simulator-only messages, "Mock data" badges.
 */

/** @type {{ from: string, to: string, width: number, quality?: number, cover?: Cover[] }[]} */
const jobs = [
  // Brand
  { from: app("Demo-Video/logo/Claire-wordmark.webp"), to: out("brand/claire-wordmark.webp"), width: 1200 },
  { from: app("Demo-Video/logo/AppIcon.icon/Assets/bintang miring.png"), to: out("brand/claire-icon.webp"), width: 512 },
  { from: xcassets("BINTANG UTAMA.imageset/BINTANG UTAMA.png"), to: out("brand/claire-star-main.webp"), width: 800 },
  { from: xcassets("WidgetBintang.imageset/WidgetBintang.png"), to: out("brand/claire-star-widget.webp"), width: 400 },

  // Feelings (History)
  { from: xcassets("GoodSleep.imageset/It was good!.png"), to: out("feelings/sleep-good.webp"), width: 256 },
  { from: xcassets("OkaySleep.imageset/OK I guess.png"), to: out("feelings/sleep-okay.webp"), width: 256 },
  { from: xcassets("BadSleep.imageset/it was bad.png"), to: out("feelings/sleep-bad.webp"), width: 256 },
  { from: xcassets("Calm.imageset/Calm.png"), to: out("feelings/mood-calm.webp"), width: 256 },
  { from: xcassets("Thrilled.imageset/Thrilled.png"), to: out("feelings/mood-thrilled.webp"), width: 256 },
  { from: xcassets("Exhausted.imageset/Exhausted.png"), to: out("feelings/mood-exhausted.webp"), width: 256 },
  { from: xcassets("Frustated.imageset/Frustrated.png"), to: out("feelings/mood-frustrated.webp"), width: 256 },

  // QR (higher quality so it still scans)
  { from: app("QR-TestFlight/Claire-QR-3-Peek.png"), to: out("qr/claire-qr.webp"), width: 900, quality: 92 },

  // Screenshots (frames from Demo-Video/recordings, sample data "Sticky")
  { from: raw("screens/onboarding.png"), to: out("screens/onboarding.webp"), width: 900 },
  { from: raw("screens/home.png"), to: out("screens/home.webp"), width: 900 },
  { from: raw("screens/home-basal.png"), to: out("screens/home-basal.webp"), width: 900 },
  { from: raw("screens/voice.png"), to: out("screens/voice.webp"), width: 900 },
  {
    from: raw("screens/meal.png"),
    to: out("screens/meal.webp"),
    width: 900,
    cover: [{ left: 90, top: 1316, width: 230, height: 64, sample: [460, 1345], why: '"AI · 17,9 s" debug label' }],
  },
  { from: raw("screens/glucose.png"), to: out("screens/glucose.webp"), width: 900 },
  { from: raw("screens/insulin.png"), to: out("screens/insulin.webp"), width: 900 },
  { from: raw("screens/activity.png"), to: out("screens/activity.webp"), width: 900 },
  { from: raw("screens/history.png"), to: out("screens/history.webp"), width: 900 },
  {
    from: raw("screens/summary.png"),
    to: out("screens/summary.webp"),
    width: 900,
    cover: [{ left: 815, top: 255, width: 240, height: 82, sample: [700, 295], why: '"Mock data" badge' }],
  },
  { from: raw("screens/tips-low.png"), to: out("screens/tips-low.webp"), width: 900 },
  { from: raw("screens/tips-high.png"), to: out("screens/tips-high.webp"), width: 900 },
  {
    from: raw("screens/glucometer.png"),
    to: out("screens/glucometer.webp"),
    width: 900,
    cover: [
      {
        left: 40,
        top: 1495,
        width: 860,
        height: 145,
        sample: [1000, 1560],
        why: '"This device doesn\'t support Bluetooth glucometers." (Simulator only)',
      },
    ],
  },
  { from: raw("screens/reminders.png"), to: out("screens/reminders.webp"), width: 900 },
  { from: raw("screens/widget.png"), to: out("screens/widget.webp"), width: 900 },
];

const mtime = async (file) => (await stat(file)).mtimeMs;
const exists = async (file) => stat(file).then(() => true, () => false);
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function applyCovers(input, covers) {
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const c of covers) {
    const s = (c.sample[1] * info.width + c.sample[0]) * 4;
    const color = [data[s], data[s + 1], data[s + 2], data[s + 3]];
    for (let y = c.top; y < c.top + c.height; y++) {
      for (let x = c.left; x < c.left + c.width; x++) {
        const i = (y * info.width + x) * 4;
        data.set(color, i);
      }
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}

let made = 0;
let skipped = 0;
const missing = [];
const scriptTime = await mtime(SELF);

for (const job of jobs) {
  const name = path.relative(ROOT, job.to);
  if (!(await exists(job.from))) {
    missing.push(`${name} ← ${job.from}`);
    continue;
  }
  if ((await exists(job.to)) && (await mtime(job.to)) > Math.max(await mtime(job.from), scriptTime)) {
    skipped++;
    continue;
  }

  let image = sharp(job.from);
  if (job.cover) image = await applyCovers(image, job.cover);

  await mkdir(path.dirname(job.to), { recursive: true });
  const before = (await stat(job.from)).size;
  const info = await image
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality ?? QUALITY, effort: 6 })
    .toFile(job.to);
  made++;
  const notes = job.cover ? `  (covered: ${job.cover.map((c) => c.why).join("; ")})` : "";
  console.log(`${name}  ${info.width}×${info.height}  ${kb(before)} → ${kb(info.size)}${notes}`);
}

console.log(`\n${made} made, ${skipped} up to date${missing.length ? `, ${missing.length} missing` : ""}.`);
if (missing.length) {
  console.log(`Missing sources:\n  ${missing.join("\n  ")}`);
  process.exitCode = 1;
}
