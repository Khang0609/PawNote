import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '@pawnote/database';

export class NodeRepository {
  constructor(private db: DrizzleD1Database<typeof schema>) {}

  async getAllMetadata() {
    return this.db.select({
      id: schema.nodes.id,
      title: schema.nodes.title,
      slug: schema.nodes.slug,
      position: schema.nodes.position,
      size: schema.nodes.size,
      type: schema.nodes.type,
      color: schema.nodes.color,
    }).from(schema.nodes);
  }

  async findById(id: string) {
    return this.db.query.nodes.findFirst({
      where: eq(schema.nodes.id, id),
    });
  }

  async updatePosition(id: string, position: { x: number; y: number; z?: number }) {
    const result = await this.db
      .update(schema.nodes)
      .set({
        position,
        updatedAt: Date.now(),
      })
      .where(eq(schema.nodes.id, id))
      .returning();
    return result[0];
  }

  async create(node: typeof schema.nodes.$inferInsert) {
    const result = await this.db
      .insert(schema.nodes)
      .values(node)
      .returning();
    return result[0];
  }
}
