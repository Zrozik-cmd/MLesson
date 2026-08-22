import type { Metadata } from "next";
import { NewLessonForm } from "@/components/admin/NewLessonForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "New Lesson",
  robots: { index: false, follow: false },
};

export default async function NewLessonPage() {
  const [count, tags] = await Promise.all([
    prisma.lesson.count(),
    prisma.tag.findMany({
      orderBy: { createdAt: "asc" },
      include: { translations: { where: { locale: "EN" } } },
    }),
  ]);

  const tagOptions = tags.map((tag) => ({
    id: tag.id,
    name: tag.translations[0]?.name ?? tag.slug,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">New lesson</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below and publish when ready.
        </p>
      </div>
      <NewLessonForm defaultOrder={count} tags={tagOptions} />
    </div>
  );
}
