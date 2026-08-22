"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  siteSettingsBaseFormSchema,
  type SiteSettingsBaseFormValues,
} from "@/lib/validation/settings";
import { updateSiteSettingsBase } from "@/lib/actions/settings";

export function SettingsBaseForm({
  defaultValues,
}: {
  defaultValues: SiteSettingsBaseFormValues;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsBaseFormValues>({
    resolver: zodResolver(siteSettingsBaseFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: SiteSettingsBaseFormValues) => {
    try {
      await updateSiteSettingsBase(values);
      toast.success("Settings saved");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="siteName">Site name</Label>
        <Input id="siteName" {...register("siteName")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="authorName">Author name</Label>
        <Input id="authorName" {...register("authorName")} />
      </div>

      <div className="space-y-1.5">
        <Label>Author photo</Label>
        <Controller
          control={control}
          name="authorPhotoUrl"
          render={({ field }) => (
            <ImageUploader value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="telegramUrl">Telegram URL</Label>
        <Input id="telegramUrl" {...register("telegramUrl")} />
        {errors.telegramUrl ? (
          <p className="text-xs text-destructive">{errors.telegramUrl.message}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          All &ldquo;Continue in Telegram&rdquo; buttons redirect here, in every language.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
