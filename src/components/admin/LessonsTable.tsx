"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TranslationStatusBadge } from "@/components/admin/TranslationStatusBadge";
import { ADMIN_LEVEL_LABELS } from "@/lib/lessons";
import { localeValues } from "@/lib/validation/lesson";
import { deleteLesson, moveLesson, setLessonPublished } from "@/lib/actions/lessons";
import type { Lesson, LessonTranslation } from "@prisma/client";

type LessonRow = Lesson & { translations: LessonTranslation[] };

function titleFor(lesson: LessonRow) {
  return (
    lesson.translations.find((t) => t.locale === "EN")?.title ??
    lesson.translations[0]?.title ??
    lesson.slug
  );
}

export function LessonsTable({ lessons }: { lessons: LessonRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const withPending = async (id: string, fn: () => Promise<void>) => {
    setPendingId(id);
    try {
      await fn();
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Order</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Translations</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lessons.map((lesson, index) => (
          <TableRow key={lesson.id}>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === 0 || pendingId === lesson.id}
                  onClick={() =>
                    withPending(lesson.id, () => moveLesson(lesson.id, "up"))
                  }
                  aria-label="Move up"
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === lessons.length - 1 || pendingId === lesson.id}
                  onClick={() =>
                    withPending(lesson.id, () => moveLesson(lesson.id, "down"))
                  }
                  aria-label="Move down"
                >
                  <ArrowDown className="size-3.5" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <Link
                href={`/admin/lessons/${lesson.id}`}
                className="font-medium hover:text-primary"
              >
                {titleFor(lesson)}
              </Link>
              <p className="text-xs text-muted-foreground">/{lesson.slug}</p>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {ADMIN_LEVEL_LABELS[lesson.level]}
            </TableCell>
            <TableCell>
              <div className="flex gap-3">
                {localeValues.map((locale) => (
                  <TranslationStatusBadge
                    key={locale}
                    locale={locale}
                    translated={lesson.translations.some((t) => t.locale === locale)}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={lesson.isPublished}
                  disabled={pendingId === lesson.id}
                  onCheckedChange={(checked) =>
                    withPending(lesson.id, () => setLessonPublished(lesson.id, checked))
                  }
                  aria-label="Toggle published"
                />
                <StatusBadge isPublished={lesson.isPublished} />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon-sm" asChild>
                  <Link href={`/admin/lessons/${lesson.id}`} aria-label="Edit lesson">
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Delete lesson">
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title="Delete this lesson?"
                  description={`"${titleFor(lesson)}" will be permanently removed. This can't be undone.`}
                  confirmLabel="Delete"
                  onConfirm={() =>
                    withPending(lesson.id, () => deleteLesson(lesson.id))
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
