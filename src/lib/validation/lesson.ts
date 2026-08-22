import { z } from "zod";

export const lessonLevelValues = [
  "BEGINNER",
  "ELEMENTARY",
  "INTERMEDIATE",
  "UPPER_INTERMEDIATE",
  "ADVANCED",
] as const;

export const localeValues = ["EN", "RU", "UK"] as const;

export const linesToArray = (value: string | undefined) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * Accepts either an absolute URL or a root-relative path, because the
 * upload endpoint hands back paths like `/uploads/lesson.pdf`.
 */
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || value.startsWith("/") || z.url().safeParse(value).success,
    { message: "Must be a valid URL or an uploaded file path" },
  );

const slugField = z
  .string()
  .trim()
  .min(3, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");

const optionalSlugOverride = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: "Use lowercase letters, numbers, and hyphens only",
  });

/** Locale-independent lesson fields (§40). */
export const lessonBaseFormSchema = z.object({
  slug: slugField,
  level: z.enum(lessonLevelValues),
  duration: z.number().int().min(1, "Must be at least 1 minute").max(600),
  thumbnailUrl: optionalUrl,
  videoUrl: optionalUrl,
  pdfUrl: optionalUrl,
  isTrial: z.boolean(),
  isPublished: z.boolean(),
  order: z.number().int().min(0),
  tagIds: z.array(z.string()),
});

export type LessonBaseFormValues = z.infer<typeof lessonBaseFormSchema>;

/** Per-locale lesson copy (§40, §47). */
export const lessonTranslationFormSchema = z.object({
  slug: optionalSlugOverride,
  title: z.string().trim().min(3, "Title is required"),
  shortDescription: z.string().trim().min(10, "Short description is required"),
  description: z.string().trim().min(10, "Description is required"),
  content: z.string().trim().optional(),
  learningOutcomes: z.string().optional(),
  vocabulary: z.string().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type LessonTranslationFormValues = z.infer<
  typeof lessonTranslationFormSchema
>;
