import type { NextConfig } from "next";

const hostingExport = process.env.HOSTING_EXPORT === "1";

const nextConfig: NextConfig = {
  cacheComponents: !hostingExport,
  partialPrefetching: !hostingExport,
  ...(hostingExport
    ? {
        output: "export",
        images: {
          loader: "custom",
          loaderFile: "./src/lib/image-loader.ts",
          deviceSizes: [480, 640, 828, 1200],
          imageSizes: [],
        },
        experimental: { inlineCss: true },
      }
    : {}),
};

export default nextConfig;
