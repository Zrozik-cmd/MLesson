"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  siteSettingsBaseFormSchema,
  siteSettingsTranslationFormSchema,
  type SiteSettingsBaseFormValues,
  type SiteSettingsTranslationFormValues,
} from "@/lib/validation/settings";
import type { Locale, Prisma } from "@prisma/client";

async function getOrCreateSiteSettings() {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) return existing;
  return prisma.siteSettings.create({ data: {} });
}

export async function updateSiteSettingsBase(values: SiteSettingsBaseFormValues) {
  await requireAdmin();
  const data = siteSettingsBaseFormSchema.parse(values);
  const settings = await getOrCreateSiteSettings();

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data: {
      authorName: data.authorName,
      authorPhotoUrl: data.authorPhotoUrl || null,
      telegramUrl: data.telegramUrl,
      siteName: data.siteName,
    },
  });

  revalidatePath("/", "layout");
}

export async function upsertSiteSettingsTranslation(
  locale: Locale,
  values: SiteSettingsTranslationFormValues,
) {
  await requireAdmin();
  const data = siteSettingsTranslationFormSchema.parse(values);
  const settings = await getOrCreateSiteSettings();
  const authorMetrics = data.authorMetrics as unknown as Prisma.InputJsonValue;

  await prisma.siteSettingsTranslation.upsert({
    where: { siteSettingsId_locale: { siteSettingsId: settings.id, locale } },
    create: { siteSettingsId: settings.id, locale, ...data, authorMetrics },
    update: { ...data, authorMetrics },
  });

  revalidatePath("/", "layout");
}
