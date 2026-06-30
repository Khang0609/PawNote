import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@pawnote/database';
import { NodeRepository, EdgeRepository } from '@pawnote/repositories';

type Bindings = {
  DB: D1Database;
};

const graphRouter = new Hono<{ Bindings: Bindings }>();

// 1. GET /graph - Lấy bản đồ vẽ chấm (chỉ lấy metadata cần thiết)
graphRouter.get('/graph', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const nodeRepo = new NodeRepository(db);
  const edgeRepo = new EdgeRepository(db);

  try {
    const nodes = await nodeRepo.getAllMetadata();
    const edges = await edgeRepo.getAll();

    return c.json({
      nodes,
      edges,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 2. GET/PUT/PATCH/POST /nodes/:id/position - Cập nhật vị trí sau khi kéo thả
graphRouter.on(['GET', 'PUT', 'PATCH', 'POST'], '/nodes/:id/position', async (c) => {
  const id = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });
  const nodeRepo = new NodeRepository(db);

  let x: number | undefined;
  let y: number | undefined;
  let z: number | undefined;

  // Lấy dữ liệu từ query params nếu là GET, hoặc request body nếu là PUT/POST/PATCH
  if (c.req.method === 'GET') {
    const qX = c.req.query('x');
    const qY = c.req.query('y');
    const qZ = c.req.query('z');
    if (qX !== undefined) x = Number(qX);
    if (qY !== undefined) y = Number(qY);
    if (qZ !== undefined) z = Number(qZ);
  } else {
    try {
      const body = await c.req.json();
      if (typeof body.x === 'number') x = body.x;
      if (typeof body.y === 'number') y = body.y;
      if (typeof body.z === 'number') z = body.z;
    } catch {
      // Bỏ qua lỗi JSON format nếu không gửi body
    }
  }

  if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
    return c.json({ error: 'Toạ độ x và y là bắt buộc và phải là số hợp lệ' }, 400);
  }

  try {
    const existingNode = await nodeRepo.findById(id);

    if (!existingNode) {
      return c.json({ error: 'Không tìm thấy node' }, 404);
    }

    const newPosition = {
      x,
      y,
      z: z !== undefined ? z : existingNode.position.z,
    };

    const result = await nodeRepo.updatePosition(id, newPosition);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 3. POST /nodes - Tạo nhanh một node mới
graphRouter.post('/nodes', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const nodeRepo = new NodeRepository(db);

  try {
    const body = await c.req.json();
    const title = body.title || 'Untitled Node';

    // Hàm sinh slug đơn giản từ tiêu đề
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    };

    const slug = body.slug || generateSlug(title) || `node-${Math.random().toString(36).substring(2, 9)}`;
    const id = body.id || `node-${Math.random().toString(36).substring(2, 9)}`;
    const position = body.position || { x: 0, y: 0 };
    const size = body.size || { width: 150, height: 50 };
    const type = body.type || 'text';
    const color = body.color || null;

    const now = Date.now();

    const result = await nodeRepo.create({
      id,
      title,
      slug,
      position,
      size,
      type,
      color,
      createdAt: now,
      updatedAt: now,
    });

    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export { graphRouter };
