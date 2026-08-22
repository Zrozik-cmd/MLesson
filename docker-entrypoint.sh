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

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Starting Next.js..."
exec npm run start
