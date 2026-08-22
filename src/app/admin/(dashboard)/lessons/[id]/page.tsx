import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonEditor } from "@/components/admin/LessonEditor";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Lesson",
  robots: { index: false, follow: false },
};

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lesson, tags] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id },
      include: {
        translations: true,
        tags: { select: { tagId: true } },
      },
    }),
    prisma.tag.findMany({
      orderBy: { createdAt: "asc" },
      include: { translations: { where: { locale: "EN" } } },
    }),
  ]);
  if (!lesson) notFound();

  const tagOptions = tags.map((tag) => ({
    id: tag.id,
    name: tag.translations[0]?.name ?? tag.slug,
  }));

  const enTitle =
    lesson.translations.find((t) => t.locale === "EN")?.title ?? lesson.slug;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Edit lesson</h1>
        <p className="mt-1 text-sm text-muted-foreground">{enTitle}</p>
      </div>
      <LessonEditor
        lesson={lesson}
        translations={lesson.translations}
        tags={tagOptions}
        selectedTagIds={lesson.tags.map((t) => t.tagId)}
      />
    </div>
  );
}
