export interface GraphNode {
  id: string; // ID duy nhất (uuid hoặc nanoid)
  title: string; // Tiêu đề nốt (hiển thị khi hover hoặc render label)
  slug: string; // Dùng để match cú pháp [[slug]] hoặc [[title]]

  // Vị trí trên Canvas toàn cục (Bắt buộc phải có để Graph View/Canvas định vị)
  position: {
    x: number;
    y: number;
    z?: number; // Tùy chọn nếu sau này làm layer hoặc hiệu ứng đè lập thể
  };

  // Kích thước của node trên Canvas (phục vụ việc vẽ bounding box hoặc tính toán va chạm)
  size: {
    width: number;
    height: number;
  };

  // Metadata phục vụ cho việc filter/style trên Dashboard
  type: "text" | "canvas" | "group"; // Phân loại node (nốt chữ thuần, nốt không gian vẽ, hoặc cụm nhóm)
  color?: string; // Màu sắc của nốt (để người dùng customize hoặc phân cụm tự động)

  createdAt: number; // Timestamp
  updatedAt: number;
}

export interface GraphEdge {
  id: string; // ID của cạnh liên kết (e.g., `nodeA-to-nodeB`)
  source: string; // ID của Node gốc (nơi chứa cú pháp [[]])
  target: string; // ID của Node đích (nốt được gọi tên)

  // Mở rộng sau này (Optional)
  type?: "bi-directional" | "directional"; // Liên kết 1 chiều hay 2 chiều
  label?: string; // Nhãn của cạnh nếu muốn làm Semantic Web (ví dụ: "thuộc về", "giải thích cho")
}

export interface SharedGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
