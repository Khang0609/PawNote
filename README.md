# 🐾 PawNote

> A visual, canvas-based note-taking application designed for mapping knowledge with bi-directional and external graph connections.

PawNote blends the intuitive, free-form workspace of canvas-based editors like **Lucidchart** or **Miro** with the powerful, structured, graph-based knowledge organization of **Obsidian**. Instead of confining your ideas to isolated documents, PawNote lets you map them out visually and connect them natively—not just internally to other notes, but also externally to public APIs, web pages, and remote data sources, turning your workspace into an interactive, open-ended web of knowledge.

---

## 🚀 Key Features

* **Infinite Interactive Canvas:** Freely sketch illustrations, draft mindmaps, create flowcharts, and arrange sticky notes without bounds.
* **Graph-Based Knowledge Engine:** Connect nodes bi-directionally to create a dense, searchable, and navigable web of knowledge.
* **External Link Integration:** Go beyond typical local graphs. Bridge internal notes with external web resources, documents, and reference materials.
* **Modern Developer Stack:** Powered by [Turborepo](https://turbo.build/), [Next.js](https://nextjs.org/), and [TypeScript](https://www.typescriptlang.org/) for high performance, type safety, and clean monorepo architecture.

---

## 🛠️ Project Structure

This project is organized as a monorepo under `pnpm` workspace:

### Apps
* [web](file:///e:/lap_trinh/Project/PawNote/apps/web): Next.js application representing the front-end user interface.
* [api](file:///e:/lap_trinh/Project/PawNote/apps/api): Backend services, APIs, and graph data managers.

### Packages
* [shared](file:///e:/lap_trinh/Project/PawNote/packages/shared): Common TypeScript types, schema validations, and utility functions shared across frontend and backend.
* [repositories](file:///e:/lap_trinh/Project/PawNote/packages/repositories): Data access layers, database queries, and repository patterns.
* `packages/eslint-config`: Shared linter configurations.
* `packages/typescript-config`: Shared TSConfig base configurations.

---

## 🏁 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (>= 18) and [pnpm](https://pnpm.io/) installed.

### Installation

Clone the repository and install all workspace dependencies:

```bash
pnpm install
```

### Development

To spin up all apps and packages in development mode:

```bash
pnpm dev
```

### Build

To compile all applications for production:

```bash
pnpm build
```

---

## 📜 Development Utilities

* **Format Code:** `pnpm format`
* **Lint Check:** `pnpm lint`
* **Type Verification:** `pnpm check-types`
