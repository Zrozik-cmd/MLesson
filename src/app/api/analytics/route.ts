import { NextResponse } from "next/server";
import { z } from "zod";
import { recordEvent } from "@/lib/analytics";

const bodySchema = z.object({
  type: z.enum(["PAGE_VIEW", "LESSON_VIEW", "TELEGRAM_CLICK"]),
  source: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await recordEvent(parsed.data.type, parsed.data.source, parsed.data.metadata);
  return NextResponse.json({ ok: true });
}
