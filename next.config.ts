import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export (`out/`). Remove when adding API routes, server actions
  // or a database that needs runtime rendering.
  output: "export",
  images: {
    // The default image optimizer needs a server; static export serves images as-is.
    unoptimized: true,
  },
};

export default nextConfig;
