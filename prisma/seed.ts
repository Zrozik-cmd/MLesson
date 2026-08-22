import { PrismaClient, type Prisma, type Locale } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LOCALES = ["EN", "RU", "UK"] as const;

const TAGS = [
  {
    slug: "grammar",
    name: { EN: "Grammar", RU: "Грамматика", UK: "Граматика" },
  },
  {
    slug: "vocabulary",
    name: { EN: "Vocabulary", RU: "Лексика", UK: "Лексика" },
  },
  {
    slug: "speaking",
    name: { EN: "Speaking", RU: "Говорение", UK: "Говоріння" },
  },
  {
    slug: "listening",
    name: { EN: "Listening", RU: "Аудирование", UK: "Аудіювання" },
  },
  {
    slug: "pronunciation",
    name: { EN: "Pronunciation", RU: "Произношение", UK: "Вимова" },
  },
  {
    slug: "business-english",
    name: { EN: "Business English", RU: "Деловой английский", UK: "Бізнес-англійська" },
  },
  {
    slug: "everyday-english",
    name: { EN: "Everyday English", RU: "Повседневный английский", UK: "Повсякденна англійська" },
  },
  {
    slug: "beginner",
    name: { EN: "Beginner", RU: "Начинающий", UK: "Початковий" },
  },
  {
    slug: "intermediate",
    name: { EN: "Intermediate", RU: "Средний", UK: "Середній" },
  },
  {
    slug: "advanced",
    name: { EN: "Advanced", RU: "Продвинутый", UK: "Просунутий" },
  },
] as const;

