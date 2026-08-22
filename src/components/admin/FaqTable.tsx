"use client";

import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FaqFormDialog } from "@/components/admin/FaqFormDialog";
import { TranslationStatusBadge } from "@/components/admin/TranslationStatusBadge";
import { localeValues } from "@/lib/validation/lesson";
import { deleteFaq, moveFaq } from "@/lib/actions/faq";
import type { Faq, FaqTranslation } from "@prisma/client";

type FaqRow = Faq & { translations: FaqTranslation[] };

function questionFor(faq: FaqRow) {
  return (
    faq.translations.find((t) => t.locale === "EN")?.question ??
    faq.translations[0]?.question ??
    "(untitled)"
  );
}

function answerFor(faq: FaqRow) {
  return (
    faq.translations.find((t) => t.locale === "EN")?.answer ??
    faq.translations[0]?.answer ??
    ""
  );
}

export function FaqTable({ faqs }: { faqs: FaqRow[] }) {
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
          <TableHead>Question</TableHead>
          <TableHead>Translations</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faqs.map((faq, index) => (
          <TableRow key={faq.id}>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === 0 || pendingId === faq.id}
                  onClick={() => withPending(faq.id, () => moveFaq(faq.id, "up"))}
                  aria-label="Move up"
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === faqs.length - 1 || pendingId === faq.id}
                  onClick={() => withPending(faq.id, () => moveFaq(faq.id, "down"))}
                  aria-label="Move down"
                >
                  <ArrowDown className="size-3.5" />
                </Button>
              </div>
            </TableCell>
            <TableCell className="max-w-md">
              <p className="font-medium">{questionFor(faq)}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {answerFor(faq)}
              </p>
            </TableCell>
            <TableCell>
              <div className="flex gap-3">
                {localeValues.map((locale) => (
                  <TranslationStatusBadge
                    key={locale}
                    locale={locale}
                    translated={faq.translations.some((t) => t.locale === locale)}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge isPublished={faq.isPublished} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <FaqFormDialog
                  faq={faq}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Edit question">
                      <Pencil className="size-3.5" />
                    </Button>
                  }
                />
                <ConfirmDialog
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Delete question">
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title="Delete this question?"
                  description="This FAQ entry will be permanently removed."
                  confirmLabel="Delete"
                  onConfirm={() => withPending(faq.id, () => deleteFaq(faq.id))}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
