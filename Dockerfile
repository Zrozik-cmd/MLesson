# syntax=docker/dockerfile:1

# Debian slim rather than Alpine: Prisma's query engine needs OpenSSL, which
# the Alpine images don't ship.
FROM node:22-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# prisma/ comes before `npm ci` because the postinstall hook generates the
# client and needs the schema on disk.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .

# Next inlines NEXT_PUBLIC_* at build time, so the public URL has to be known
# here — setting it only at runtime is too late.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Migrations run on boot so a fresh database comes up ready. `next start`
# honours the PORT the platform injects.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