const LESSONS = [
  {
    slug: "talking-about-yourself",
    level: "BEGINNER" as const,
    duration: 12,
    isTrial: true,
    isPublished: true,
    order: 0,
    tags: ["speaking", "everyday-english", "beginner"],
    translations: {
      EN: {
        title: "Talking About Yourself Without Sounding Rehearsed",
        shortDescription:
          "Move past 'My name is...' and learn to introduce yourself the way native speakers actually do.",
        description:
          "In this lesson we break down the small, natural phrases English speakers use to talk about themselves in real conversations — at work, at a party, or meeting someone new. You'll practice sounding confident and unrehearsed, not like you're reciting a memorized paragraph.",
        learningOutcomes: [
          "Introduce yourself naturally in different social contexts",
          "Use follow-up questions to keep a conversation going",
          "Avoid the 5 most common 'textbook English' mistakes",
        ],
        vocabulary: ["to get into", "what brings you here", "small talk", "to hit it off"],
      },
      RU: {
        title: "Как рассказывать о себе, чтобы это не звучало заученно",
        shortDescription:
          "Забудьте про «My name is...» — научитесь представляться так, как это делают носители языка.",
        description:
          "В этом уроке мы разбираем короткие, естественные фразы, которые носители языка используют, рассказывая о себе в реальных разговорах — на работе, на вечеринке или при знакомстве с новым человеком. Вы научитесь звучать уверенно и естественно, а не так, будто читаете заученный текст.",
        learningOutcomes: [
          "Естественно представляться в разных социальных ситуациях",
          "Задавать уточняющие вопросы, чтобы поддерживать разговор",
          "Избегать 5 самых частых ошибок «учебникового английского»",
        ],
        vocabulary: ["to get into", "what brings you here", "small talk", "to hit it off"],
      },
      UK: {
        title: "Як розповідати про себе, щоб це не звучало заучено",
        shortDescription:
          "Забудьте про \"My name is...\" і навчіться представлятися так, як це роблять носії мови.",
        description:
          "У цьому уроці ми розбираємо короткі, природні фрази, якими носії англійської розповідають про себе в реальних розмовах — на роботі, на вечірці чи під час знайомства з новою людиною. Ви навчитеся звучати впевнено і природно, а не так, ніби переказуєте вивчений напам'ять текст.",
        learningOutcomes: [
          "Природно представлятися в різних соціальних ситуаціях",
          "Використовувати уточнювальні запитання, щоб підтримувати розмову",
          "Уникати 5 найпоширеніших помилок \"підручникової англійської\"",
        ],
        vocabulary: ["to get into", "what brings you here", "small talk", "to hit it off"],
      },
    },
  },
  {
    slug: "everyday-phrasal-verbs",
    level: "ELEMENTARY" as const,
    duration: 15,
    isTrial: true,
    isPublished: true,
    order: 1,
    tags: ["vocabulary", "everyday-english"],
    translations: {
      EN: {
        title: "Everyday Phrasal Verbs You Already Need",
        shortDescription:
          "The phrasal verbs that show up constantly in real conversation — and how to actually remember them.",
        description:
          "Phrasal verbs intimidate most learners because they're taught as long, disconnected lists. Here we take a different approach: a handful of high-frequency phrasal verbs, grouped by the situations you'll actually use them in, with enough repetition to make them stick.",
        learningOutcomes: [
          "Use 10 essential phrasal verbs correctly in context",
          "Recognize phrasal verbs when listening to native speakers",
          "Build your own list using a simple memory technique",
        ],
        vocabulary: ["to figure out", "to catch up", "to look into", "to come up with"],
      },
      RU: {
        title: "Фразовые глаголы, которые вам уже нужны",
        shortDescription:
          "Фразовые глаголы, которые постоянно встречаются в живой речи — и как их наконец запомнить.",
        description:
          "Фразовые глаголы пугают большинство учеников, потому что их обычно преподают как длинные несвязанные списки. Здесь мы действуем иначе: берём несколько самых частых фразовых глаголов, группируем их по реальным ситуациям использования и закрепляем достаточным количеством практики, чтобы они запомнились надолго.",
        learningOutcomes: [
          "Правильно использовать 10 ключевых фразовых глаголов в контексте",
          "Узнавать фразовые глаголы в речи носителей языка",
          "Составлять собственный список с помощью простой техники запоминания",
        ],
        vocabulary: ["to figure out", "to catch up", "to look into", "to come up with"],
      },
      UK: {
        title: "Фразові дієслова, які вам уже потрібні щодня",
        shortDescription:
          "Фразові дієслова, які постійно трапляються в реальних розмовах, — і як їх насправді запам'ятати.",
        description:
          "Фразові дієслова лякають більшість учнів, бо їх подають у вигляді довгих непов'язаних списків. Тут ми обираємо інший підхід: кілька найчастотніших фразових дієслів, згрупованих за ситуаціями, у яких ви дійсно їх використовуватимете, з достатньою кількістю повторень, щоб вони закріпилися.",
        learningOutcomes: [
          "Правильно використовувати 10 ключових фразових дієслів у контексті",
          "Розпізнавати фразові дієслова в мові носіїв на слух",
          "Створити власний список за допомогою простої техніки запам'ятовування",
        ],
        vocabulary: ["to figure out", "to catch up", "to look into", "to come up with"],
      },
    },
  },
  {
    slug: "sounding-natural-on-work-calls",
    level: "INTERMEDIATE" as const,
    duration: 18,
    isTrial: true,
    isPublished: true,
    order: 2,
    tags: ["speaking", "business-english"],
    translations: {
      EN: {
        title: "Sounding Natural on Work Calls",
        shortDescription:
          "The exact phrases for opening, steering, and closing a professional call in English.",
        description:
          "Work calls are one of the most common — and most stressful — situations for English learners. This lesson gives you a simple structure: how to open a call, how to politely interrupt, how to ask for clarification, and how to close things off professionally.",
        learningOutcomes: [
          "Open and close a professional call confidently",
          "Politely interrupt or ask someone to repeat themselves",
          "Sound clear and structured, even when nervous",
        ],
        vocabulary: ["to loop someone in", "to circle back", "just to clarify", "sounds good"],
      },
      RU: {
        title: "Как звучать естественно на рабочих звонках",
        shortDescription:
          "Точные фразы для начала, ведения и завершения делового звонка на английском.",
        description:
          "Рабочие звонки — одна из самых частых и одновременно самых стрессовых ситуаций для тех, кто изучает английский. Этот урок даёт простую структуру: как начать звонок, как вежливо перебить собеседника, как попросить уточнить сказанное и как завершить разговор по-деловому.",
        learningOutcomes: [
          "Уверенно начинать и завершать деловой звонок",
          "Вежливо перебивать или просить повторить сказанное",
          "Звучать чётко и структурировано, даже когда нервничаете",
        ],
        vocabulary: ["to loop someone in", "to circle back", "just to clarify", "sounds good"],
      },
      UK: {
        title: "Як звучати природно на робочих дзвінках",
        shortDescription:
          "Конкретні фрази для того, щоб почати, вести й завершити ділову розмову англійською.",
        description:
          "Робочі дзвінки — одна з найпоширеніших і водночас найстресовіших ситуацій для тих, хто вивчає англійську. Цей урок дає просту структуру: як почати розмову, як ввічливо перервати співрозмовника, як попросити уточнення і як завершити розмову професійно.",
        learningOutcomes: [
          "Впевнено починати і завершувати ділову розмову",
          "Ввічливо перебивати або просити повторити сказане",
          "Звучати чітко і структуровано, навіть коли нервуєте",
        ],
        vocabulary: ["to loop someone in", "to circle back", "just to clarify", "sounds good"],
      },
    },
  },
  {
    slug: "subtle-grammar-mistake",
    level: "UPPER_INTERMEDIATE" as const,
    duration: 14,
    isTrial: true,
    isPublished: true,
    order: 3,
    tags: ["grammar", "intermediate"],
    translations: {
      EN: {
        title: "The Subtle Grammar Mistake Almost Everyone Makes",
        shortDescription:
          "One small grammar pattern that quietly signals 'non-native speaker' — and how to fix it for good.",
        description:
          "This lesson focuses on a single, very common grammar pattern that even advanced learners get wrong without realizing it. We look at real examples, understand why the mistake happens, and practice until the correct version feels automatic.",
        learningOutcomes: [
          "Identify the mistake in your own speech",
          "Understand the grammar logic behind the correct form",
          "Practice with targeted, realistic examples",
        ],
        vocabulary: ["subtle", "to slip up", "to sound off", "second nature"],
      },
      RU: {
        title: "Незаметная грамматическая ошибка, которую делают почти все",
        shortDescription:
          "Одна небольшая грамматическая особенность, которая незаметно выдаёт «не носителя языка» — и как избавиться от неё навсегда.",
        description:
          "Этот урок посвящён одной очень распространённой грамматической конструкции, в которой ошибаются даже продвинутые ученики, даже не замечая этого. Мы разбираем реальные примеры, понимаем, почему возникает ошибка, и практикуемся, пока правильный вариант не станет звучать естественно.",
        learningOutcomes: [
          "Замечать эту ошибку в собственной речи",
          "Понимать грамматическую логику правильной формы",
          "Практиковаться на точных, реалистичных примерах",
        ],
        vocabulary: ["subtle", "to slip up", "to sound off", "second nature"],
      },
      UK: {
        title: "Непомітна граматична помилка, яку робить майже кожен",
        shortDescription:
          "Одна невелика граматична конструкція, яка непомітно виказує \"неносія мови\", — і як назавжди її виправити.",
        description:
          "Цей урок присвячений одній дуже поширеній граматичній конструкції, яку неправильно вживають навіть учні високого рівня, часто навіть не помічаючи цього. Ми розглядаємо реальні приклади, розуміємо, чому виникає ця помилка, і практикуємося, доки правильний варіант не стане автоматичним.",
        learningOutcomes: [
          "Виявляти цю помилку у власному мовленні",
          "Розуміти граматичну логіку правильної форми",
          "Практикуватися на цілеспрямованих, реалістичних прикладах",
        ],
        vocabulary: ["subtle", "to slip up", "to sound off", "second nature"],
      },
    },
  },
  {
    slug: "english-understatement",
    level: "ADVANCED" as const,
    duration: 20,
    isTrial: true,
    isPublished: true,
    order: 4,
    tags: ["listening", "advanced"],
    translations: {
      EN: {
        title: "Reading Between the Lines: English Understatement",
        shortDescription:
          "Why 'not bad' can mean 'amazing' — decoding the indirect way English speakers communicate.",
        description:
          "English speakers, especially in the UK, often say much less than they mean. This lesson explores understatement, politeness strategies, and indirect language — the kind of nuance that textbooks rarely teach but native speakers use constantly.",
        learningOutcomes: [
          "Recognize understatement and indirect criticism",
          "Understand tone shifts in professional and social contexts",
          "Respond appropriately to indirect language",
        ],
        vocabulary: ["not bad", "a bit of a mess", "I suppose", "to put it mildly"],
      },
      RU: {
        title: "Читать между строк: английская недосказанность",
        shortDescription:
          "Почему «not bad» может означать «потрясающе» — разбираемся в непрямой манере общения носителей английского.",
        description:
          "Носители английского, особенно в Великобритании, часто говорят намного меньше, чем имеют в виду. В этом уроке мы разбираем недосказанность, стратегии вежливости и непрямую речь — те тонкости, которые редко объясняют в учебниках, но которыми носители языка пользуются постоянно.",
        learningOutcomes: [
          "Распознавать недосказанность и непрямую критику",
          "Понимать смену тона в деловом и повседневном общении",
          "Уместно реагировать на непрямую речь",
        ],
        vocabulary: ["not bad", "a bit of a mess", "I suppose", "to put it mildly"],
      },
      UK: {
        title: "Читання між рядків: применшення в англійській мові",
        shortDescription:
          "Чому \"not bad\" може означати \"чудово\" — розшифровуємо непряму манеру спілкування англійців.",
        description:
          "Носії англійської, особливо у Великій Британії, часто кажуть значно менше, ніж мають на увазі. Цей урок досліджує применшення, стратегії ввічливості та непряму мову — ті нюанси, яких майже не вчать у підручниках, але які носії мови використовують постійно.",
        learningOutcomes: [
          "Розпізнавати применшення та непряму критику",
          "Розуміти зміни тону в професійному й соціальному спілкуванні",
          "Доречно реагувати на непряму мову",
        ],
        vocabulary: ["not bad", "a bit of a mess", "I suppose", "to put it mildly"],
      },
    },
  },
  {
    slug: "narrative-tenses-in-practice",
    level: "INTERMEDIATE" as const,
    duration: 16,
    isTrial: false,
    isPublished: true,
    order: 5,
    tags: ["grammar", "speaking"],
    translations: {
      EN: {
        title: "Building a Story: Narrative Tenses in Practice",
        shortDescription:
          "Past simple, past continuous, and past perfect — working together the way real stories use them.",
        description:
          "Narrative tenses are usually taught as isolated grammar rules. In this lesson, we put them back together — practicing how English speakers naturally combine past simple, past continuous, and past perfect to tell a clear, engaging story.",
        learningOutcomes: [
          "Combine narrative tenses naturally when telling a story",
          "Avoid the most common tense-mixing mistakes",
          "Add detail and sequence to make stories more vivid",
        ],
        vocabulary: ["meanwhile", "by the time", "as soon as", "eventually"],
      },
      RU: {
        title: "Строим историю: повествовательные времена на практике",
        shortDescription:
          "Past Simple, Past Continuous и Past Perfect — как они работают вместе в реальных историях.",
        description:
          "Повествовательные времена обычно преподают как отдельные, не связанные друг с другом правила. В этом уроке мы собираем их обратно — практикуем, как носители языка естественно сочетают Past Simple, Past Continuous и Past Perfect, чтобы рассказать понятную и увлекательную историю.",
        learningOutcomes: [
          "Естественно сочетать повествовательные времена в рассказе",
          "Избегать самых частых ошибок при смешивании времён",
          "Добавлять детали и последовательность, чтобы истории звучали живее",
        ],
        vocabulary: ["meanwhile", "by the time", "as soon as", "eventually"],
      },
      UK: {
        title: "Побудова розповіді: розповідні часи на практиці",
        shortDescription:
          "Past Simple, Past Continuous і Past Perfect — як вони працюють разом у справжніх розповідях.",
        description:
          "Розповідні часи зазвичай вивчають як окремі граматичні правила. У цьому уроці ми знову складаємо їх разом — практикуємо, як носії англійської природно поєднують Past Simple, Past Continuous і Past Perfect, щоб розповісти зрозумілу й захопливу історію.",
        learningOutcomes: [
          "Природно поєднувати розповідні часи під час розповіді",
          "Уникати найпоширеніших помилок при змішуванні часів",
          "Додавати деталі й послідовність, щоб розповідь звучала яскравіше",
        ],
        vocabulary: ["meanwhile", "by the time", "as soon as", "eventually"],
      },
    },
  },
];

