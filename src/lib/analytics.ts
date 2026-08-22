import { prisma } from "@/lib/prisma";
import type { AnalyticsEventType, Prisma } from "@prisma/client";

export async function recordEvent(
  type: AnalyticsEventType,
  source?: string | null,
  metadata?: Record<string, unknown>,
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type,
        source: source ?? null,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.warn(
      "[analytics] failed to record event:",
      error instanceof Error ? error.message : error,
    );
  }
}
