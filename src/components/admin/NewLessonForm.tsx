"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VideoUploader } from "@/components/admin/VideoUploader";
import { PdfUploader } from "@/components/admin/PdfUploader";
import { TagMultiSelect, type TagOption } from "@/components/admin/TagMultiSelect";
import {
  lessonBaseFormSchema,
  lessonLevelValues,
  lessonTranslationFormSchema,
  type LessonBaseFormValues,
  type LessonTranslationFormValues,
} from "@/lib/validation/lesson";
import { ADMIN_LEVEL_LABELS } from "@/lib/lessons";
import { createLesson } from "@/lib/actions/lessons";
import { z } from "zod";

const newLessonSchema = z.object({
  ...lessonTranslationFormSchema.shape,
  ...lessonBaseFormSchema.shape,
});
type NewLessonValues = z.infer<typeof newLessonSchema>;

export function NewLessonForm({
  defaultOrder,
  tags,
}: {
  defaultOrder: number;
  tags: TagOption[];
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewLessonValues>({
    resolver: zodResolver(newLessonSchema),
    defaultValues: {
      slug: "",
      level: "BEGINNER",
      duration: 10,
      thumbnailUrl: "",
      videoUrl: "",
      pdfUrl: "",
      isTrial: true,
      isPublished: false,
      order: defaultOrder,
      tagIds: [],
      title: "",
      shortDescription: "",
      description: "",
      content: "",
      learningOutcomes: "",
      vocabulary: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const title = watch("title");

  const onTitleChange = (value: string) => {
    setValue("title", value);
    if (!slugTouched) {
      setValue("slug", slugify(value, { lower: true, strict: true }));
    }
  };

  const onSubmit = async (values: NewLessonValues) => {
    try {
      const base: LessonBaseFormValues = {
        slug: values.slug,
        level: values.level,
        duration: values.duration,
        thumbnailUrl: values.thumbnailUrl,
        videoUrl: values.videoUrl,
        pdfUrl: values.pdfUrl,
        isTrial: values.isTrial,
        isPublished: values.isPublished,
        order: values.order,
        tagIds: values.tagIds,
      };
      const translation: LessonTranslationFormValues = {
        title: values.title,
        shortDescription: values.shortDescription,
        description: values.description,
        content: values.content,
        learningOutcomes: values.learningOutcomes,
        vocabulary: values.vocabulary,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
      };
      const result = await createLesson(base, translation);
      toast.success("Lesson created — add Russian and Ukrainian translations below.");
      router.push(`/admin/lessons/${result.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-12">
      <p className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
        Create the lesson with its English content first. You&rsquo;ll be able to
        add Russian and Ukrainian translations right after.
      </p>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Basic information</h2>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title (English)</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>

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
          <p className="text-xs text-muted-foreground">
            Shared across locales unless a translation sets its own override.
          </p>
          {errors.slug ? (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Level</Label>
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lessonLevelValues.map((level) => (
                      <SelectItem key={level} value={level}>
                        {ADMIN_LEVEL_LABELS[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", { valueAsNumber: true })}
            />
            {errors.duration ? (
              <p className="text-xs text-destructive">{errors.duration.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
          {errors.shortDescription ? (
            <p className="text-xs text-destructive">{errors.shortDescription.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label>Tags</Label>
          <Controller
            control={control}
            name="tagIds"
            render={({ field }) => (
              <TagMultiSelect tags={tags} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Media</h2>

        <div className="space-y-1.5">
          <Label>Thumbnail</Label>
          <Controller
            control={control}
            name="thumbnailUrl"
            render={({ field }) => (
              <ImageUploader value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Lesson PDF</Label>
          <Controller
            control={control}
            name="pdfUrl"
            render={({ field }) => (
              <PdfUploader value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Video (optional)</Label>
          <Controller
            control={control}
            name="videoUrl"
            render={({ field }) => (
              <VideoUploader value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Content</h2>

        <div className="space-y-1.5">
          <Label htmlFor="learningOutcomes">Learning outcomes</Label>
          <Textarea id="learningOutcomes" rows={4} {...register("learningOutcomes")} />
          <p className="text-xs text-muted-foreground">One outcome per line.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="vocabulary">Useful vocabulary</Label>
          <Textarea id="vocabulary" rows={3} {...register("vocabulary")} />
          <p className="text-xs text-muted-foreground">One word or phrase per line.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Notes</Label>
          <Textarea id="content" rows={5} {...register("content")} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">SEO</h2>

        <div className="space-y-1.5">
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seoDescription">SEO description</Label>
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Publishing</h2>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="isTrial"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Trial lesson</Label>
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="isPublished"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Published</Label>
        </div>

        <div className="max-w-32 space-y-1.5">
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create lesson"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/lessons")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
