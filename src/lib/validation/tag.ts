import { z } from "zod";

const tagTranslationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
});

export const tagFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  translations: z.object({
    EN: tagTranslationSchema,
    RU: tagTranslationSchema,
    UK: tagTranslationSchema,
  }),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;
