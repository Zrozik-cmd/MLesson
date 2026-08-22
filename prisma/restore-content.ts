/**
 * Restores the real site content on a fresh database: the author's settings
 * in all three locales, and lesson A1.01 including its PDF deck.
 *
 * The deck and its cover ship in prisma/assets and are copied into
 * public/uploads at run time — that path is a mounted volume in production,
 * so files baked into the image at the same path can't be relied on.
 *
 * Safe to run more than once.
 *
 *   npm run db:restore
 */
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { PrismaClient, type Locale } from "@prisma/client";
import { renderPdfPages } from "../src/lib/pdf";

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ASSETS_DIR = path.join(process.cwd(), "prisma", "assets");

const ASSETS = [
  { from: "a1-my-first-day-in-a-new-city.pdf", to: "a1-my-first-day-in-a-new-city.pdf" },
  {
    from: "a1-my-first-day-in-a-new-city-cover.jpg",
    to: "a1-my-first-day-in-a-new-city-cover.jpg",
  },
];

const AUTHOR = {
  authorName: "Mariia Okopna",
  authorPhotoUrl: "https://i.ibb.co/j9NBLXTh/photo-2026-04-01-21-08-07.jpg",
  telegramUrl: "https://t.me/MariaOkopna",
  siteName: "M Lesson",
};

const SETTINGS_TRANSLATIONS = [
  {
    locale: "EN" as Locale,
    heroEyebrow: "ENGLISH / M LESSON",
    heroHeadline: "English that becomes part of your everyday life.",
    heroDescription:
      "A boutique approach to learning English — built around real conversation, careful structure, and steady progress you can actually feel.",
    heroCtaText: "Watch the trial lessons",
    heroSecondaryCtaText: "Continue in Telegram",
    authorBio:
      "I've spent the last several years helping adults build real, usable English — not textbook English. My students come to me tired of memorizing rules that never turn into conversation. We work differently: less grammar theory, more language you'll actually reach for.",
    authorShortBio:
      "I teach English the way I wish it had been taught to me — practical, structured, and free of unnecessary complexity.",
    authorExperience:
      "Certified English teacher (CELTA) with a background in linguistics, working with adult learners across levels — from confident beginners to advanced speakers refining nuance.",
    authorMetrics: [
      { label: "Years teaching", value: "5+" },
      { label: "Students guided", value: "1,000+" },
      { label: "Hours of practice", value: "10,000+" },
    ],
    siteDescription:
      "A premium, personal approach to learning English — trial lessons, real conversation practice, and a path to fluency without unnecessary complexity.",
  },
  {
    locale: "RU" as Locale,
    heroEyebrow: "АНГЛИЙСКИЙ / M LESSON",
    heroHeadline: "Английский, который становится частью вашей повседневной жизни.",
    heroDescription:
      "Бутиковый подход к изучению английского — построенный на живом общении, выверенной структуре и ощутимом, стабильном прогрессе.",
    heroCtaText: "Смотреть пробные уроки",
    heroSecondaryCtaText: "Продолжить в Telegram",
    authorBio:
      "Последние несколько лет я помогаю взрослым людям формировать живой, работающий английский — а не «учебниковый». Ко мне приходят те, кто устал заучивать правила, которые никогда не превращаются в речь. Мы работаем иначе: меньше грамматической теории, больше языка, который вы будете действительно использовать.",
    authorShortBio:
      "Я преподаю английский так, как мне самому хотелось бы, чтобы его преподавали — практично, структурно и без лишней сложности.",
    authorExperience:
      "Сертифицированный преподаватель английского (CELTA) с лингвистическим образованием, работаю со взрослыми учениками разных уровней — от уверенных начинающих до продвинутых, работающих над тонкостями языка.",
    authorMetrics: [
      { label: "Лет преподавания", value: "5+" },
      { label: "Учеников", value: "1,000+" },
      { label: "Часов практики", value: "10,000+" },
    ],
    siteDescription:
      "Премиальный, личный подход к изучению английского — пробные уроки, живая разговорная практика и путь к свободному владению языком без лишней сложности.",
  },
  {
    locale: "UK" as Locale,
    heroEyebrow: "АНГЛІЙСЬКА / M LESSON",
    heroHeadline: "Англійська, яка стає частиною вашого щоденного життя.",
    heroDescription:
      "Бутиковий підхід до вивчення англійської — на основі справжнього спілкування, вивіреної структури та стабільного прогресу, який відчувається насправді.",
    heroCtaText: "Переглянути пробні уроки",
    heroSecondaryCtaText: "Продовжити в Telegram",
    authorBio:
      "Останні кілька років я допомагаю дорослим формувати справжню, практичну англійську — а не підручникову. До мене приходять учні, які втомилися заучувати правила, що ніколи не перетворюються на розмову. Ми працюємо інакше: менше граматичної теорії, більше мови, яку ви дійсно використовуватимете.",
    authorShortBio:
      "Я викладаю англійську так, як мені хотілося б, щоб її викладали, — практично, структуровано і без зайвої складності.",
    authorExperience:
      "Сертифікований викладач англійської (CELTA) з лінгвістичною освітою, працює з дорослими учнями всіх рівнів — від впевнених початківців до досвідчених мовців, які вдосконалюють нюанси.",
    authorMetrics: [
      { label: "Років викладання", value: "5+" },
      { label: "Учнів навчено", value: "1,000+" },
      { label: "Годин практики", value: "10,000+" },
    ],
    siteDescription:
      "Преміальний, персональний підхід до вивчення англійської — пробні уроки, практика справжнього спілкування та шлях до вільного володіння мовою без зайвої складності.",
  },
];

