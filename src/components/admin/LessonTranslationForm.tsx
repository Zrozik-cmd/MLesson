"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  lessonTranslationFormSchema,
  type LessonTranslationFormValues,
} from "@/lib/validation/lesson";
import { upsertLessonTranslation, deleteLessonTranslation } from "@/lib/actions/lessons";
import type { Locale, LessonTranslation } from "@prisma/client";

export function LessonTranslationForm({
  lessonId,
  locale,
  translation,
}: {
  lessonId: string;
  locale: Locale;
  translation: LessonTranslation | undefined;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LessonTranslationFormValues>({
    resolver: zodResolver(lessonTranslationFormSchema),
    defaultValues: {
      slug: translation?.slug ?? "",
      title: translation?.title ?? "",
      shortDescription: translation?.shortDescription ?? "",
      description: translation?.description ?? "",
      content: translation?.content ?? "",
      learningOutcomes: translation?.learningOutcomes.join("\n") ?? "",
      vocabulary: translation?.vocabulary.join("\n") ?? "",
      seoTitle: translation?.seoTitle ?? "",
      seoDescription: translation?.seoDescription ?? "",
    },
  });

  const onSubmit = async (values: LessonTranslationFormValues) => {
    try {
      await upsertLessonTranslation(lessonId, locale, values);
      toast.success(`${locale} translation saved`);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleRemove = async () => {
    try {
      await deleteLessonTranslation(lessonId, locale);
      toast.success(`${locale} translation removed`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor={`title-${locale}`}>Title</Label>
        <Input id={`title-${locale}`} {...register("title")} />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`slug-${locale}`}>
          Slug override <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input id={`slug-${locale}`} {...register("slug")} />
        <p className="text-xs text-muted-foreground">
          Leave blank to use the lesson&rsquo;s default slug for this locale.
        </p>
        {errors.slug ? (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`shortDescription-${locale}`}>Short description</Label>
        <Textarea id={`shortDescription-${locale}`} rows={2} {...register("shortDescription")} />
        {errors.shortDescription ? (
          <p className="text-xs text-destructive">{errors.shortDescription.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`description-${locale}`}>Description</Label>
        <Textarea id={`description-${locale}`} rows={4} {...register("description")} />
        {errors.description ? (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`learningOutcomes-${locale}`}>Learning outcomes</Label>
        <Textarea id={`learningOutcomes-${locale}`} rows={4} {...register("learningOutcomes")} />
        <p className="text-xs text-muted-foreground">One outcome per line.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`vocabulary-${locale}`}>Useful vocabulary</Label>
        <Textarea id={`vocabulary-${locale}`} rows={3} {...register("vocabulary")} />
        <p className="text-xs text-muted-foreground">
          One word or phrase per line — usually left in English, since it&rsquo;s the
          vocabulary being taught.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`content-${locale}`}>Notes</Label>
        <Textarea id={`content-${locale}`} rows={5} {...register("content")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`seoTitle-${locale}`}>SEO title</Label>
        <Input id={`seoTitle-${locale}`} {...register("seoTitle")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`seoDescription-${locale}`}>SEO description</Label>
        <Textarea id={`seoDescription-${locale}`} rows={2} {...register("seoDescription")} />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : `Save ${locale} translation`}
        </Button>
        {locale !== "EN" && translation ? (
          <Button type="button" variant="outline" onClick={handleRemove}>
            Remove translation
          </Button>
        ) : null}
      </div>
    </form>
  );
}
