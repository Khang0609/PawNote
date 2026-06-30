import { z } from "zod";

export const GraphNodeSchema = z.object({
  id: z.string(), // ID duy nhất (uuid hoặc nanoid)
  title: z.string(), // Tiêu đề nốt (hiển thị khi hover hoặc render label)
  slug: z.string(), // Dùng để match cú pháp [[slug]] hoặc [[title]]

  // Vị trí trên Canvas toàn cục (Bắt buộc phải có để Graph View/Canvas định vị)
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number().optional(), // Tùy chọn nếu sau này làm layer hoặc hiệu ứng đè lập thể
  }),

  // Kích thước của node trên Canvas (phục vụ việc vẽ bounding box hoặc tính toán va chạm)
  size: z.object({
    width: z.number(),
    height: z.number(), 
  }),

  // Metadata phục vụ cho việc filter/style trên Dashboard
  type: z.enum(["text", "canvas", "group"]), // Phân loại node (nốt chữ thuần, nốt không gian vẽ, hoặc cụm nhóm)
  color: z.string().optional(), // Màu sắc của nốt (để người dùng customize hoặc phân cụm tự động)

  createdAt: z.number(), // Timestamp
  updatedAt: z.number(),
});

export type GraphNode = z.infer<typeof GraphNodeSchema>;

export const GraphEdgeSchema = z.object({
  id: z.string(), // ID của cạnh liên kết (e.g., `nodeA-to-nodeB`)
  source: z.string(), // ID của Node gốc (nơi chứa cú pháp [[]])
  target: z.string(), // ID của Node đích (nốt được gọi tên)

  // Mở rộng sau này (Optional)
  type: z.enum(["bi-directional", "directional"]).optional(), // Liên kết 1 chiều hay 2 chiều
  label: z.string().optional(), // Nhãn của cạnh nếu muốn làm Semantic Web (ví dụ: "thuộc về", "giải thích cho")
});

export type GraphEdge = z.infer<typeof GraphEdgeSchema>;

export const SharedGraphDataSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
});

export type SharedGraphData = z.infer<typeof SharedGraphDataSchema>;