const FAQS = [
  {
    EN: {
      question: "How do the lessons work?",
      answer:
        "Each trial lesson is a short, focused video with a clear goal — no filler. You watch it here on the site, for free, with no sign-up required. If you'd like to continue with the full course, you move into a private Telegram channel.",
    },
    RU: {
      question: "Как проходят уроки?",
      answer:
        "Каждый пробный урок — это короткое, сфокусированное видео с чёткой целью, без лишнего. Вы смотрите его прямо на сайте, бесплатно и без регистрации. Если захотите продолжить с полным курсом, вы переходите в закрытый канал в Telegram.",
    },
    UK: {
      question: "Як проходять уроки?",
      answer:
        "Кожен пробний урок — це коротке, чітко сфокусоване відео з конкретною метою, без зайвого. Ви дивитеся його прямо на сайті, безкоштовно і без реєстрації. Якщо захочете продовжити повний курс, ви переходите до приватного каналу в Telegram.",
    },
  },
  {
    EN: {
      question: "What level is this suitable for?",
      answer:
        "M Lesson works with learners from confident beginners to advanced speakers refining nuance. Every lesson is labeled with its level, so you can start exactly where you are.",
    },
    RU: {
      question: "Для какого уровня это подходит?",
      answer:
        "M Lesson работает с учениками разных уровней — от уверенных начинающих до продвинутых, отрабатывающих тонкости языка. У каждого урока указан уровень, так что вы можете начать именно с того места, где находитесь.",
    },
    UK: {
      question: "Для якого рівня це підходить?",
      answer:
        "M Lesson працює з учнями від впевнених початківців до досвідчених мовців, які вдосконалюють нюанси. Кожен урок позначено рівнем, тож ви можете почати саме з того місця, де перебуваєте.",
    },
  },
  {
    EN: {
      question: "Can I start from zero?",
      answer:
        "Absolutely. If you're just starting out, message directly in Telegram and we'll figure out the right starting point together before booking anything.",
    },
    RU: {
      question: "Могу ли я начать с нуля?",
      answer:
        "Конечно. Если вы только начинаете, напишите напрямую в Telegram — мы вместе определим подходящую точку старта, прежде чем что-либо бронировать.",
    },
    UK: {
      question: "Чи можу я почати з нуля?",
      answer:
        "Звісно. Якщо ви лише починаєте, напишіть безпосередньо в Telegram, і ми разом визначимо правильну точку старту, перш ніж щось бронювати.",
    },
  },
  {
    EN: {
      question: "Where do the lessons take place?",
      answer:
        "Trial lessons are pre-recorded videos on this site. The full course continues with live lessons and structured practice, coordinated through Telegram.",
    },
    RU: {
      question: "Где проходят занятия?",
      answer:
        "Пробные уроки — это записанные видео на этом сайте. Полный курс продолжается живыми занятиями и структурированной практикой, которые координируются через Telegram.",
    },
    UK: {
      question: "Де проходять уроки?",
      answer:
        "Пробні уроки — це попередньо записані відео на цьому сайті. Повний курс продовжується живими уроками та структурованою практикою, узгодженими через Telegram.",
    },
  },
  {
    EN: {
      question: "How do I get access to the full course?",
      answer:
        "Tap any 'Continue in Telegram' button on the site. You'll be connected directly to discuss your goals, level, and the best way to start.",
    },
    RU: {
      question: "Как получить доступ к полному курсу?",
      answer:
        "Нажмите любую кнопку «Продолжить в Telegram» на сайте. Вы напрямую свяжетесь со мной, чтобы обсудить ваши цели, уровень и оптимальный способ начать.",
    },
    UK: {
      question: "Як отримати доступ до повного курсу?",
      answer:
        "Натисніть будь-яку кнопку \"Продовжити в Telegram\" на сайті. Ви одразу зв'яжетеся напряму, щоб обговорити свої цілі, рівень і найкращий спосіб почати.",
    },
  },
  {
    EN: {
      question: "How do I purchase the full course?",
      answer:
        "Course details and payment are handled directly in Telegram — this keeps things personal and lets us tailor the plan to you before anything is booked.",
    },
    RU: {
      question: "Как оплатить полный курс?",
      answer:
        "Все детали курса и оплата обсуждаются напрямую в Telegram — это позволяет сохранить персональный подход и подобрать план именно для вас, прежде чем что-либо будет забронировано.",
    },
    UK: {
      question: "Як придбати повний курс?",
      answer:
        "Деталі курсу та оплата узгоджуються безпосередньо в Telegram — це дозволяє зберегти персональний підхід і підібрати план саме для вас, перш ніж щось бронювати.",
    },
  },
];

