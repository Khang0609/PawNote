import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { type GraphNode, type GraphEdge } from "@pawnote/types";

export const nodes = sqliteTable("nodes", {
  id: text("id").primaryKey(), // ID duy nhất (uuid hoặc nanoid)
  title: text("title").notNull(), // Tiêu đề nốt (hiển thị khi hover hoặc render label)
  slug: text("slug").notNull(), // Dùng để match cú pháp [[slug]] hoặc [[title]]

  // Vị trí trên Canvas toàn cục (Bắt buộc phải có để Graph View/Canvas định vị)
  position: text("position", { mode: "json" }).$type<GraphNode["position"]>().notNull(),

  // Kích thước của node trên Canvas (phục vụ việc vẽ bounding box hoặc tính toán va chạm)
  size: text("size", { mode: "json" }).$type<GraphNode["size"]>().notNull(),

  // Metadata phục vụ cho việc filter/style trên Dashboard
  type: text("type").$type<GraphNode["type"]>().notNull(),
  color: text("color"), // Màu sắc của nốt

  createdAt: integer("created_at").notNull(), // Timestamp
  updatedAt: integer("updated_at").notNull(), // Timestamp
});

export const edges = sqliteTable("edges", {
  id: text("id").primaryKey(), // ID của cạnh liên kết (e.g., `nodeA-to-nodeB`)
  source: text("source")
    .notNull()
    .references(() => nodes.id, { onDelete: "cascade" }), // ID của Node gốc
  target: text("target")
    .notNull()
    .references(() => nodes.id, { onDelete: "cascade" }), // ID của Node đích

  // Mở rộng sau này (Optional)
  type: text("type").$type<GraphEdge["type"]>(), // Liên kết 1 chiều hay 2 chiều
  label: text("label"), // Nhãn của cạnh
});
