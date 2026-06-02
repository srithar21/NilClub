import { pgEnum, pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const dealStatusEnum = pgEnum('deal_status', ['pending', 'active', 'completed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'pending', 'failed']);

export const athletes = pgTable('athletes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sport: varchar('sport', { length: 100 }).notNull(),
  school: varchar('school', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  athleteId: integer('athlete_id')
    .notNull()
    .references(() => athletes.id),
  brandName: varchar('brand_name', { length: 255 }).notNull(),
  value: integer('value').notNull(),
  status: dealStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  dealId: integer('deal_id')
    .notNull()
    .references(() => deals.id),
  amount: integer('amount').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const athletesRelations = relations(athletes, ({ many }) => ({
  deals: many(deals),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  athlete: one(athletes, { fields: [deals.athleteId], references: [athletes.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  deal: one(deals, { fields: [payments.dealId], references: [deals.id] }),
}));
