import { z } from "zod";

const faqTranslationSchema = z.object({
  question: z.string().trim().min(3, "Question is required"),
  answer: z.string().trim().min(3, "Answer is required"),
});

export const faqFormSchema = z.object({
  isPublished: z.boolean(),
  translations: z.object({
    EN: faqTranslationSchema,
    RU: faqTranslationSchema,
    UK: faqTranslationSchema,
  }),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;
