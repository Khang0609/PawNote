# Use node alpine as the base image
FROM node:20-alpine AS base

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory
WORKDIR /app

# --- Stage 1: Install dependencies ---
FROM base AS deps
# Copy configuration files and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Copy workspaces package.json files to allow pnpm to resolve dependencies correctly
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/types/package.json ./packages/shared/types/
COPY packages/shared/ui/package.json ./packages/shared/ui/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/repositories/package.json ./packages/repositories/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# --- Stage 2: Build the application ---
FROM deps AS builder
# Copy the entire workspace source code
COPY . .
# Build the Next.js web application
RUN pnpm --filter web build

# --- Stage 3: Runner ---
FROM base AS runner
ENV NODE_ENV=production
# Expose Next.js port
EXPOSE 3000

# Copy node_modules and built bundles from the builder stage
COPY --from=builder /app /app

# Command to run the application
CMD ["pnpm", "--filter", "web", "start"]
