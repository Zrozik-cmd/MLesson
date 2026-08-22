"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TagFormDialog } from "@/components/admin/TagFormDialog";
import { deleteTag } from "@/lib/actions/tags";
import type { Tag, TagTranslation } from "@prisma/client";

type TagWithTranslations = Tag & { translations: TagTranslation[] };

function nameFor(tag: TagWithTranslations, locale: "EN" | "RU" | "UK") {
  return tag.translations.find((t) => t.locale === locale)?.name ?? "—";
}

export function TagsTable({ tags }: { tags: TagWithTranslations[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setPendingId(id);
    try {
      await deleteTag(id);
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
          <TableHead>Slug</TableHead>
          <TableHead>EN</TableHead>
          <TableHead>RU</TableHead>
          <TableHead>UK</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell className="text-sm text-muted-foreground">/{tag.slug}</TableCell>
            <TableCell>{nameFor(tag, "EN")}</TableCell>
            <TableCell>{nameFor(tag, "RU")}</TableCell>
            <TableCell>{nameFor(tag, "UK")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <TagFormDialog
                  tag={tag}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Edit tag">
                      <Pencil className="size-3.5" />
                    </Button>
                  }
                />
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={pendingId === tag.id}
                      aria-label="Delete tag"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title="Delete this tag?"
                  description={`"${nameFor(tag, "EN")}" will be removed from all lessons that use it.`}
                  confirmLabel="Delete"
                  onConfirm={() => handleDelete(tag.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