const LESSON_SLUG = "my-first-day-in-a-new-city";
const LESSON_TAGS = ["beginner", "vocabulary", "grammar", "speaking"];

const VOCABULARY = [
  "city",
  "street",
  "square",
  "station",
  "café",
  "restaurant",
  "supermarket",
  "pharmacy",
  "hotel",
  "museum",
  "park",
  "shop",
  "bus stop",
  "bank",
  "near",
  "far",
  "busy",
  "quiet",
  "beautiful",
  "expensive",
];

const LESSON_TRANSLATIONS = [
  {
    locale: "EN" as Locale,
    title: "My First Day in a New City",
    shortDescription:
      "A1.01 — the words and grammar you need on day one in an unfamiliar city: naming the places around you and saying what is there.",
    description:
      "You wake up in a city you don't know. You don't know anyone, you don't know the streets — and you still need a coffee, a pharmacy and the way back to your hotel. This first M Lesson gives you exactly the English that moment asks for. We build the vocabulary of everyday city places, then add there is / there are so you can describe what's around you and ask for what you need. You read Emma's first day in Prague, practise the questions a newcomer really asks, and finish by describing a city of your own.",
    content:
      'Homework — "Design your city"\n\nWrite 8–10 sentences about a city you invent. Your city must have: a hotel, a café, a restaurant, a park, a museum, a supermarket, a pharmacy and a station.\n\nUse there is for one thing and there are for two or more. Add near, far, busy, quiet, beautiful and expensive to describe them.\n\nThen finish the grammar exercise at the end of the deck: choose there is / there are and is there / are there for each sentence.',
    learningOutcomes: [
      "Name the everyday places in a city — café, pharmacy, station, square and the rest",
      "Use there is and there are correctly for one thing and for many",
      "Ask for directions and information: Where is…? Is there… near here?",
      "Describe a place with near, far, busy, quiet, beautiful and expensive",
      "Read a short first-person text and answer true / false questions",
    ],
    seoTitle: "My First Day in a New City — A1 English lesson",
    seoDescription:
      "A1.01 M Lesson: city vocabulary, there is / there are, and the questions you need on your first day somewhere new.",
  },
  {
    locale: "RU" as Locale,
    title: "Мой первый день в новом городе",
    shortDescription:
      "A1.01 — слова и грамматика, которые нужны в первый день в незнакомом городе: как назвать места вокруг и сказать, что где находится.",
    description:
      "Вы просыпаетесь в городе, которого не знаете. Вокруг ни одного знакомого, улицы незнакомые — а кофе, аптека и дорога до отеля нужны прямо сейчас. Первый урок M Lesson даёт именно тот английский, который нужен в этот момент. Сначала разбираем лексику городских мест, затем добавляем конструкцию there is / there are, чтобы описывать, что вокруг, и спрашивать то, что нужно. Вы прочитаете о первом дне Эммы в Праге, потренируете вопросы, которые действительно задаёт приезжий, и в конце опишете свой собственный город.",
    content:
      "Домашнее задание — «Придумайте свой город»\n\nНапишите 8–10 предложений о городе, который вы придумали. В нём должны быть: отель, кафе, ресторан, парк, музей, супермаркет, аптека и вокзал.\n\nИспользуйте there is для одного объекта и there are для двух и более. Добавьте near, far, busy, quiet, beautiful и expensive, чтобы их описать.\n\nПотом выполните грамматическое упражнение в конце презентации: выберите there is / there are и is there / are there для каждого предложения.",
    learningOutcomes: [
      "Называть повседневные места в городе — кафе, аптеку, вокзал, площадь и другие",
      "Правильно использовать there is и there are для одного объекта и для нескольких",
      "Спрашивать дорогу и информацию: Where is…? Is there… near here?",
      "Описывать место словами near, far, busy, quiet, beautiful и expensive",
      "Читать короткий текст от первого лица и отвечать на вопросы true / false",
    ],
    seoTitle: "Мой первый день в новом городе — урок английского A1",
    seoDescription:
      "A1.01 M Lesson: лексика города, конструкция there is / there are и вопросы, нужные в первый день на новом месте.",
  },
  {
    locale: "UK" as Locale,
    title: "Мій перший день у новому місті",
    shortDescription:
      "A1.01 — слова й граматика, потрібні першого дня в незнайомому місті: як назвати місця навколо та сказати, що де є.",
    description:
      "Ви прокидаєтеся в місті, якого не знаєте. Навколо жодного знайомого, вулиці незнайомі — а кава, аптека й дорога до готелю потрібні вже зараз. Перший урок M Lesson дає саме ту англійську, якої вимагає цей момент. Спершу розбираємо лексику міських місць, далі додаємо конструкцію there is / there are, щоб описувати, що навколо, і питати те, що потрібно. Ви прочитаєте про перший день Емми у Празі, потренуєте питання, які справді ставить приїжджий, і наприкінці опишете власне місто.",
    content:
      "Домашнє завдання — «Придумайте своє місто»\n\nНапишіть 8–10 речень про місто, яке ви вигадали. У ньому мають бути: готель, кафе, ресторан, парк, музей, супермаркет, аптека й вокзал.\n\nВикористовуйте there is для одного об'єкта і there are для двох і більше. Додайте near, far, busy, quiet, beautiful та expensive, щоб їх описати.\n\nПотім виконайте граматичну вправу наприкінці презентації: оберіть there is / there are та is there / are there для кожного речення.",
    learningOutcomes: [
      "Називати повсякденні місця в місті — кафе, аптеку, вокзал, площу та інші",
      "Правильно вживати there is і there are для одного об'єкта і для кількох",
      "Питати дорогу та інформацію: Where is…? Is there… near here?",
      "Описувати місце словами near, far, busy, quiet, beautiful і expensive",
      "Читати короткий текст від першої особи й відповідати на питання true / false",
    ],
    seoTitle: "Мій перший день у новому місті — урок англійської A1",
    seoDescription:
      "A1.01 M Lesson: лексика міста, конструкція there is / there are і питання, потрібні першого дня на новому місці.",
  },
];

