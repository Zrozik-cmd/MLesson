import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.url().safeParse(value).success, {
    message: "Must be a valid URL",
  });

export const authorMetricSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

/** Locale-independent settings (§42). */
export const siteSettingsBaseFormSchema = z.object({
  authorName: z.string().trim().min(1, "Required"),
  authorPhotoUrl: optionalUrl,
  telegramUrl: z.url("Must be a valid URL"),
  siteName: z.string().trim().min(1, "Required"),
});

export type SiteSettingsBaseFormValues = z.infer<
  typeof siteSettingsBaseFormSchema
>;

/** Per-locale settings copy (§42). */
export const siteSettingsTranslationFormSchema = z.object({
  heroEyebrow: z.string().trim().min(1, "Required"),
  heroHeadline: z.string().trim().min(1, "Required"),
  heroDescription: z.string().trim().min(1, "Required"),
  heroCtaText: z.string().trim().min(1, "Required"),
  heroSecondaryCtaText: z.string().trim().min(1, "Required"),
  authorBio: z.string().trim().min(1, "Required"),
  authorShortBio: z.string().trim().min(1, "Required"),
  authorExperience: z.string().trim().min(1, "Required"),
  authorMetrics: z.array(authorMetricSchema).max(6),
  siteDescription: z.string().trim().min(1, "Required"),
});

export type SiteSettingsTranslationFormValues = z.infer<
  typeof siteSettingsTranslationFormSchema
>;
