-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'RU', 'UK');

-- CreateTable
CREATE TABLE "LessonTranslation" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "learningOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vocabulary" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagTranslation" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonTag" (
    "lessonId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LessonTag_pkey" PRIMARY KEY ("lessonId","tagId")
);

-- CreateTable
CREATE TABLE "SiteSettingsTranslation" (
    "id" TEXT NOT NULL,
    "siteSettingsId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "heroEyebrow" TEXT NOT NULL DEFAULT '',
    "heroHeadline" TEXT NOT NULL DEFAULT '',
    "heroDescription" TEXT NOT NULL DEFAULT '',
    "heroCtaText" TEXT NOT NULL DEFAULT '',
    "heroSecondaryCtaText" TEXT NOT NULL DEFAULT '',
    "authorBio" TEXT NOT NULL DEFAULT '',
    "authorShortBio" TEXT NOT NULL DEFAULT '',
    "authorExperience" TEXT NOT NULL DEFAULT '',
    "authorMetrics" JSONB,
    "siteDescription" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettingsTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonTranslation_lessonId_locale_key" ON "LessonTranslation"("lessonId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "LessonTranslation_locale_slug_key" ON "LessonTranslation"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TagTranslation_tagId_locale_key" ON "TagTranslation"("tagId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TagTranslation_locale_slug_key" ON "TagTranslation"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettingsTranslation_siteSettingsId_locale_key" ON "SiteSettingsTranslation"("siteSettingsId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "FaqTranslation_faqId_locale_key" ON "FaqTranslation"("faqId", "locale");

-- AddForeignKey
ALTER TABLE "LessonTranslation" ADD CONSTRAINT "LessonTranslation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTranslation" ADD CONSTRAINT "TagTranslation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTag" ADD CONSTRAINT "LessonTag_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTag" ADD CONSTRAINT "LessonTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsTranslation" ADD CONSTRAINT "SiteSettingsTranslation_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqTranslation" ADD CONSTRAINT "FaqTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "Faq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: copy existing flat content into EN translation rows before
-- dropping the old columns, so existing lessons/FAQ/settings survive.
INSERT INTO "LessonTranslation" ("id", "lessonId", "locale", "title", "shortDescription", "description", "content", "learningOutcomes", "vocabulary", "seoTitle", "seoDescription", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'EN', "title", "shortDescription", "description", "content", "learningOutcomes", "vocabulary", "seoTitle", "seoDescription", now(), now()
FROM "Lesson";

INSERT INTO "FaqTranslation" ("id", "faqId", "locale", "question", "answer", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'EN', "question", "answer", now(), now()
FROM "Faq";

INSERT INTO "SiteSettingsTranslation" ("id", "siteSettingsId", "locale", "heroEyebrow", "heroHeadline", "heroDescription", "heroCtaText", "heroSecondaryCtaText", "authorBio", "authorShortBio", "authorExperience", "authorMetrics", "siteDescription", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'EN', "heroEyebrow", "heroHeadline", "heroDescription", "heroCtaText", "heroSecondaryCtaText", "authorBio", "authorShortBio", "authorExperience", "authorMetrics", "siteDescription", now()
FROM "SiteSettings";

-- AlterTable
ALTER TABLE "Faq" DROP COLUMN "answer",
DROP COLUMN "question";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "content",
DROP COLUMN "description",
DROP COLUMN "learningOutcomes",
DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle",
DROP COLUMN "shortDescription",
DROP COLUMN "title",
DROP COLUMN "vocabulary";

-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "authorBio",
DROP COLUMN "authorExperience",
DROP COLUMN "authorMetrics",
DROP COLUMN "authorShortBio",
DROP COLUMN "heroCtaText",
DROP COLUMN "heroDescription",
DROP COLUMN "heroEyebrow",
DROP COLUMN "heroHeadline",
DROP COLUMN "heroSecondaryCtaText",
DROP COLUMN "siteDescription";
