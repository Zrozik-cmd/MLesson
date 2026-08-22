import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonsTable } from "@/components/admin/LessonsTable";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Lessons",
  robots: { index: false, follow: false },
};

export default async function AdminLessonsPage() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Lessons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, publish, and reorder lessons.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/lessons/new">
            <Plus className="size-4" />
            New lesson
          </Link>
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-sm text-muted-foreground">
          No lessons yet.{" "}
          <Link href="/admin/lessons/new" className="text-primary hover:underline">
            Create your first lesson
          </Link>
          .
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <LessonsTable lessons={lessons} />
        </div>
      )}
    </div>
  );
}
