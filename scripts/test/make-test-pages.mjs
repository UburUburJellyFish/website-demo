// Test-only: after `npm run build`, writes two copies of out/index.html for manual checks.
//   out/rm.html       reduced motion (matchMedia answers true only for the "reduce" query) → stacked page
//   out/bigtext.html  browser text size 32px → stacked page (parallax needs ≤ 20px)
// CSS media queries are not faked: animations guarded by @media (prefers-reduced-motion) still run in rm.html.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../out");
const html = await readFile(path.join(out, "index.html"), "utf8");

const fakeReducedMotion = `<script>(function(){var o=window.matchMedia.bind(window);window.matchMedia=function(q){if(q.indexOf("prefers-reduced-motion")>=0){return{matches:q.indexOf("reduce")>=0,media:q,addEventListener:function(){},removeEventListener:function(){},addListener:function(){},removeListener:function(){},onchange:null,dispatchEvent:function(){return false}}}return o(q)}})()</script>`;

await writeFile(path.join(out, "rm.html"), html.replace("<head>", `<head>${fakeReducedMotion}`));
await writeFile(path.join(out, "bigtext.html"), html.replace("<head>", "<head><style>html{font-size:32px}</style>"));
console.log("out/rm.html and out/bigtext.html written");
