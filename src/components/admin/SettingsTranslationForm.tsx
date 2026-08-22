"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  siteSettingsTranslationFormSchema,
  type SiteSettingsTranslationFormValues,
} from "@/lib/validation/settings";
import { upsertSiteSettingsTranslation } from "@/lib/actions/settings";
import type { Locale } from "@prisma/client";

export function SettingsTranslationForm({
  locale,
  defaultValues,
}: {
  locale: Locale;
  defaultValues: SiteSettingsTranslationFormValues;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsTranslationFormValues>({
    resolver: zodResolver(siteSettingsTranslationFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "authorMetrics" });

  const onSubmit = async (values: SiteSettingsTranslationFormValues) => {
    try {
      await upsertSiteSettingsTranslation(locale, values);
      toast.success(`${locale} content saved`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <section className="space-y-4">
        <h3 className="text-base">Hero</h3>

        <div className="space-y-1.5">
          <Label htmlFor={`heroEyebrow-${locale}`}>Eyebrow</Label>
          <Input id={`heroEyebrow-${locale}`} {...register("heroEyebrow")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`heroHeadline-${locale}`}>Headline</Label>
          <Textarea id={`heroHeadline-${locale}`} rows={2} {...register("heroHeadline")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`heroDescription-${locale}`}>Description</Label>
          <Textarea id={`heroDescription-${locale}`} rows={3} {...register("heroDescription")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor={`heroCtaText-${locale}`}>Primary CTA text</Label>
            <Input id={`heroCtaText-${locale}`} {...register("heroCtaText")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`heroSecondaryCtaText-${locale}`}>Secondary CTA text</Label>
            <Input id={`heroSecondaryCtaText-${locale}`} {...register("heroSecondaryCtaText")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base">Author</h3>

        <div className="space-y-1.5">
          <Label htmlFor={`authorShortBio-${locale}`}>Short bio</Label>
          <Textarea id={`authorShortBio-${locale}`} rows={2} {...register("authorShortBio")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`authorBio-${locale}`}>Full biography</Label>
          <Textarea id={`authorBio-${locale}`} rows={5} {...register("authorBio")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`authorExperience-${locale}`}>Experience</Label>
          <Textarea id={`authorExperience-${locale}`} rows={3} {...register("authorExperience")} />
        </div>

        <div className="space-y-2">
          <Label>Credibility metrics</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="Value (e.g. 5+)"
                {...register(`authorMetrics.${index}.value`)}
                className="max-w-32"
              />
              <Input
                placeholder="Label"
                {...register(`authorMetrics.${index}.label`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
                aria-label="Remove metric"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
          {fields.length < 6 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: "", value: "" })}
            >
              <Plus className="size-3.5" />
              Add metric
            </Button>
          ) : null}
        </div>
      </section>

      <section className="space-y-1.5">
        <Label htmlFor={`siteDescription-${locale}`}>Site description</Label>
        <Textarea id={`siteDescription-${locale}`} rows={2} {...register("siteDescription")} />
        <p className="text-xs text-muted-foreground">Used for SEO and social sharing.</p>
      </section>

      {Object.keys(errors).length > 0 ? (
        <p className="text-xs text-destructive">Please fill in all required fields.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : `Save ${locale} content`}
      </Button>
    </form>
  );
}
