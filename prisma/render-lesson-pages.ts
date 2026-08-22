/**
 * Makes sure every lesson deck has its page images on disk.
 *
 * Rendering can't be done from the Railway console: that runs in a separate
 * container, so the files land somewhere the web process will never see —
 * the database ends up pointing at images that 404. Running this at boot
 * puts them on the mounted volume instead.
 *
 * Cheap when there's nothing to do, so it's safe on every start.
 *
 *   npm run db:pages
 */
import { access } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { renderPdfPages } from "../src/lib/pdf";

const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(process.cwd(), "public");

async function exists(publicUrl: string) {
  try {
    await access(path.join(PUBLIC_DIR, publicUrl.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: { pdfUrl: { not: null } },
    select: { id: true, slug: true, pdfUrl: true, pdfPages: true },
  });

  let rendered = 0;

  for (const lesson of lessons) {
    if (!lesson.pdfUrl) continue;

    // Nothing to do when the recorded pages are actually on disk.
    const first = lesson.pdfPages[0];
    if (first && (await exists(first))) continue;

    if (!(await exists(lesson.pdfUrl))) {
      console.warn(`Skipping ${lesson.slug}: ${lesson.pdfUrl} is missing`);
      continue;
    }

    const pages = await renderPdfPages(lesson.pdfUrl);
    if (pages.length === 0) {
      console.warn(`Skipping ${lesson.slug}: could not render pages`);
      continue;
    }

    await prisma.lesson.update({ where: { id: lesson.id }, data: { pdfPages: pages } });
    console.log(`Rendered ${pages.length} pages for ${lesson.slug}`);
    rendered += 1;
  }

  console.log(rendered === 0 ? "Lesson pages already in place." : "Lesson pages ready.");
}

main().finally(() => prisma.$disconnect());
