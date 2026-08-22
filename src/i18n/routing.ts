import { defineRouting } from "next-intl/routing";

export const LOCALES = ["en", "ru", "uk"] as const;
export type AppLocale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
});
