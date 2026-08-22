import { z } from "zod";

export const socialLinkFormSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  url: z.url("Must be a valid URL"),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkFormSchema>;
