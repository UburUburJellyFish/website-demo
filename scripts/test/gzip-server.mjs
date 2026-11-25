// Test-only static server for out/ with gzip, like a real host (python's http.server sends everything uncompressed).
// Use for Lighthouse: `node scripts/test/gzip-server.mjs out 4174`, then run Lighthouse against http://localhost:4174/.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve(process.argv[2]);
const port = Number(process.argv[3] ?? 4174);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain", ".json": "application/json", ".xml": "application/xml", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".ttf": "font/ttf", ".ico": "image/x-icon" };
const compress = new Set([".html", ".js", ".css", ".txt", ".json", ".xml", ".svg", ".ttf"]);

createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const base = path.join(root, p);
    if (!base.startsWith(root)) throw new Error("outside");
    // Like a static host: /privacy → privacy.html (Next writes a privacy/ folder next to it), / → index.html.
    let file = null;
    for (const candidate of [base, `${base}.html`, path.join(base, "index.html")]) {
      if ((await stat(candidate).catch(() => null))?.isFile()) { file = candidate; break; }
    }
    if (!file) throw new Error("missing");
    const ext = path.extname(file);
    let body = await readFile(file);
    const headers = { "content-type": types[ext] ?? "application/octet-stream", "cache-control": p.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "public, max-age=0" };
    if (compress.has(ext) && /gzip/.test(req.headers["accept-encoding"] ?? "")) { body = gzipSync(body); headers["content-encoding"] = "gzip"; }
    res.writeHead(200, headers).end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`serving ${root} on http://localhost:${port}`));
