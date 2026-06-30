FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --- Stage 1: Prune the Workspace ---
FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune api --docker

# --- Stage 2: Install Dependencies ---
FROM base AS installer
WORKDIR /app

# Copy pruned package.json and lockfile
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install dependencies (leverages layer caching)
RUN pnpm install --frozen-lockfile

# --- Stage 3: Build the Application ---
FROM base AS builder
WORKDIR /app

# Copy lockfile, workspace configuration, and cached node_modules
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=installer /app/node_modules ./node_modules

# Copy pruned source files
COPY --from=pruner /app/out/full/ .

# Build the wrangler worker locally (dry-run to compile assets)
RUN cd apps/api && npx wrangler deploy --dry-run --outdir dist

# --- Stage 4: Production Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built application and workspace structure
COPY --from=builder /app /app

EXPOSE 8787
CMD ["npx", "wrangler", "dev", "apps/api/dist/index.js", "--ip", "0.0.0.0", "--port", "8787"]
