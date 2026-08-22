import Image from "next/image";
import { cn } from "@/lib/utils";

export function AuthorPortrait({
  photoUrl,
  name,
  className,
  priority,
}: {
  photoUrl: string | null;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "M";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-2 border-ink bg-secondary",
        className,
      )}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 480px, 90vw"
          quality={90}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-brown">
          <span className="headline text-8xl text-cream/85">{initial}</span>
        </div>
      )}
    </div>
  );
}
