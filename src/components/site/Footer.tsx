import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { TelegramCta } from "@/components/site/TelegramCta";
import { LogoMark } from "@/components/site/LogoMark";
import { Sparkle, Squiggle } from "@/components/site/Doodles";
import { prisma } from "@/lib/prisma";

async function getSocialLinks() {
  try {
    return await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function Footer({
  siteName,
  siteDescription,
}: {
  siteName: string;
  siteDescription: string;
}) {
  const [socialLinks, t, tNav] = await Promise.all([
    getSocialLinks(),
    getTranslations("footer"),
    getTranslations("nav"),
  ]);
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/lessons", label: tNav("lessons") },
    { href: "/about", label: tNav("about") },
    { href: "/faq", label: tNav("faq") },
  ];

  return (
    <footer className="section-dark relative overflow-hidden border-t-2 border-ink">
      <Squiggle
        color="var(--brown-soft)"
        className="absolute top-10 right-8 hidden w-36 opacity-30 sm:block"
      />

      <Container className="relative py-16 sm:py-20">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <LogoMark label={siteName} variant="cream" className="h-12" />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {siteDescription}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Sparkle className="size-3 text-gold" />
              <Sparkle className="size-4 text-pink" />
              <Sparkle className="size-3 text-mint" />
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-gold">{t("explore")}</p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-display text-sm font-bold text-cream/85 transition-colors hover:text-pink"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col items-start gap-3">
              <p className="eyebrow text-gold">{t("connect")}</p>
              <TelegramCta source="footer" label={t("telegram")} tone="gold" size="sm" />
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-display text-sm font-bold text-cream/85 transition-colors hover:text-pink"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}. {t("rights")}
          </p>
          <p className="font-hand text-base text-cream/70">{t("tagline")}</p>
        </div>
      </Container>
    </footer>
  );
}
