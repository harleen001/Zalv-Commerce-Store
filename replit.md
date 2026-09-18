# Zalv Store

Zalv is a Jalandhar-made leather and fragrance storefront with Supabase-backed accounts, cash-on-delivery checkout, and order management.

## Run & Operate

- `pnpm --filter @workspace/zalv-store run dev` — run the storefront through its managed workflow
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `PORT=4173 BASE_PATH=/ pnpm --filter @workspace/zalv-store run build` — build the storefront locally
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite, wouter, Tailwind CSS
- Data/auth: Supabase Auth and Postgres via `@supabase/supabase-js`
- Build: Vite

## Where things live

- `artifacts/zalv-store/src/App.tsx` — routes, storefront shell, cart, account, checkout, welcome story, and admin UI
- `artifacts/zalv-store/src/lib/store.ts` — Supabase data layer plus a catalog/localStorage preview fallback
- `artifacts/zalv-store/src/index.css` — Zalv typography, palette, layout, and responsive rules
- `supabase/schema.sql` — Supabase tables, row-level security policies, trigger, and 12-product seed catalog

## Architecture decisions

- Supabase owns authentication and durable order data; the client uses only the public anon key.
- Product browsing remains usable before the Supabase schema is seeded via a local 12-product preview catalog.
- Admin visibility is driven by `profiles.is_admin`; database row-level security remains the source of truth for writes.
- Checkout is cash on delivery only and creates an order plus line items in one customer-owned flow.

## Product

- Four perfumes, four leather shoes/boots, and four jackets.
- Jalandhar origin story popup on first load with dismiss controls.
- Account sign-up/sign-in, local cart persistence, COD checkout, confirmation popup, and customer order history.
- Admin order ledger with customer/destination details and confirmed, shipped, delivered, or cancelled status changes.

## User preferences

- The user asked for the “fearless objects” brand treatment to feel sharper and supplied the Zalv logo and a welcome popup reference.
- Keep the store focused on India and cash on delivery for this version.

## Gotchas

- Run `supabase/schema.sql` in the Supabase SQL editor before expecting durable products/orders.
- After creating the admin account, set `profiles.is_admin = true` for that profile. The UI alone does not grant admin rights.
- The current Supabase anon key response is returning `Invalid API key`; replace `VITE_SUPABASE_ANON_KEY` with the current project anon key before production use.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
