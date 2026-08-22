import { z } from "zod";

/** Admin password change (§ admin account). */
export const passwordChangeFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(12, "Use at least 12 characters"),
    confirmPassword: z.string().min(1, "Confirm the new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "Choose a password you haven't used here before",
    path: ["newPassword"],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeFormSchema>;
