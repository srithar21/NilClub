import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import athletesRouter from '../../../routes/athletes';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

app.get('/healthcheck', (c) => c.json({ status: 'ok' }));
app.route('/athletes', athletesRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
