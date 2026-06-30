import { Hono } from 'hono';
import { graphRouter } from './routes/graph.route';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Gắn route graph dưới tiền tố /api/v1
app.route('/api/v1', graphRouter);

export default app;
