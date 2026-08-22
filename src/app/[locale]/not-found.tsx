import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { TriTitle } from "@/components/site/DeckTitle";
import { DoodleField, Cloud } from "@/components/site/Doodles";
import { pill } from "@/components/site/Pill";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const tCommon = await getTranslations("common");

  return (
    <div className="relative flex min-h-[68vh] items-center overflow-hidden">
      <DoodleField className="hidden sm:block" />

      <Container className="relative flex flex-col items-center text-center">
        <Cloud color="var(--brown-soft)" className="w-24 animate-float" />

        <p className="headline mt-6 text-7xl text-pink sm:text-8xl">404</p>

        <TriTitle
          as="h1"
          text={t("title")}
          className="headline mt-4 max-w-xl text-3xl sm:text-4xl"
        />

        <p className="mt-4 max-w-sm text-base text-muted-foreground">{t("description")}</p>

        <Link href="/" className={`${pill({ tone: "pink", size: "lg" })} mt-9`}>
          {tCommon("backToHomepage")}
        </Link>
      </Container>
    </div>
  );
}
