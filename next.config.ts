import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Media URLs are admin-controlled (DB-stored), not user input, and the
    // storage provider is swappable (see src/lib/storage.ts) — so any https
    // host is allowed rather than pinning to one provider's domain.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withNextIntl(nextConfig);
