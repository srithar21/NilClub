# CLAUDE.md — NIL Club Earnings Tracker

## Project Overview

NIL Club is a platform where student-athletes monetize their Name, Image, and Likeness (NIL).
This assessment builds an Athlete Earnings Tracker — a mobile app where athletes can view
their brand deals and payment history.

## Monorepo Structure

your-project/
├── apps/
│ ├── mobile/ — React Native + Expo (Expo Router v4)
│ └── api/ — Next.js 16 App Router with Hono routes
├── packages/
│ └── database/ — Drizzle ORM schema + queries + seed script
├── turbo.json
├── package.json
└── pnpm-workspace.yaml

## Tech Stack

- **Monorepo:** Turborepo
- **Mobile:** React Native 0.81+ / Expo SDK 54 / Expo Router v4
- **API:** Next.js 16 App Router + Hono + Zod
- **Database:** Drizzle ORM + Neon Postgres (@neondatabase/serverless)
- **State:** TanStack Query v5
- **Language:** TypeScript 5.x strict mode

## Database Schema

Three core tables:

- `athletes` — id, name, sport, school, created_at
- `deals` — id, athlete_id, brand, value (numeric/decimal, NOT float), status, created_at
- `payments` — id, deal_id, amount (numeric/decimal, NOT float), status, paid_at, created_at

### Deal statuses: `active` | `pending` | `completed`

### Payment statuses: `paid` | `pending`

## API Endpoints (Hono + Zod)

- GET /api/athletes
- GET /api/athletes/:id
- GET /api/athletes/:id/deals
- GET /api/athletes/:id/earnings
- GET /api/deals/:id/payments

All endpoints use Zod for request/response validation.

## Mobile Screens

1. **Earnings Overview** — pixel-perfect match to provided mockup
   - Athlete header (name, sport, school)
   - Total earnings card (paid vs pending, progress bar)
   - Active deals list (brand initials, status pill, payment progress, deal value)
   - Bottom tab bar (Earnings / Deals / Profile — only Earnings functional)

2. **Deal Detail** — tapping a deal shows payment history
   - Individual payments with amount, status, date
   - Matches visual style of Earnings Overview

Both screens: loading state, error state with retry, pull-to-refresh.

## Seed Data

Run with: `pnpm db:seed`

Marcus Johnson (Basketball, Duke University):

- Nike deal: $15,000 — Payment 1: $5,000 paid, Payment 2: $5,000 paid, Payment 3: $4,500 pending
- Gatorade deal: $8,000 — 0 of 2 payments made (pending)
- EA Sports deal: $6,500 — 4 of 4 payments made (completed)

Include 2+ additional athletes with varied deal/payment statuses.

## Key Conventions

- Money stored as `numeric(10,2)` in Postgres — never float
- Strict TypeScript throughout — no `any`
- Small, focused files — one responsibility per file
- TanStack Query for all server state; useState for UI-only state
- Error boundaries and loading states on every data-fetching screen
- Currency formatted as USD with proper decimal display

## Environment Variables

packages/database/.env
DATABASE_URL=your_neon_connection_string

## Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps (turbo)
pnpm db:push          # push schema to neon
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed the database
```

## What NOT to Build

- Authentication / login
- Automated tests
- Deployment config
- Animations or dark mode

## Assumptions

- Athlete ID is hardcoded to Marcus Johnson for the demo (no auth)
- Deal "value" represents the total contract value
- "Pending" deal = deal signed but no payments started yet
- "Completed" deal = all payments received
- "Active" deal = payments in progress
