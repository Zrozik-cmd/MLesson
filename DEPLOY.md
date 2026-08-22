# Deploying M Lesson

The app is a Next.js server (not static) with PostgreSQL and admin file
uploads written to disk. That combination needs a host that gives you a
**persistent volume** — Railway, Render, Fly.io or any VPS with Docker.

> Serverless hosts (Vercel and friends) will not work with the current upload
> code: their filesystem is ephemeral, and their request-body limit (~4.5 MB)
> is smaller than a lesson deck. Moving there means rewriting
> `src/lib/storage.ts` plus the client upload flow to push straight to object
> storage.

---

## 1. Prerequisites

- The project must be its own git repository. It has been initialised, but
  the first commit is yours to make:

  ```bash
  git add -A && git commit -m "Initial commit" && git branch -M main
  ```

  Then create an empty repo on GitHub and push it.
- A PostgreSQL database (Railway/Render provision one for you).
- An `AUTH_SECRET`. Generate one with:

```bash
openssl rand -base64 32
```

## 2. Environment variables

Set these on the service before the first build. `NEXT_PUBLIC_SITE_URL` is
**inlined at build time**, so it has to be present for the build, not just at
runtime.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | from the managed Postgres |
| `AUTH_SECRET` | output of the command above |
| `NEXTAUTH_URL` | `https://your-domain` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain` |
| `SEED_ADMIN_EMAIL` | admin login (only needed if you run the seed) |
| `SEED_ADMIN_PASSWORD` | admin password (only needed if you run the seed) |
| `NEXT_PUBLIC_GA_ID` | optional — overrides the built-in Google Analytics ID |

`PORT` is injected by the platform; `next start` picks it up on its own.

Analytics needs no variable: the measurement ID ships in the code and only
fires in production builds. `NEXT_PUBLIC_GA_ID` overrides it, and like the
site URL it is inlined at build time — so set it before the build. A wrong
value silently stops collection, so leave it unset unless you mean it.

## 3. Persistent volume

Mount a volume at:

```
/app/public/uploads
```

Everything the admin uploads — lesson PDFs, covers, the author photo — lives
there. Without the volume those files disappear on every redeploy.

Size it for your decks: a compressed lesson PDF runs 5–10 MB, so 5 GB is
plenty to start.

## 4. Deploy

### Railway

1. **New Project → Deploy from GitHub repo**, pick this repository.
2. **New → Database → PostgreSQL** in the same project. Copy its
   `DATABASE_URL` into the app service's variables.
3. Add the remaining variables from the table above.
4. **Settings → Volumes → New Volume**, mount path `/app/public/uploads`.
5. Railway detects the `Dockerfile` and builds. Migrations run automatically
   on boot (`prisma migrate deploy` in the container's start command).
6. **Settings → Networking → Generate Domain**, then update `NEXTAUTH_URL`
   and `NEXT_PUBLIC_SITE_URL` to that domain and redeploy so the build
   inlines the right value.

### Render

Same shape: **New → Web Service**, environment *Docker*, add a **Disk**
mounted at `/app/public/uploads`, and create a **PostgreSQL** instance for
`DATABASE_URL`.

### Plain VPS

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain -t mlesson .
docker run -d --name mlesson -p 3000:3000 \
  --env-file .env.production \
  -v mlesson-uploads:/app/public/uploads \
  mlesson
```

Put Caddy or nginx in front for TLS.

## 5. First run

The database starts empty. Seed the admin user and the tag list once:

```bash
npm run db:seed
```

Run it against the production `DATABASE_URL` (Railway: `railway run npm run db:seed`).

Two things to know about the seed:

- It creates the admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
  **Change the password after the first login.**
- It also inserts six demo lessons. Delete them from `/admin/lessons` once
  your real lessons are in.

Then sign in at `https://your-domain/admin/login` and upload the lesson PDFs —
the ones sitting in your local `public/uploads` are not part of the image.

## 6. Notes

- Lesson decks exported from Canva are heavy (18 MB for 13 slides). Compress
  before uploading, otherwise the in-page viewer crawls:

  ```bash
  gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 \
     -dDetectDuplicateImages=true -dFastWebView=true \
     -dColorImageDownsampleType=/Bicubic -dColorImageResolution=150 \
     -dAutoFilterColorImages=false -sColorImageFilter=DCTEncode -dJPEGQ=82 \
     -sOutputFile=deck-web.pdf deck.pdf
  ```

- The upload endpoint caps PDFs at 60 MB and other media at 25 MB
  (`src/app/api/admin/upload/route.ts`).
- Backups: the volume holds the uploads, Postgres holds everything else —
  back up both.
