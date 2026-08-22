import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Media URLs are admin-controlled (DB-stored), not user input, and the
    // storage provider is swappable (see src/lib/storage.ts) — so any https
    // host is allowed rather than pinning to one provider's domain.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Photos and deck slides are the product here, so allow a high tier
    // alongside the default. AVIF first: same detail, fewer bytes.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
