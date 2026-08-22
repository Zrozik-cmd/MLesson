"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { tagFormSchema, type TagFormValues } from "@/lib/validation/tag";

function revalidateTagPaths() {
  revalidatePath("/admin/tags");
  revalidatePath("/[locale]/lessons", "page");
  revalidatePath("/[locale]/tags/[slug]", "page");
}

export async function createTag(values: TagFormValues) {
  await requireAdmin();
  const data = tagFormSchema.parse(values);

  const tag = await prisma.tag.create({
    data: {
      slug: data.slug,
      translations: {
        create: [
          { locale: "EN", name: data.translations.EN.name, description: data.translations.EN.description || null },
          { locale: "RU", name: data.translations.RU.name, description: data.translations.RU.description || null },
          { locale: "UK", name: data.translations.UK.name, description: data.translations.UK.description || null },
        ],
      },
    },
  });

  revalidateTagPaths();
  return { id: tag.id };
}

export async function updateTag(id: string, values: TagFormValues) {
  await requireAdmin();
  const data = tagFormSchema.parse(values);

  await prisma.$transaction([
    prisma.tag.update({ where: { id }, data: { slug: data.slug } }),
    ...(["EN", "RU", "UK"] as const).map((locale) =>
      prisma.tagTranslation.upsert({
        where: { tagId_locale: { tagId: id, locale } },
        create: {
          tagId: id,
          locale,
          name: data.translations[locale].name,
          description: data.translations[locale].description || null,
        },
        update: {
          name: data.translations[locale].name,
          description: data.translations[locale].description || null,
        },
      }),
    ),
  ]);

  revalidateTagPaths();
}

export async function deleteTag(id: string) {
  await requireAdmin();
  await prisma.tag.delete({ where: { id } });
  revalidateTagPaths();
}
