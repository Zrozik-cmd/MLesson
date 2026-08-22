import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TelegramCta } from "@/components/site/TelegramCta";
import { MobileNav } from "@/components/site/MobileNav";
import { Container } from "@/components/site/Container";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { LogoMark } from "@/components/site/LogoMark";

export async function Header({ siteName }: { siteName: string }) {
  const t = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tHeader = await getTranslations("header");

  const navLinks = [
    { href: "/lessons", label: t("lessons") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/10 bg-cream">
      <Container className="flex h-18 items-center justify-between gap-4 sm:h-22">
        <Link href="/" className="shrink-0 transition-transform hover:-rotate-2">
          <LogoMark label={siteName} priority className="h-11 sm:h-13" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 font-display text-sm font-bold text-ink/70 transition-colors hover:bg-secondary hover:text-pink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher label={tHeader("languageLabel")} />
          <TelegramCta source="header" label={tCommon("continueInTelegram")} size="sm" />
        </div>

        <MobileNav
          links={navLinks}
          menuLabel={t("menu")}
          openMenuLabel={t("openMenu")}
          telegramLabel={tCommon("continueInTelegram")}
          languageLabel={tHeader("languageLabel")}
        />
      </Container>
    </header>
  );
}
