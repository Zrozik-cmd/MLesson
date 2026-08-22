"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { faqFormSchema, type FaqFormValues } from "@/lib/validation/faq";
import { createFaq, updateFaq } from "@/lib/actions/faq";
import type { Faq, FaqTranslation } from "@prisma/client";

const LOCALES = ["EN", "RU", "UK"] as const;
const LOCALE_LABELS: Record<(typeof LOCALES)[number], string> = {
  EN: "English",
  RU: "Russian",
  UK: "Ukrainian",
};

function emptyTranslations() {
  return {
    EN: { question: "", answer: "" },
    RU: { question: "", answer: "" },
    UK: { question: "", answer: "" },
  };
}

export function FaqFormDialog({
  faq,
  trigger,
}: {
  faq?: Faq & { translations: FaqTranslation[] };
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const defaultTranslations = faq
    ? {
        EN: {
          question: faq.translations.find((t) => t.locale === "EN")?.question ?? "",
          answer: faq.translations.find((t) => t.locale === "EN")?.answer ?? "",
        },
        RU: {
          question: faq.translations.find((t) => t.locale === "RU")?.question ?? "",
          answer: faq.translations.find((t) => t.locale === "RU")?.answer ?? "",
        },
        UK: {
          question: faq.translations.find((t) => t.locale === "UK")?.question ?? "",
          answer: faq.translations.find((t) => t.locale === "UK")?.answer ?? "",
        },
      }
    : emptyTranslations();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: { isPublished: faq?.isPublished ?? true, translations: defaultTranslations },
  });

  const isPublished = watch("isPublished");

  const onSubmit = async (values: FaqFormValues) => {
    try {
      if (faq) {
        await updateFaq(faq.id, values);
        toast.success("Question updated");
      } else {
        await createFaq(values);
        toast.success("Question added");
        reset();
      }
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{faq ? "Edit question" : "Add question"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {LOCALES.map((locale) => (
            <div key={locale} className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {LOCALE_LABELS[locale]}
              </p>
              <div className="space-y-1.5">
                <Label htmlFor={`question-${locale}`}>Question</Label>
                <Input id={`question-${locale}`} {...register(`translations.${locale}.question`)} />
                {errors.translations?.[locale]?.question ? (
                  <p className="text-xs text-destructive">
                    {errors.translations[locale]?.question?.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`answer-${locale}`}>Answer</Label>
                <Textarea id={`answer-${locale}`} rows={3} {...register(`translations.${locale}.answer`)} />
                {errors.translations?.[locale]?.answer ? (
                  <p className="text-xs text-destructive">
                    {errors.translations[locale]?.answer?.message}
                  </p>
                ) : null}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <Switch
              checked={isPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
            <Label>Published</Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
