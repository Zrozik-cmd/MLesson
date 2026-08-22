import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagsTable } from "@/components/admin/TagsTable";
import { TagFormDialog } from "@/components/admin/TagFormDialog";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tags",
  robots: { index: false, follow: false },
};

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Tags</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Topics lessons can be tagged with — used for filtering and tag landing pages.
          </p>
        </div>
        <TagFormDialog
          trigger={
            <Button>
              <Plus className="size-4" />
              New tag
            </Button>
          }
        />
      </div>

      {tags.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-sm text-muted-foreground">
          No tags yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <TagsTable tags={tags} />
        </div>
      )}
    </div>
  );
}
