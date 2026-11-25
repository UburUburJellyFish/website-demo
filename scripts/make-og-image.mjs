// Makes the link preview image (Open Graph / Twitter) for the website. Run with `npm run og`.
// Output: src/app/opengraph-image.png and src/app/twitter-image.png (Next's metadata file convention adds the tags).
// 1200×630: the Claire wordmark on the stage gradient (home-background → home-cream) with small stars and the thin
// frame line, like the top of the website. AppColor colors only (docs/01-design-system.md).

import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200;
const H = 630;

const HOME_BACKGROUND = "#edf8ff";
const HOME_CREAM = "#fffdf6";
const HOME_STAR = "#ffd658";
const HIGHLIGHT_CHART = "#fee08e";
const NAVY = "#3f5996";

/** Points of a five-pointed star centered on (cx, cy). */
function star(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(" ");
}

// Fixed positions (no randomness, so the image is the same on every run): [x, y, radius, color].
const STARS = [
  [140, 120, 14, HOME_STAR],
  [250, 470, 9, HIGHLIGHT_CHART],
  [95, 360, 7, HIGHLIGHT_CHART],
  [330, 90, 6, HIGHLIGHT_CHART],
  [1040, 140, 12, HOME_STAR],
  [1110, 420, 9, HIGHLIGHT_CHART],
  [930, 520, 15, HOME_STAR],
  [860, 80, 6, HIGHLIGHT_CHART],
  [1150, 260, 6, HIGHLIGHT_CHART],
  [420, 545, 6, HIGHLIGHT_CHART],
];

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="stage" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${HOME_BACKGROUND}"/>
      <stop offset="1" stop-color="${HOME_CREAM}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#stage)"/>
  ${STARS.map(([x, y, r, color]) => `<polygon points="${star(x, y, r)}" fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`).join("\n  ")}
  <rect x="16.5" y="16.5" width="${W - 33}" height="${H - 33}" fill="none" stroke="${NAVY}" stroke-opacity="0.2"/>
</svg>`;

const wordmarkWidth = 760;
const wordmark = await sharp(path.join(ROOT, "public/images/brand/claire-wordmark.webp"))
  .resize({ width: wordmarkWidth })
  .png()
  .toBuffer();
const { height: wordmarkHeight } = await sharp(wordmark).metadata();

const out = path.join(ROOT, "src/app/opengraph-image.png");
await sharp(Buffer.from(background))
  .composite([{ input: wordmark, left: Math.round((W - wordmarkWidth) / 2), top: Math.round((H - wordmarkHeight) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(out);
await copyFile(out, path.join(ROOT, "src/app/twitter-image.png"));
console.log(`opengraph-image.png and twitter-image.png, ${W}×${H}`);
