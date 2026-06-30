FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# --- Stage 1: Dependencies ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/repositories/package.json ./packages/repositories/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/shared/types/package.json ./packages/shared/types/
COPY packages/shared/ui/package.json ./packages/shared/ui/

RUN pnpm install --frozen-lockfile

# --- Stage 2: Development ---
FROM deps AS development
COPY . .
EXPOSE 3000

# --- Stage 3: Builder ---
FROM deps AS builder
COPY . .
RUN pnpm --filter web build

# --- Stage 4: Production Runner ---
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
