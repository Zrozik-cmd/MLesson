import type { LessonLevel } from "@prisma/client";

/** Admin UI is English-only (see spec §56) — public pages use next-intl. */
export const ADMIN_LEVEL_LABELS: Record<LessonLevel, string> = {
  BEGINNER: "Beginner",
  ELEMENTARY: "Elementary",
  INTERMEDIATE: "Intermediate",
  UPPER_INTERMEDIATE: "Upper-Intermediate",
  ADVANCED: "Advanced",
};

export function formatLessonNumber(order: number) {
  return String(order + 1).padStart(2, "0");
}
