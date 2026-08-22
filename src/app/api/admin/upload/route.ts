import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { storage } from "@/lib/storage";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

/** Lesson decks run large, so PDFs get a higher ceiling than media. */
const MAX_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_PDF_SIZE_BYTES = 60 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const sizeLimit =
    file.type === "application/pdf" ? MAX_PDF_SIZE_BYTES : MAX_SIZE_BYTES;

  if (file.size > sizeLimit) {
    return NextResponse.json({ error: "File is too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await storage.upload(buffer, file.name);

  return NextResponse.json({ url });
}
