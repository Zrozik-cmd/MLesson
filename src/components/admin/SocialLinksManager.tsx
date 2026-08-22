"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  socialLinkFormSchema,
  type SocialLinkFormValues,
} from "@/lib/validation/social-link";
import { createSocialLink, deleteSocialLink } from "@/lib/actions/social-links";
import type { SocialLink } from "@prisma/client";

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkFormValues>({ resolver: zodResolver(socialLinkFormSchema) });

  const onSubmit = async (values: SocialLinkFormValues) => {
    try {
      await createSocialLink(values);
      reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteSocialLink(id);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold">Social links</h2>

      {links.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {links.map((link) => (
            <li key={link.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.url}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={deletingId === link.id}
                onClick={() => handleDelete(link.id)}
                aria-label="Remove link"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-2">
        <div>
          <Input placeholder="Label (e.g. Instagram)" {...register("label")} className="max-w-44" />
          {errors.label ? (
            <p className="mt-1 text-xs text-destructive">{errors.label.message}</p>
          ) : null}
        </div>
        <div>
          <Input placeholder="https://..." {...register("url")} className="max-w-64" />
          {errors.url ? (
            <p className="mt-1 text-xs text-destructive">{errors.url.message}</p>
          ) : null}
        </div>
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </form>
    </section>
  );
}
