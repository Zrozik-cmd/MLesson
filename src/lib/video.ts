export type VideoSource =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; url: string }
  | null;

export function resolveVideoSource(url: string | null | undefined): VideoSource {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") {
      const id =
        host === "youtu.be"
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop();
      if (!id) return { kind: "file", url };
      return {
        kind: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
      };
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (!id) return { kind: "file", url };
      return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` };
    }

    return { kind: "file", url };
  } catch {
    return null;
  }
}
