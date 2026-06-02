import { Hono } from 'hono';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { db, athletes, deals, payments } from '@nil-club/database';

const AthleteSchema = z.object({
  id: z.number(),
  name: z.string(),
  sport: z.string(),
  school: z.string(),
});

const AthleteDetailSchema = AthleteSchema.extend({
  createdAt: z.date(),
});

const AthletesResponseSchema = z.array(AthleteSchema);

const athletesRouter = new Hono();

athletesRouter.get('/', async (c) => {
  const rows = await db
    .select({
      id: athletes.id,
      name: athletes.name,
      sport: athletes.sport,
      school: athletes.school,
    })
    .from(athletes);

  return c.json(AthletesResponseSchema.parse(rows));
});

const DealSchema = z.object({
  id: z.number(),
  brandName: z.string(),
  value: z.number(),
  status: z.enum(['pending', 'active', 'completed', 'cancelled']),
  createdAt: z.date(),
  totalPayments: z.number(),
  paidPayments: z.number(),
});

const DealsResponseSchema = z.array(DealSchema);

athletesRouter.get('/:id/deals', async (c) => {
  const athleteId = Number(c.req.param('id'));

  if (!Number.isInteger(athleteId) || athleteId <= 0) {
    return c.json({ error: 'No deals for the given athlete' }, 404);
  }

  const rows = await db
    .select({
      id: deals.id,
      brandName: deals.brandName,
      value: deals.value,
      status: deals.status,
      createdAt: deals.createdAt,
      totalPayments: sql<number>`cast(count(${payments.id}) as integer)`,
      paidPayments: sql<number>`cast(count(case when ${payments.status} = 'paid' then 1 end) as integer)`,
    })
    .from(deals)
    .leftJoin(payments, eq(payments.dealId, deals.id))
    .where(eq(deals.athleteId, athleteId))
    .groupBy(deals.id);

  if (rows.length === 0) {
    return c.json({ error: 'No deals for the given athlete' }, 404);
  }

  return c.json(DealsResponseSchema.parse(rows));
});

athletesRouter.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'Athlete not found' }, 404);
  }

  const rows = await db
    .select({
      id: athletes.id,
      name: athletes.name,
      sport: athletes.sport,
      school: athletes.school,
      createdAt: athletes.createdAt,
    })
    .from(athletes)
    .where(eq(athletes.id, id))
    .limit(1);

  if (rows.length === 0) {
    return c.json({ error: 'Athlete not found' }, 404);
  }

  return c.json(AthleteDetailSchema.parse(rows[0]));
});

export default athletesRouter;
