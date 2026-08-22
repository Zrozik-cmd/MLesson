import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics";
import { getSiteSettings } from "@/lib/settings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") ?? "unknown";

  await recordEvent("TELEGRAM_CLICK", source);

  // telegramUrl is a base (non-localized) field, so the locale passed here doesn't matter.
  const settings = await getSiteSettings("EN");
  return NextResponse.redirect(settings.telegramUrl, { status: 302 });
}
