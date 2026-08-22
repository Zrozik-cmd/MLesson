"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Lesson decks are delivered as PDFs — upload one or paste a hosted link. */
export function PdfUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange(json.url);
      toast.success("PDF uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fileName = value ? decodeURIComponent(value.split("/").pop() ?? value) : "";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Upload a PDF or paste a link"
          className="max-w-sm"
        />
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-3.5" />
          {uploading ? "Uploading…" : "Upload PDF"}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <X className="size-3.5" />
            Remove
          </Button>
        ) : null}
      </div>

      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-xs text-primary underline underline-offset-2"
        >
          <FileText className="size-3.5" />
          {fileName}
        </a>
      ) : (
        <p className="text-xs text-muted-foreground">
          The lesson page shows this PDF inline, with open and download actions.
          Up to 60&nbsp;MB.
        </p>
      )}
    </div>
  );
}