async function copyAssets() {
  await mkdir(UPLOADS_DIR, { recursive: true });
  for (const asset of ASSETS) {
    await copyFile(path.join(ASSETS_DIR, asset.from), path.join(UPLOADS_DIR, asset.to));
    console.log(`Copied ${asset.to} into public/uploads`);
  }
}

async function restoreSettings() {
  const existing = await prisma.siteSettings.findFirst();
  const settings = existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data: AUTHOR })
    : await prisma.siteSettings.create({ data: AUTHOR });

  for (const t of SETTINGS_TRANSLATIONS) {
    const { locale, ...data } = t;
    await prisma.siteSettingsTranslation.upsert({
      where: { siteSettingsId_locale: { siteSettingsId: settings.id, locale } },
      update: data,
      create: { siteSettingsId: settings.id, locale, ...data },
    });
  }
  console.log("Site settings restored (EN/RU/UK)");
}

async function restoreLesson() {
  const tags = await prisma.tag.findMany({ where: { slug: { in: LESSON_TAGS } } });
  const existing = await prisma.lesson.findUnique({ where: { slug: LESSON_SLUG } });

  // Only push the seeded demo lessons down the first time, so re-running
  // doesn't keep shifting them.
  if (!existing) {
    await prisma.lesson.updateMany({ data: { order: { increment: 1 } } });
  }

  const pdfUrl = `/uploads/${ASSETS[0].to}`;
  const base = {
    level: "BEGINNER" as const,
    duration: 60,
    thumbnailUrl: `/uploads/${ASSETS[1].to}`,
    pdfUrl,
    pdfPages: await renderPdfPages(pdfUrl),
    isTrial: true,
    isPublished: true,
    order: 0,
  };

  const lesson = await prisma.lesson.upsert({
    where: { slug: LESSON_SLUG },
    update: base,
    create: { slug: LESSON_SLUG, ...base },
  });

  await prisma.lessonTag.deleteMany({ where: { lessonId: lesson.id } });
  await prisma.lessonTag.createMany({
    data: tags.map((tag) => ({ lessonId: lesson.id, tagId: tag.id })),
  });

  for (const t of LESSON_TRANSLATIONS) {
    const { locale, ...copy } = t;
    const data = { ...copy, vocabulary: VOCABULARY };
    await prisma.lessonTranslation.upsert({
      where: { lessonId_locale: { lessonId: lesson.id, locale } },
      update: data,
      create: { lessonId: lesson.id, locale, ...data },
    });
  }

  console.log(`Lesson restored: ${LESSON_SLUG} (${tags.length} tags, EN/RU/UK)`);
}

async function main() {
  await copyAssets();
  await restoreSettings();
  await restoreLesson();
  console.log("\nDone.");
}

main().finally(() => prisma.$disconnect());
