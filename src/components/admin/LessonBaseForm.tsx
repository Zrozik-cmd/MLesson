"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
  type LessonBaseFormValues,
} from "@/lib/validation/lesson";
import { ADMIN_LEVEL_LABELS } from "@/lib/lessons";
import { updateLessonBase } from "@/lib/actions/lessons";
import type { Lesson } from "@prisma/client";

export function LessonBaseForm({
  lesson,
  tags,
  selectedTagIds,
}: {
  lesson: Lesson;
  tags: TagOption[];
  selectedTagIds: string[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LessonBaseFormValues>({
    resolver: zodResolver(lessonBaseFormSchema),
    defaultValues: {
      slug: lesson.slug,
      level: lesson.level,
      duration: lesson.duration,
      thumbnailUrl: lesson.thumbnailUrl ?? "",
      videoUrl: lesson.videoUrl ?? "",
      pdfUrl: lesson.pdfUrl ?? "",
      isTrial: lesson.isTrial,
      isPublished: lesson.isPublished,
      order: lesson.order,
      tagIds: selectedTagIds,
    },
  });

  const onSubmit = async (values: LessonBaseFormValues) => {
    try {
      await updateLessonBase(lesson.id, values);
      toast.success("Lesson settings saved");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <div className="space-y-1.5">
        <Label htmlFor="slug">Default slug</Label>
        <Input id="slug" {...register("slug")} />
        <p className="text-xs text-muted-foreground">
          Used for every locale unless a translation sets its own override.
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
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tagIds"
          render={({ field }) => (
            <TagMultiSelect tags={tags} value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

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
        {errors.pdfUrl ? (
          <p className="text-xs text-destructive">{errors.pdfUrl.message}</p>
        ) : null}
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

      <div className="border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save lesson settings"}
        </Button>
      </div>
    </form>
  );
}
