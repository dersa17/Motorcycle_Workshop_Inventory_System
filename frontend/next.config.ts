import type { NextConfig } from "next";

// Ambil URL dari Environment Variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Parse URL untuk mengambil protocol, hostname, dan port secara otomatis
const url = new URL(apiUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || "", // Jika port tidak ada (seperti di production), biarkan kosong
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;