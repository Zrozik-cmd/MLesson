import Link from "next/link";
import { LogoMark } from "@/components/site/LogoMark";
import { Cloud } from "@/components/site/Doodles";
import { pill } from "@/components/site/Pill";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <LogoMark className="h-12" />
      <Cloud color="var(--brown-soft)" className="mt-10 w-24 animate-float" />
      <p className="headline mt-6 text-7xl text-pink">404</p>
      <h1 className="headline mt-4 text-3xl text-ink">This page wandered off.</h1>
      <p className="mt-4 max-w-sm text-base text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
      </p>
      <Link href="/" className={`${pill({ tone: "pink", size: "lg" })} mt-9`}>
        Back to the homepage
      </Link>
    </div>
  );
}
