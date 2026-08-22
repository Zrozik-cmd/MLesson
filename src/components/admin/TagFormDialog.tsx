"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";
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
import { tagFormSchema, type TagFormValues } from "@/lib/validation/tag";
import { createTag, updateTag } from "@/lib/actions/tags";
import type { Tag, TagTranslation } from "@prisma/client";

const LOCALES = ["EN", "RU", "UK"] as const;
const LOCALE_LABELS: Record<(typeof LOCALES)[number], string> = {
  EN: "English",
  RU: "Russian",
  UK: "Ukrainian",
};

function emptyTranslations() {
  return { EN: { name: "", description: "" }, RU: { name: "", description: "" }, UK: { name: "", description: "" } };
}

export function TagFormDialog({
  tag,
  trigger,
}: {
  tag?: Tag & { translations: TagTranslation[] };
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(tag));

  const defaultTranslations = tag
    ? {
        EN: {
          name: tag.translations.find((t) => t.locale === "EN")?.name ?? "",
          description: tag.translations.find((t) => t.locale === "EN")?.description ?? "",
        },
        RU: {
          name: tag.translations.find((t) => t.locale === "RU")?.name ?? "",
          description: tag.translations.find((t) => t.locale === "RU")?.description ?? "",
        },
        UK: {
          name: tag.translations.find((t) => t.locale === "UK")?.name ?? "",
          description: tag.translations.find((t) => t.locale === "UK")?.description ?? "",
        },
      }
    : emptyTranslations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: { slug: tag?.slug ?? "", translations: defaultTranslations },
  });

  const enName = watch("translations.EN.name");

  const onSubmit = async (values: TagFormValues) => {
    try {
      if (tag) {
        await updateTag(tag.id, values);
        toast.success("Tag updated");
      } else {
        await createTag(values);
        toast.success("Tag created");
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
          <DialogTitle>{tag ? "Edit tag" : "New tag"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register("slug")}
              onChange={(event) => {
                setSlugTouched(true);
                setValue("slug", event.target.value);
              }}
            />
            {errors.slug ? (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            ) : null}
          </div>

          {LOCALES.map((locale) => (
            <div key={locale} className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {LOCALE_LABELS[locale]}
              </p>
              <div className="space-y-1.5">
                <Label htmlFor={`name-${locale}`}>Name</Label>
                <Input
                  id={`name-${locale}`}
                  {...register(`translations.${locale}.name`)}
                  onChange={(event) => {
                    setValue(`translations.${locale}.name`, event.target.value);
                    if (locale === "EN" && !slugTouched) {
                      setValue("slug", slugify(event.target.value, { lower: true, strict: true }));
                    }
                  }}
                />
                {errors.translations?.[locale]?.name ? (
                  <p className="text-xs text-destructive">
                    {errors.translations[locale]?.name?.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`description-${locale}`}>
                  Description <span className="text-muted-foreground">(optional, for tag landing page)</span>
                </Label>
                <Textarea
                  id={`description-${locale}`}
                  rows={2}
                  {...register(`translations.${locale}.description`)}
                />
              </div>
            </div>
          ))}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !enName}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
