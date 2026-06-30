import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load mock graph JSON
const mockDataPath = path.resolve(__dirname, '../../../temp/mock-graph.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

let sqlContent = '-- Seed data generated from mock-graph.json\n\n';

// Generate SQL for nodes
for (const node of mockData.nodes) {
  const id = JSON.stringify(node.id);
  const title = JSON.stringify(node.title);
  const slug = JSON.stringify(node.slug);
  const position = JSON.stringify(JSON.stringify(node.position));
  const size = JSON.stringify(JSON.stringify(node.size));
  const type = JSON.stringify(node.type);
  const color = node.color ? JSON.stringify(node.color) : 'NULL';
  const createdAt = node.createdAt;
  const updatedAt = node.updatedAt;

  sqlContent += `INSERT OR REPLACE INTO nodes (id, title, slug, position, size, type, color, created_at, updated_at) VALUES (${id}, ${title}, ${slug}, ${position}, ${size}, ${type}, ${color}, ${createdAt}, ${updatedAt});\n`;
}

// Generate SQL for edges
for (const edge of mockData.edges) {
  const id = JSON.stringify(edge.id);
  const source = JSON.stringify(edge.source);
  const target = JSON.stringify(edge.target);
  const type = edge.type ? JSON.stringify(edge.type) : 'NULL';
  const label = edge.label ? JSON.stringify(edge.label) : 'NULL';

  sqlContent += `INSERT OR REPLACE INTO edges (id, source, target, type, label) VALUES (${id}, ${source}, ${target}, ${type}, ${label});\n`;
}

// Write to seed.sql
const outputPath = path.resolve(__dirname, '../drizzle/seed.sql');
fs.writeFileSync(outputPath, sqlContent);
console.log('Successfully generated packages/database/drizzle/seed.sql!');
