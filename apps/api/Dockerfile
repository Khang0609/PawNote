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
EXPOSE 8787

# --- Stage 3: Builder ---
FROM deps AS builder
COPY . .
RUN cd apps/api && npx wrangler deploy --dry-run --outdir dist

# --- Stage 4: Production Runner ---
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 8787
CMD ["npx", "wrangler", "dev", "apps/api/dist/index.js", "--ip", "0.0.0.0", "--port", "8787"]
