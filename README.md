# M Lesson

A premium, boutique English-lessons website. Visitors land on the site, get to
know the teacher, watch free trial lessons, and convert into Telegram — where
the actual course is sold. Everything except payment (handled manually in
Telegram, by design) is fully functional: public site, admin authentication,
lesson/FAQ CRUD, site settings, and lightweight first-party analytics.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Components by default)
- **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**
- **PostgreSQL** + **Prisma ORM**
- **Auth.js (NextAuth v5)** — Credentials provider for the admin panel
- **Zod** for validation, **React Hook Form** for admin forms
- **Framer Motion** for restrained, `prefers-reduced-motion`-aware animation
- **Lucide** icons

## Requirements

- Node.js 20+
- A PostgreSQL database (local or hosted)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run db:migrate      # creates tables (prisma migrate dev)
npm run db:seed         # demo lessons, FAQ, settings, and an admin user
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` for the admin panel (credentials come from
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in your `.env`).

> **Running on a different port?** Auth.js treats `NEXTAUTH_URL` as the
> canonical origin for redirects and cookies. If `next dev` picks a different
> port (e.g. because 3000 is already taken by another project), update
> `NEXTAUTH_URL` to match — otherwise post-login/logout redirects will point
> at the wrong port.

## Environment variables

See `.env.example` for the full list with inline comments. The essentials:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `AUTH_SECRET` | Session signing secret — generate with `npx auth secret` or `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical site origin used by Auth.js (see note above) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials for the admin user created by `prisma/seed.ts` |
| `NEXT_PUBLIC_SITE_URL` | Used for absolute URLs in metadata, `sitemap.xml`, and `robots.txt` |
| `CLOUDINARY_*` | Optional — see **Media storage** below |

## Database

The schema lives in `prisma/schema.prisma`:

- `User` — admin accounts
- `Lesson` — trial + full lessons, with publishing/ordering fields
- `SiteSettings` — single-row table for author bio, hero copy, and the
  Telegram URL (everything editable in `/admin/settings`)
- `Faq` — managed from `/admin/faq`
- `SocialLink` — managed from `/admin/settings`
- `AnalyticsEvent` — `page_view`, `lesson_view`, `telegram_click` events

Common commands:

```bash
npm run db:migrate   # prisma migrate dev — creates/updates tables
npm run db:seed      # prisma db seed — demo content + admin user
npm run db:studio     # prisma studio — browse the database visually
```

Re-running `db:seed` is safe — lessons and the admin user are upserted, and
site settings are only created if none exist yet.

## Media storage

Uploads (lesson thumbnails, video files) go through `src/lib/storage.ts`,
a small provider abstraction. Today it ships with a `LocalStorageProvider`
that writes to `public/uploads/` — this works out of the box with **no cloud
account needed**. To switch to Cloudinary or S3, add a provider implementing
the same `StorageProvider` interface and select it based on the
`CLOUDINARY_*` env vars (see the `TODO` in that file). Nothing outside
`storage.ts` needs to change — the upload API route
(`src/app/api/admin/upload/route.ts`) and the admin `ImageUploader` /
`VideoUploader` components are storage-agnostic.

Lesson videos can also just be a YouTube or Vimeo URL — pasted directly into
the video field, no upload required (`src/lib/video.ts` detects the source
and embeds accordingly).

## Analytics

There's no Google Analytics / third-party tracker. Instead, `AnalyticsEvent`
rows are written directly for:

- `page_view` — client-side, on every route change (`PageViewTracker`)
- `lesson_view` — server-side, when a lesson page renders
- `telegram_click` — server-side, whenever `/telegram?source=...` is hit

Every "Continue in Telegram" button on the site links to `/telegram?source=X`
rather than the Telegram URL directly — that route records the click, then
redirects to the URL configured in `/admin/settings`. Aggregate counts show
up on `/admin` (published/draft lessons, 30-day Telegram clicks, recent
lesson activity).

## Admin panel

- `/admin/login` — Credentials-based sign in (Auth.js)
- `/admin` — dashboard (lesson counts, Telegram clicks, recent activity)
- `/admin/lessons`, `/admin/lessons/new`, `/admin/lessons/[id]` — full CRUD,
  publish/unpublish, and reordering
- `/admin/faq` — CRUD + reordering for the public FAQ page
- `/admin/settings` — author bio/photo, hero copy, Telegram URL, site
  name/description, and social links

Routes under `/admin` (except `/admin/login`) are protected by
`src/proxy.ts` (Next's middleware convention, renamed per Next 16) and every
mutation is re-checked server-side via `requireAdmin()` in
`src/lib/require-admin.ts` — the client is never trusted for authorization.

## Project structure

```
prisma/                   schema, migrations, seed script
src/
  app/
    (site)/                public pages — share Header/Footer via layout
    admin/
      login/               public admin login page
      (dashboard)/         protected — dashboard, lessons, faq, settings
    api/                   analytics, admin upload, NextAuth route handler
    telegram/route.ts       tracked redirect to the configured Telegram URL
    sitemap.ts, robots.ts   SEO metadata routes
  components/
    site/                  public-site building blocks (Hero, LessonCard, …)
    admin/                 admin-only building blocks (forms, tables, …)
    motion/                Framer Motion wrapper (Reveal)
    ui/                    shadcn/ui primitives
  lib/
    actions/               Server Actions (lessons, faq, settings, social links)
    validation/            Zod schemas shared by forms and Server Actions
    prisma.ts, settings.ts, data.ts, analytics.ts, storage.ts, video.ts
  auth.ts, auth.config.ts   Auth.js config (config split so middleware stays edge-safe)
  proxy.ts                  route protection for /admin/*
```

## Production build

```bash
npm run build
npm run start
```

## Deployment notes

- Point `DATABASE_URL` at your production Postgres instance and run
  `npx prisma migrate deploy` (not `migrate dev`) as part of your deploy step.
- Set `AUTH_SECRET`, `NEXTAUTH_URL` (your real domain), and
  `NEXT_PUBLIC_SITE_URL` in the hosting provider's environment settings.
- If deploying to a platform with an ephemeral/read-only filesystem (e.g.
  Vercel), the local storage provider won't persist uploads across deploys —
  wire up the Cloudinary/S3 provider first (see **Media storage**).
- Create the first admin user via `npm run db:seed`, then change the password
  by updating the `User` row (there's no self-service password reset yet).
