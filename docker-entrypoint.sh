#!/bin/sh
set -e

# Without this the container crash-loops on a wall of Prisma stack traces
# that never names the actual problem.
if [ -z "$DATABASE_URL" ]; then
  echo "FATAL: DATABASE_URL is not set." >&2
  echo "Add a PostgreSQL service to the project and reference it from this" >&2
  echo "service, e.g. DATABASE_URL=\${{Postgres.DATABASE_URL}}" >&2
  exit 1
fi

# The uploads directory is a mounted volume in production, so bundled
# lesson assets have to be copied in at boot rather than baked into the
# image. -n keeps anything the admin uploaded later untouched.
if [ -d prisma/assets ]; then
  mkdir -p public/uploads
  cp -n prisma/assets/* public/uploads/ 2>/dev/null || true
  echo "Lesson assets in place."
fi

echo "Applying database migrations..."
npx prisma migrate deploy

# Decks must be rendered here rather than from the console: only this
# container has the uploads volume the web process serves from.
echo "Checking lesson deck pages..."
npm run --silent db:pages

echo "Starting Next.js..."
exec npm run start
