import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LessonBaseForm } from "@/components/admin/LessonBaseForm";
import { LessonTranslationForm } from "@/components/admin/LessonTranslationForm";
import { TranslationStatusBadge } from "@/components/admin/TranslationStatusBadge";
import { localeValues } from "@/lib/validation/lesson";
import type { TagOption } from "@/components/admin/TagMultiSelect";
import type { Lesson, LessonTranslation } from "@prisma/client";

export function LessonEditor({
  lesson,
  translations,
  tags,
  selectedTagIds,
}: {
  lesson: Lesson;
  translations: LessonTranslation[];
  tags: TagOption[];
  selectedTagIds: string[];
}) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-lg">Lesson settings</h2>
        <LessonBaseForm lesson={lesson} tags={tags} selectedTagIds={selectedTagIds} />
      </section>

      <section className="max-w-3xl space-y-4 border-t border-border pt-10">
        <h2 className="font-display text-lg">Translations</h2>
        <Tabs defaultValue="EN">
          <TabsList>
            {localeValues.map((locale) => {
              const translation = translations.find((t) => t.locale === locale);
              return (
                <TabsTrigger key={locale} value={locale} className="gap-1.5">
                  <TranslationStatusBadge
                    locale={locale}
                    translated={Boolean(translation)}
                  />
                </TabsTrigger>
              );
            })}
          </TabsList>

          {localeValues.map((locale) => (
            <TabsContent key={locale} value={locale} className="pt-6">
              <LessonTranslationForm
                lessonId={lesson.id}
                locale={locale}
                translation={translations.find((t) => t.locale === locale)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
