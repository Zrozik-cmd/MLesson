"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { faqFormSchema, type FaqFormValues } from "@/lib/validation/faq";

function revalidateFaqPaths() {
  revalidatePath("/admin/faq");
  revalidatePath("/[locale]/faq", "page");
}

export async function createFaq(values: FaqFormValues) {
  await requireAdmin();
  const data = faqFormSchema.parse(values);
  const count = await prisma.faq.count();

  await prisma.faq.create({
    data: {
      order: count,
      isPublished: data.isPublished,
      translations: {
        create: (["EN", "RU", "UK"] as const).map((locale) => ({
          locale,
          question: data.translations[locale].question,
          answer: data.translations[locale].answer,
        })),
      },
    },
  });

  revalidateFaqPaths();
}

export async function updateFaq(id: string, values: FaqFormValues) {
  await requireAdmin();
  const data = faqFormSchema.parse(values);

  await prisma.$transaction([
    prisma.faq.update({ where: { id }, data: { isPublished: data.isPublished } }),
    ...(["EN", "RU", "UK"] as const).map((locale) =>
      prisma.faqTranslation.upsert({
        where: { faqId_locale: { faqId: id, locale } },
        create: {
          faqId: id,
          locale,
          question: data.translations[locale].question,
          answer: data.translations[locale].answer,
        },
        update: {
          question: data.translations[locale].question,
          answer: data.translations[locale].answer,
        },
      }),
    ),
  ]);

  revalidateFaqPaths();
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidateFaqPaths();
}

export async function moveFaq(id: string, direction: "up" | "down") {
  await requireAdmin();
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  const index = faqs.findIndex((faq) => faq.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= faqs.length) return;

  const current = faqs[index];
  const swap = faqs[swapIndex];

  await prisma.$transaction([
    prisma.faq.update({ where: { id: current.id }, data: { order: swap.order } }),
    prisma.faq.update({ where: { id: swap.id }, data: { order: current.order } }),
  ]);

  revalidateFaqPaths();
}
