import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "chrome-aws-lambda"],
};

export default nextConfig;
