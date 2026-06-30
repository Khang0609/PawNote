FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --- Stage 1: Prune the Workspace ---
FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune web --docker

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

# Build the web application
RUN pnpm --filter web build

# --- Stage 4: Production Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built application and workspace structure
COPY --from=builder /app /app

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
