import type { NextConfig } from "next";

const hostingExport = process.env.HOSTING_EXPORT === "1";

const nextConfig: NextConfig = {
  cacheComponents: !hostingExport,
  partialPrefetching: !hostingExport,
  ...(hostingExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
