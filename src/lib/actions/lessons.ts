"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  lessonBaseFormSchema,
  lessonTranslationFormSchema,
  linesToArray,
  type LessonBaseFormValues,
  type LessonTranslationFormValues,
} from "@/lib/validation/lesson";
import type { Locale } from "@prisma/client";

function revalidateLessonPaths() {
  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/[locale]/lessons", "page");
  revalidatePath("/[locale]", "page");
}

function toTagConnections(tagIds: string[]) {
  return tagIds.map((tagId) => ({ tagId }));
}

export async function createLesson(
  base: LessonBaseFormValues,
  enTranslation: LessonTranslationFormValues,
) {
  await requireAdmin();
  const baseData = lessonBaseFormSchema.parse(base);
  const translationData = lessonTranslationFormSchema.parse(enTranslation);

  const lesson = await prisma.lesson.create({
    data: {
      slug: baseData.slug,
      level: baseData.level,
      duration: baseData.duration,
      thumbnailUrl: baseData.thumbnailUrl || null,
      videoUrl: baseData.videoUrl || null,
      pdfUrl: baseData.pdfUrl || null,
      isTrial: baseData.isTrial,
      isPublished: baseData.isPublished,
      order: baseData.order,
      tags: { create: toTagConnections(baseData.tagIds) },
      translations: {
        create: {
          locale: "EN",
          slug: translationData.slug || null,
          title: translationData.title,
          shortDescription: translationData.shortDescription,
          description: translationData.description,
          content: translationData.content || null,
          learningOutcomes: linesToArray(translationData.learningOutcomes),
          vocabulary: linesToArray(translationData.vocabulary),
          seoTitle: translationData.seoTitle || null,
          seoDescription: translationData.seoDescription || null,
        },
      },
    },
  });

  revalidateLessonPaths();
  return { id: lesson.id };
}

export async function updateLessonBase(id: string, base: LessonBaseFormValues) {
  await requireAdmin();
  const baseData = lessonBaseFormSchema.parse(base);

  await prisma.$transaction([
    prisma.lessonTag.deleteMany({ where: { lessonId: id } }),
    prisma.lesson.update({
      where: { id },
      data: {
        slug: baseData.slug,
        level: baseData.level,
        duration: baseData.duration,
        thumbnailUrl: baseData.thumbnailUrl || null,
        videoUrl: baseData.videoUrl || null,
        pdfUrl: baseData.pdfUrl || null,
        isTrial: baseData.isTrial,
        isPublished: baseData.isPublished,
        order: baseData.order,
        tags: { create: toTagConnections(baseData.tagIds) },
      },
    }),
  ]);

  revalidateLessonPaths();
}

export async function upsertLessonTranslation(
  lessonId: string,
  locale: Locale,
  values: LessonTranslationFormValues,
) {
  await requireAdmin();
  const data = lessonTranslationFormSchema.parse(values);

  await prisma.lessonTranslation.upsert({
    where: { lessonId_locale: { lessonId, locale } },
    create: {
      lessonId,
      locale,
      slug: data.slug || null,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      content: data.content || null,
      learningOutcomes: linesToArray(data.learningOutcomes),
      vocabulary: linesToArray(data.vocabulary),
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
    update: {
      slug: data.slug || null,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      content: data.content || null,
      learningOutcomes: linesToArray(data.learningOutcomes),
      vocabulary: linesToArray(data.vocabulary),
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });

  revalidateLessonPaths();
}

export async function deleteLessonTranslation(lessonId: string, locale: Locale) {
  await requireAdmin();
  if (locale === "EN") {
    throw new Error("The English translation can't be removed — it's the fallback.");
  }
  await prisma.lessonTranslation
    .delete({ where: { lessonId_locale: { lessonId, locale } } })
    .catch(() => null);
  revalidateLessonPaths();
}

export async function deleteLesson(id: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id } });
  revalidateLessonPaths();
}

export async function setLessonPublished(id: string, isPublished: boolean) {
  await requireAdmin();
  await prisma.lesson.update({ where: { id }, data: { isPublished } });
  revalidateLessonPaths();
}

export async function moveLesson(id: string, direction: "up" | "down") {
  await requireAdmin();
  const lessons = await prisma.lesson.findMany({ orderBy: { order: "asc" } });
  const index = lessons.findIndex((lesson) => lesson.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= lessons.length) return;

  const current = lessons[index];
  const swap = lessons[swapIndex];

  await prisma.$transaction([
    prisma.lesson.update({ where: { id: current.id }, data: { order: swap.order } }),
    prisma.lesson.update({ where: { id: swap.id }, data: { order: current.order } }),
  ]);

  revalidateLessonPaths();
}