const SITE_SETTINGS_TRANSLATIONS: Record<
  (typeof LOCALES)[number],
  {
    heroEyebrow: string;
    heroHeadline: string;
    heroDescription: string;
    heroCtaText: string;
    heroSecondaryCtaText: string;
    authorBio: string;
    authorShortBio: string;
    authorExperience: string;
    authorMetrics: { label: string; value: string }[];
    siteDescription: string;
  }
> = {
  EN: {
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
  RU: {
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
  UK: {
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
};

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@mlesson.school";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-me-please";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin", passwordHash },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  const tagIdBySlug = new Map<string, string>();
  for (const tag of TAGS) {
    const existing = await prisma.tag.findUnique({ where: { slug: tag.slug } });
    const record = existing
      ? await prisma.tag.update({ where: { id: existing.id }, data: {} })
      : await prisma.tag.create({ data: { slug: tag.slug } });
    tagIdBySlug.set(tag.slug, record.id);

    for (const locale of LOCALES) {
      await prisma.tagTranslation.upsert({
        where: { tagId_locale: { tagId: record.id, locale } },
        create: { tagId: record.id, locale, name: tag.name[locale] },
        update: { name: tag.name[locale] },
      });
    }
  }
  console.log(`Seeded ${TAGS.length} tags`);

  for (const lesson of LESSONS) {
    const record = await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: {
        level: lesson.level,
        duration: lesson.duration,
        isTrial: lesson.isTrial,
        isPublished: lesson.isPublished,
        order: lesson.order,
      },
      create: {
        slug: lesson.slug,
        level: lesson.level,
        duration: lesson.duration,
        isTrial: lesson.isTrial,
        isPublished: lesson.isPublished,
        order: lesson.order,
      },
    });

    for (const locale of LOCALES) {
      const t = lesson.translations[locale];
      await prisma.lessonTranslation.upsert({
        where: { lessonId_locale: { lessonId: record.id, locale } },
        create: {
          lessonId: record.id,
          locale,
          title: t.title,
          shortDescription: t.shortDescription,
          description: t.description,
          learningOutcomes: t.learningOutcomes,
          vocabulary: t.vocabulary,
        },
        update: {
          title: t.title,
          shortDescription: t.shortDescription,
          description: t.description,
          learningOutcomes: t.learningOutcomes,
          vocabulary: t.vocabulary,
        },
      });
    }

    await prisma.lessonTag.deleteMany({ where: { lessonId: record.id } });
    for (const tagSlug of lesson.tags) {
      const tagId = tagIdBySlug.get(tagSlug);
      if (tagId) {
        await prisma.lessonTag.create({ data: { lessonId: record.id, tagId } });
      }
    }
  }
  console.log(`Seeded ${LESSONS.length} lessons with translations and tags`);

  for (const faq of FAQS) {
    const existing = await prisma.faq.findFirst({
      where: { translations: { some: { locale: "EN", question: faq.EN.question } } },
    });
    const count = await prisma.faq.count();
    const record = existing ?? (await prisma.faq.create({ data: { order: count } }));

    for (const locale of LOCALES) {
      await prisma.faqTranslation.upsert({
        where: { faqId_locale: { faqId: record.id, locale } },
        create: {
          faqId: record.id,
          locale,
          question: faq[locale].question,
          answer: faq[locale].answer,
        },
        update: { question: faq[locale].question, answer: faq[locale].answer },
      });
    }
  }
  console.log(`Seeded ${FAQS.length} FAQ entries with translations`);

  const existingSettings = await prisma.siteSettings.findFirst();
  const settings =
    existingSettings ??
    (await prisma.siteSettings.create({
      data: {
        authorName: "Anna Marchenko",
        telegramUrl: "https://t.me/mlesson_placeholder",
        siteName: "M Lesson",
      },
    }));
  if (!existingSettings) console.log("Created default site settings");

  for (const locale of LOCALES) {
    const t = SITE_SETTINGS_TRANSLATIONS[locale];
    const authorMetrics = t.authorMetrics as unknown as Prisma.InputJsonValue;
    await prisma.siteSettingsTranslation.upsert({
      where: { siteSettingsId_locale: { siteSettingsId: settings.id, locale } },
      create: { siteSettingsId: settings.id, locale, ...t, authorMetrics },
      update: { ...t, authorMetrics },
    });
  }
  console.log("Seeded site settings translations (EN/RU/UK)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
