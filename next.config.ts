import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cursor cloud agent proxy to access dev server assets & API
  allowedDevOrigins: ["*.agent.cvm.dev", "*.cvm.dev"],
};

export default nextConfig;
