import { execFile } from "child_process";
import { mkdir, readdir, rm } from "fs/promises";
import path from "path";
import { promisify } from "util";

const run = promisify(execFile);

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/** Wide enough for a full-screen slide on a laptop, small enough to scroll. */
const RENDER_DPI = "110";

/** Bumped when the render settings change, so old pages get redone. */
export const PAGES_DIR_SUFFIX = "-pages-q92";

/**
 * Renders every page of an uploaded PDF to a JPEG next to it, and returns the
 * public URLs in page order.
 *
 * Slides-as-images are the only way the deck reads properly on iOS, where
 * Safari's PDF embed renders the first page and refuses to scroll.
 *
 * Returns an empty array — never throws — when the PDF isn't a local upload
 * or when pdftoppm isn't on the box, so saving a lesson can't fail over this.
 */
export async function renderPdfPages(pdfUrl: string | null | undefined) {
  if (!pdfUrl?.startsWith("/uploads/")) return [];

  const fileName = path.basename(pdfUrl);
  if (!fileName.toLowerCase().endsWith(".pdf")) return [];

  const source = path.join(UPLOADS_DIR, fileName);
  const slug = fileName.replace(/\.pdf$/i, "");
  const outDir = path.join(UPLOADS_DIR, `${slug}${PAGES_DIR_SUFFIX}`);

  try {
    // Start clean so a re-upload can't leave stale pages behind.
    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });

    await run("pdftoppm", [
      "-jpeg",
      "-jpegopt",
      "quality=92",
      "-r",
      RENDER_DPI,
      source,
      path.join(outDir, "page"),
    ]);

    const files = (await readdir(outDir))
      .filter((name) => name.endsWith(".jpg"))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

    return files.map((name) => `/uploads/${slug}${PAGES_DIR_SUFFIX}/${name}`);
  } catch (error) {
    console.warn("Could not render PDF pages:", error);
    return [];
  }
}
