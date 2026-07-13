import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS
  ? "/mcxiaocai666.github.io"
  : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: process.env.GITHUB_ACTIONS ? ".next-gh" : ".next",
  basePath,
  assetPrefix: basePath || undefined,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
