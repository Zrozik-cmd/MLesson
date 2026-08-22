"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  socialLinkFormSchema,
  type SocialLinkFormValues,
} from "@/lib/validation/social-link";

export async function createSocialLink(values: SocialLinkFormValues) {
  await requireAdmin();
  const data = socialLinkFormSchema.parse(values);
  const count = await prisma.socialLink.count();
  await prisma.socialLink.create({ data: { ...data, order: count } });
  revalidatePath("/", "layout");
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/", "layout");
}
