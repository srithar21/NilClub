import { config } from 'dotenv';

config({ path: '../../.env' });

import { db } from './client';
import { athletes, deals, payments } from './schema';

async function seed() {
  console.log('Seeding database...');

  // Clear in dependency order
  await db.delete(payments);
  await db.delete(deals);
  await db.delete(athletes);

  // ── Marcus Johnson ──────────────────────────────────────────────
  const [marcus] = await db
    .insert(athletes)
    .values({ name: 'Marcus Johnson', sport: 'Basketball', school: 'Duke University' })
    .returning();

  const [nikeDeal] = await db
    .insert(deals)
    .values({ athleteId: marcus.id, brandName: 'Nike', value: 1500000, status: 'active' })
    .returning();

  await db.insert(payments).values([
    { dealId: nikeDeal.id, amount: 500000, status: 'paid',    paidAt: new Date('2024-01-15') },
    { dealId: nikeDeal.id, amount: 500000, status: 'paid',    paidAt: new Date('2024-03-15') },
    { dealId: nikeDeal.id, amount: 500000, status: 'pending', paidAt: null },
  ]);

  // Gatorade — pending, no payments started
  const [gatoradeDeal] = await db
    .insert(deals)
    .values({ athleteId: marcus.id, brandName: 'Gatorade', value: 800000, status: 'pending' })
    .returning();

  await db.insert(payments).values([
    { dealId: gatoradeDeal.id, amount: 400000, status: 'pending', paidAt: null },
    { dealId: gatoradeDeal.id, amount: 400000, status: 'pending', paidAt: null },
  ]);

  // EA Sports — completed, all 4 payments paid
  const [eaDeal] = await db
    .insert(deals)
    .values({ athleteId: marcus.id, brandName: 'EA Sports', value: 650000, status: 'completed' })
    .returning();

  await db.insert(payments).values([
    { dealId: eaDeal.id, amount: 162500, status: 'paid', paidAt: new Date('2023-06-01') },
    { dealId: eaDeal.id, amount: 162500, status: 'paid', paidAt: new Date('2023-09-01') },
    { dealId: eaDeal.id, amount: 162500, status: 'paid', paidAt: new Date('2023-12-01') },
    { dealId: eaDeal.id, amount: 162500, status: 'paid', paidAt: new Date('2024-03-01') },
  ]);

  // ── Aaliyah Torres ──────────────────────────────────────────────
  const [aaliyah] = await db
    .insert(athletes)
    .values({ name: 'Aaliyah Torres', sport: 'Soccer', school: 'UCLA' })
    .returning();

  const [adidasDeal] = await db
    .insert(deals)
    .values({ athleteId: aaliyah.id, brandName: 'Adidas', value: 1200000, status: 'active' })
    .returning();

  await db.insert(payments).values([
    { dealId: adidasDeal.id, amount: 400000, status: 'paid',    paidAt: new Date('2024-02-01') },
    { dealId: adidasDeal.id, amount: 400000, status: 'paid',    paidAt: new Date('2024-04-01') },
    { dealId: adidasDeal.id, amount: 400000, status: 'pending', paidAt: null },
  ]);

  const [powerade] = await db
    .insert(deals)
    .values({ athleteId: aaliyah.id, brandName: 'Powerade', value: 500000, status: 'completed' })
    .returning();

  await db.insert(payments).values([
    { dealId: powerade.id, amount: 250000, status: 'paid', paidAt: new Date('2023-10-01') },
    { dealId: powerade.id, amount: 250000, status: 'paid', paidAt: new Date('2024-01-01') },
  ]);

  // ── Jordan Williams ─────────────────────────────────────────────
  const [jordan] = await db
    .insert(athletes)
    .values({ name: 'Jordan Williams', sport: 'Track & Field', school: 'University of Oregon' })
    .returning();

  const [newBalance] = await db
    .insert(deals)
    .values({ athleteId: jordan.id, brandName: 'New Balance', value: 900000, status: 'active' })
    .returning();

  await db.insert(payments).values([
    { dealId: newBalance.id, amount: 300000, status: 'paid',    paidAt: new Date('2024-03-01') },
    { dealId: newBalance.id, amount: 300000, status: 'pending', paidAt: null },
    { dealId: newBalance.id, amount: 300000, status: 'pending', paidAt: null },
  ]);

  const [underArmour] = await db
    .insert(deals)
    .values({ athleteId: jordan.id, brandName: 'Under Armour', value: 400000, status: 'pending' })
    .returning();

  await db.insert(payments).values([
    { dealId: underArmour.id, amount: 200000, status: 'pending', paidAt: null },
    { dealId: underArmour.id, amount: 200000, status: 'pending', paidAt: null },
  ]);

  console.log('Seed complete.');
  console.log('  Athletes : Marcus Johnson, Aaliyah Torres, Jordan Williams');
  console.log('  Deals    : Nike, Gatorade, EA Sports, Adidas, Powerade, New Balance, Under Armour');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
