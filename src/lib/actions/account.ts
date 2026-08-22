"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  passwordChangeFormSchema,
  type PasswordChangeFormValues,
} from "@/lib/validation/account";

/**
 * Changes the signed-in admin's password. The current password is re-checked
 * here rather than trusted from the session, so a stolen session alone can't
 * lock the owner out.
 */
export async function changeAdminPassword(values: PasswordChangeFormValues) {
  const session = await requireAdmin();
  const data = passwordChangeFormSchema.parse(values);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Account not found");

  const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isValid) {
    // Surfaced to the form; deliberately says nothing about the stored value.
    throw new Error("Current password is incorrect");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(data.newPassword, 12) },
  });
}
