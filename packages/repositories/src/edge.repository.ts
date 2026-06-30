import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@pawnote/database';

export class EdgeRepository {
  constructor(private db: DrizzleD1Database<typeof schema>) {}

  async getAll() {
    return this.db.select({
      id: schema.edges.id,
      source: schema.edges.source,
      target: schema.edges.target,
      type: schema.edges.type,
      label: schema.edges.label,
    }).from(schema.edges);
  }
}
