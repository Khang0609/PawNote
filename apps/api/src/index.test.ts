import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '@pawnote/database';
import app from './index';
import fs from 'fs';
import path from 'path';

function logToFile(msg: string) {
  const tempDir = path.resolve(__dirname, '../../../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  fs.appendFileSync(path.resolve(tempDir, 'test_log.txt'), msg + '\n');
}

// Mock D1Database wrapper around better-sqlite3
function createD1Mock(sqlite: Database.Database) {
  return {
    prepare(sql: string) {
      logToFile(`D1 Mock Prepare: ${sql}`);
      try {
        const stmt = sqlite.prepare(sql);
        
        const createStatementObj = (values: any[]) => {
          return {
            async all() {
              logToFile(`D1 Mock executes all with values: ${JSON.stringify(values)}`);
              try {
                const rows = stmt.all(...values);
                return { results: rows, success: true };
              } catch (e: any) {
                logToFile(`D1 Mock All Error: ${e.stack || e.message}`);
                throw e;
              }
            },
            async run() {
              logToFile(`D1 Mock executes run with values: ${JSON.stringify(values)}`);
              try {
                const info = stmt.run(...values);
                return { success: true, meta: { changes: info.changes } };
              } catch (e: any) {
                logToFile(`D1 Mock Run Error: ${e.stack || e.message}`);
                throw e;
              }
            },
            async raw() {
              logToFile(`D1 Mock executes raw with values: ${JSON.stringify(values)}`);
              try {
                const rows = stmt.all(...values);
                const rawRows = rows.map((row: any) => Object.values(row));
                return rawRows;
              } catch (e: any) {
                logToFile(`D1 Mock Raw Error: ${e.stack || e.message}`);
                throw e;
              }
            },
            bind(...newValues: any[]) {
              logToFile(`D1 Mock Bind values: ${JSON.stringify(newValues)}`);
              return createStatementObj([...values, ...newValues]);
            }
          };
        };

        return createStatementObj([]);
      } catch (e: any) {
        logToFile(`D1 Mock Prepare Error: ${e.stack || e.message}`);
        throw e;
      }
    },
    async exec(sql: string) {
      logToFile(`D1 Mock Exec: ${sql}`);
      try {
        sqlite.exec(sql);
        return { count: 0, duration: 0 };
      } catch (e: any) {
        logToFile(`D1 Mock Exec Error: ${e.stack || e.message}`);
        throw e;
      }
    }
  } as unknown as D1Database;
}

describe('Graph API Endpoints', () => {
  let sqlite: Database.Database;
  let d1Mock: D1Database;
  let mockGraphData: any;

  beforeEach(() => {
    // 1. Load mock data dynamically using fs to avoid tsconfig imports issues
    const mockDataPath = path.resolve(__dirname, '../../../temp/mock-graph.json');
    mockGraphData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

    // 2. Create a fresh in-memory database
    sqlite = new Database(':memory:');

    // 3. Run migrations on the in-memory database
    const dbBetter = drizzleBetterSqlite(sqlite, { schema });
    const migrationsFolder = path.resolve(__dirname, '../../../packages/database/drizzle');
    migrate(dbBetter, { migrationsFolder });

    // 4. Seed database from mock-graph.json
    for (const node of mockGraphData.nodes) {
      dbBetter.insert(schema.nodes).values({
        id: node.id,
        title: node.title,
        slug: node.slug,
        position: node.position,
        size: node.size,
        type: node.type as any,
        color: node.color || null,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      }).run();
    }

    for (const edge of mockGraphData.edges) {
      dbBetter.insert(schema.edges).values({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type as any,
        label: edge.label || null,
      }).run();
    }

    // 5. Wrap the sqlite instance into our D1 Mock
    d1Mock = createD1Mock(sqlite);
  });

  it('GET /api/v1/graph should return seeded nodes and edges metadata', async () => {
    const res = await app.request('/api/v1/graph', {}, { DB: d1Mock });
    if (res.status === 500) console.log('GET graph error:', await res.text());
    expect(res.status).toBe(200);

    const data = await res.json() as any;
    expect(data).toHaveProperty('nodes');
    expect(data).toHaveProperty('edges');
    expect(data.nodes.length).toBe(mockGraphData.nodes.length);
    expect(data.edges.length).toBe(mockGraphData.edges.length);

    const firstNode = data.nodes[0];
    expect(firstNode).toHaveProperty('id');
    expect(firstNode).toHaveProperty('title');
    expect(firstNode).toHaveProperty('slug');
    expect(firstNode).toHaveProperty('position');
    expect(firstNode).toHaveProperty('size');
  });

  it('GET /api/v1/nodes/:id/position should update position via query parameters', async () => {
    const nodeId = 'node-1';
    const res = await app.request(`/api/v1/nodes/${nodeId}/position?x=150&y=250&z=5`, {
      method: 'GET'
    }, { DB: d1Mock });

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.id).toBe(nodeId);
    expect(data.position).toEqual({ x: 150, y: 250, z: 5 });
  });

  it('PUT /api/v1/nodes/:id/position should update position via JSON body', async () => {
    const nodeId = 'node-2';
    const res = await app.request(`/api/v1/nodes/${nodeId}/position`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x: 300, y: 400 }),
    }, { DB: d1Mock });

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.id).toBe(nodeId);
    expect(data.position.x).toBe(300);
    expect(data.position.y).toBe(400);
  });

  it('POST /api/v1/nodes should create a new node quickly', async () => {
    const res = await app.request('/api/v1/nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'New Quick Node',
        position: { x: 50, y: 75 }
      }),
    }, { DB: d1Mock });

    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('New Quick Node');
    expect(data.slug).toBe('new-quick-node');
    expect(data.position).toEqual({ x: 50, y: 75 });
  });
});
