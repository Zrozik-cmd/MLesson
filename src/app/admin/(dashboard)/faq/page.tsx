import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqTable } from "@/components/admin/FaqTable";
import { FaqFormDialog } from "@/components/admin/FaqFormDialog";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "FAQ",
  robots: { index: false, follow: false },
};

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">FAQ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the questions shown on the public FAQ page.
          </p>
        </div>
        <FaqFormDialog
          trigger={
            <Button>
              <Plus className="size-4" />
              Add question
            </Button>
          }
        />
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-sm text-muted-foreground">
          No questions yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <FaqTable faqs={faqs} />
        </div>
      )}
    </div>
  );
}
