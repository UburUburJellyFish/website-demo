import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend only: `npm run build` writes plain HTML/CSS/JS to `out/`.
  // No server, no database, no API routes.
  output: "export",
  images: {
    // The default image optimizer needs a server, so serve images as they are.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
